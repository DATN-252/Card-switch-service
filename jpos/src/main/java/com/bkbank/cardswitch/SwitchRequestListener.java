package com.bkbank.cardswitch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jpos.iso.ISOException;
import org.jpos.iso.ISOMsg;
import org.jpos.iso.ISORequestListener;
import org.jpos.iso.ISOSource;
import org.jpos.util.LogSource;
import org.jpos.util.Logger;
import org.jpos.util.SimpleLogListener;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class SwitchRequestListener implements ISORequestListener, LogSource {
    private Logger logger;
    private String realm;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    // Service Endpoints (Env vars or defaults)
    private static final String FRAUD_SERVICE_URL = System.getenv().getOrDefault("FRAUD_SERVICE_URL", "http://localhost:8081/api/check");
    private static final String CMS_SERVICE_URL = System.getenv().getOrDefault("CMS_SERVICE_URL", "http://localhost:8082/api/transaction");
    private static final String CMS_INTERNAL_API_KEY = System.getenv().getOrDefault("CMS_INTERNAL_API_KEY", "jpos-to-cms-secret-key-2025");
    private static final String LEDGER_MERCHANTS_URL = System.getenv().getOrDefault("LEDGER_MERCHANTS_URL", "http://localhost:8083/merchants?size=1000");
    private static final String LEDGER_SYSTEM_API_KEY = System.getenv().getOrDefault("LEDGER_SYSTEM_API_KEY", "bkbank-internal-system-api-key-2025");

    private static class MerchantContext {
        String location;
        String latitude;
        String longitude;
        String category;
        Integer cityPopulation;
    }

    public SwitchRequestListener() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public boolean process(ISOSource source, ISOMsg msg) {
        try {
            if ("0200".equals(msg.getMTI())) {
                System.out.println(">>> [jPOS] Received ISO 0200 Request");
                
                 // Clone message for response
                ISOMsg resp = (ISOMsg) msg.clone();
                resp.setResponseMTI();

                String cardNumber = msg.getString(2);
                String amount = msg.getString(4);
                
                // Extract Merchant Info
                // Field 42: Card Acceptor Identification Code (Merchant ID)
                String merchantId = msg.getString(42) != null ? msg.getString(42).trim() : "UNKNOWN_MERCHANT";
                // Field 43: Card Acceptor Name/Location
                String merchantName = msg.getString(43) != null ? msg.getString(43).trim() : "Unknown Location";
                
                System.out.println(">>> [jPOS] Card: " + cardNumber + ", Amount: " + amount);
                System.out.println(">>> [jPOS] Merchant: " + merchantId + " - " + merchantName);
                
                // Resolve Location info based on Merchant ID
                MerchantContext merchantContext = resolveMerchantContext(merchantId);
                String location = merchantContext.location;
                String latitude = merchantContext.latitude;
                String longitude = merchantContext.longitude;
                System.out.println(">>> [jPOS] Location: " + location + " (" + latitude + ", " + longitude + ")");
                
                // 1. Check Fraud
                if (isFraudulent(cardNumber, amount)) {
                    System.out.println(">>> [jPOS] Fraud Detected");
                    resp.set(39, "34"); // Suspected Fraud
                } else {
                    // 2. Authorize with CMS (which calls Fineract)
                    System.out.println(">>> [jPOS] Calling CMS...");
                    boolean authorized = authorizeTransaction(cardNumber, amount, merchantId, merchantName, merchantContext);
                    System.out.println(">>> [jPOS] CMS Response: " + authorized);
                    
                    if (authorized) {
                        resp.set(39, "00"); // Approved
                    } else {
                        resp.set(39, "51"); // Insufficient Funds / Declined
                    }
                }
                
                System.out.println(">>> [jPOS] Sending ISO Response...");
                source.send(resp);
                System.out.println(">>> [jPOS] Response Sent.");
                return true;
            }
        } catch (Exception e) {
            System.out.println(">>> [jPOS] ERROR: " + e.getMessage());
            e.printStackTrace(); // Log error
        }
        return false;
    }

    private boolean isFraudulent(String cardNumber, String amount) {
        // Mock Implementation / Actual HTTP Call
        // JSON body: {"cardNumber": "...", "amount": ...}
        // Return true if fraud detected
        try {
            String jsonBody = String.format("{\"cardNumber\":\"%s\", \"amount\":\"%s\"}", cardNumber, amount);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(FRAUD_SERVICE_URL))
                    .timeout(Duration.ofSeconds(1))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            // Uncomment to enable real call when service is ready
            // HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            // return response.statusCode() != 200;
            
            return false; // Default safe
        } catch (Exception e) {
            return false; // Fail open or close depending on policy
        }
    }

    private boolean authorizeTransaction(String cardNumber, String amount, String merchantId, String merchantName, MerchantContext merchantContext) {
        // Call CMS for authorization
         try {
            // Convert amount from cents to dollars
            double amountInDollars = Double.parseDouble(amount) / 100.0;
            String merchantCategory = merchantContext.category != null ? merchantContext.category : "misc_pos";
            String merchantCityPopulation = merchantContext.cityPopulation != null
                    ? merchantContext.cityPopulation.toString()
                    : "0";
            
            // Format JSON payload safely escaping characters if needed
            String jsonBody = String.format(java.util.Locale.US,
                "{\"cardNumber\":\"%s\", \"amount\":%.2f, \"merchantId\":\"%s\", \"merchantName\":\"%s\", \"location\":\"%s\", \"latitude\":%s, \"longitude\":%s, \"merchantCategory\":\"%s\", \"merchantLatitude\":%s, \"merchantLongitude\":%s, \"merchantCityPopulation\":%s}", 
                cardNumber, amountInDollars, 
                merchantId.replace("\"", "\\\""), 
                merchantName.replace("\"", "\\\""),
                merchantContext.location.replace("\"", "\\\""),
                merchantContext.latitude, merchantContext.longitude,
                merchantCategory.replace("\"", "\\\""),
                merchantContext.latitude, merchantContext.longitude,
                merchantCityPopulation
            );
            System.out.println(">>> [jPOS] Sending payload to CMS: " + jsonBody);
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(CMS_SERVICE_URL))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("X-Internal-Api-Key", CMS_INTERNAL_API_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            // Simple JSON parsing (check if "approved":true)
            return response.statusCode() == 200 && response.body().contains("\"approved\":true");

        } catch (Exception e) {
            e.printStackTrace();
            return false; 
        }
    }
    
    // Helper method to resolve location from Merchant ID
    private MerchantContext resolveMerchantContext(String merchantId) {
        MerchantContext merchantContext = new MerchantContext();
        if (loadMerchantContextFromLedger(merchantId, merchantContext)) {
            return merchantContext;
        }

        switch (merchantId) {
            case "SP0001": // Điện lực EVN
                merchantContext.location = "Hà Nội"; merchantContext.latitude = "21.0285"; merchantContext.longitude = "105.8542"; merchantContext.category = "UTILITY"; merchantContext.cityPopulation = 8000000; break;
            case "SP0002": // Nước Sạch SG
                merchantContext.location = "TP. Hồ Chí Minh"; merchantContext.latitude = "10.8231"; merchantContext.longitude = "106.6297"; merchantContext.category = "RETAIL"; merchantContext.cityPopulation = 9200000; break;
            case "SP0003": // Internet VNPT
                merchantContext.location = "Đà Nẵng"; merchantContext.latitude = "16.0471"; merchantContext.longitude = "108.2062"; merchantContext.category = "RETAIL"; merchantContext.cityPopulation = 1100000; break;
            case "SP0004": // Truyền hình VTVCab
                merchantContext.location = "Hải Phòng"; merchantContext.latitude = "20.8449"; merchantContext.longitude = "106.6881"; merchantContext.category = "entertainment"; merchantContext.cityPopulation = 2100000; break;
            case "STORE01": // Test Store
                merchantContext.location = "Cần Thơ"; merchantContext.latitude = "10.0452"; merchantContext.longitude = "105.7469"; merchantContext.category = "shopping_pos"; merchantContext.cityPopulation = 1250000; break;
            default:
                merchantContext.location = "Unknown Location"; merchantContext.latitude = "0.0"; merchantContext.longitude = "0.0"; merchantContext.category = "misc_pos"; merchantContext.cityPopulation = 0; break;
        }
        return merchantContext;
    }

    private boolean loadMerchantContextFromLedger(String merchantId, MerchantContext merchantContext) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(LEDGER_MERCHANTS_URL.replace("?size=1000", "") + "/" + merchantId))
                    .timeout(Duration.ofSeconds(3))
                    .header("Content-Type", "application/json")
                    .header("X-API-KEY", LEDGER_SYSTEM_API_KEY)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                System.out.println(">>> [jPOS] Failed to fetch merchants from ledger: " + response.statusCode());
                return false;
            }

            JsonNode merchant = objectMapper.readTree(response.body());
            String addressLine = merchant.path("addressLine").asText("");
            String ward = merchant.path("ward").asText("");
            String district = merchant.path("district").asText("");
            String cityName = merchant.path("cityName").asText("");
            String name = merchant.path("name").asText("");
            String postalCode = merchant.path("postalCode").asText("");
            String location = buildMerchantLocation(addressLine, ward, district, cityName, postalCode, name);
            JsonNode latitudeNode = merchant.get("latitude");
            JsonNode longitudeNode = merchant.get("longitude");
            if (latitudeNode == null || latitudeNode.isNull() || longitudeNode == null || longitudeNode.isNull()) {
                System.out.println(">>> [jPOS] Merchant found in ledger but latitude/longitude is missing. Falling back to local mapping.");
                return false;
            }

            String latitude = latitudeNode.asText();
            String longitude = longitudeNode.asText();
            if (latitude.isBlank() || longitude.isBlank() || "null".equalsIgnoreCase(latitude) || "null".equalsIgnoreCase(longitude)) {
                System.out.println(">>> [jPOS] Merchant found in ledger but latitude/longitude is blank. Falling back to local mapping.");
                return false;
            }

            merchantContext.location = location;
            merchantContext.latitude = latitude;
            merchantContext.longitude = longitude;
            merchantContext.category = merchant.path("category").asText("misc_pos");
            JsonNode cityPopulationNode = merchant.get("cityPopulation");
            merchantContext.cityPopulation = cityPopulationNode != null && !cityPopulationNode.isNull()
                    ? cityPopulationNode.asInt(0)
                    : 0;
            return true;
        } catch (Exception e) {
            System.out.println(">>> [jPOS] Merchant location lookup failed: " + e.getMessage());
        }
        return false;
    }

    private String buildMerchantLocation(String addressLine,
                                         String ward,
                                         String district,
                                         String cityName,
                                         String postalCode,
                                         String fallbackName) {
        StringBuilder builder = new StringBuilder();
        appendLocationPart(builder, addressLine);
        appendLocationPart(builder, ward);
        appendLocationPart(builder, district);
        appendLocationPart(builder, cityName);
        appendLocationPart(builder, postalCode);
        if (builder.length() == 0) {
            appendLocationPart(builder, fallbackName);
        }
        return builder.length() > 0 ? builder.toString() : "Unknown Location";
    }

    private void appendLocationPart(StringBuilder builder, String value) {
        if (value == null || value.isBlank()) {
            return;
        }
        if (builder.length() > 0) {
            builder.append(", ");
        }
        builder.append(value);
    }
    
    @Override
    public void setLogger(Logger logger, String realm) {
        this.logger = logger;
        this.realm = realm;
    }

    @Override
    public String getRealm() {
        return realm;
    }

    @Override
    public Logger getLogger() {
        return logger;
    }
}
