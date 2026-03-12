package com.bkbank.cardswitch;

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

    // Service Endpoints (Env vars or defaults)
    private static final String FRAUD_SERVICE_URL = System.getenv().getOrDefault("FRAUD_SERVICE_URL", "http://localhost:8081/api/check");
    private static final String CMS_SERVICE_URL = System.getenv().getOrDefault("CMS_SERVICE_URL", "http://localhost:8082/api/transaction");
    private static final String CMS_INTERNAL_API_KEY = System.getenv().getOrDefault("CMS_INTERNAL_API_KEY", "jpos-to-cms-secret-key-2025");

    public SwitchRequestListener() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
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
                String[] locData = new String[3];
                resolveLocation(merchantId, locData);
                String location = locData[0];
                String latitude = locData[1];
                String longitude = locData[2];
                System.out.println(">>> [jPOS] Location: " + location + " (" + latitude + ", " + longitude + ")");
                
                // 1. Check Fraud
                if (isFraudulent(cardNumber, amount)) {
                    System.out.println(">>> [jPOS] Fraud Detected");
                    resp.set(39, "34"); // Suspected Fraud
                } else {
                    // 2. Authorize with CMS (which calls Fineract)
                    System.out.println(">>> [jPOS] Calling CMS...");
                    boolean authorized = authorizeTransaction(cardNumber, amount, merchantId, merchantName, location, latitude, longitude);
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

    private boolean authorizeTransaction(String cardNumber, String amount, String merchantId, String merchantName, String location, String latitude, String longitude) {
        // Call CMS for authorization
         try {
            // Convert amount from cents to dollars
            double amountInDollars = Double.parseDouble(amount) / 100.0;
            
            // Format JSON payload safely escaping characters if needed
            String jsonBody = String.format(java.util.Locale.US,
                "{\"cardNumber\":\"%s\", \"amount\":%.2f, \"merchantId\":\"%s\", \"merchantName\":\"%s\", \"location\":\"%s\", \"latitude\":%s, \"longitude\":%s}", 
                cardNumber, amountInDollars, 
                merchantId.replace("\"", "\\\""), 
                merchantName.replace("\"", "\\\""),
                location.replace("\"", "\\\""),
                latitude, longitude
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
    private void resolveLocation(String merchantId, String[] locationData) {
        // locationData[0] = location name, [1] = lat, [2] = lng
        switch (merchantId) {
            case "SP0001": // Điện lực EVN
                locationData[0] = "Hà Nội"; locationData[1] = "21.0285"; locationData[2] = "105.8542"; break;
            case "SP0002": // Nước Sạch SG
                locationData[0] = "TP. Hồ Chí Minh"; locationData[1] = "10.8231"; locationData[2] = "106.6297"; break;
            case "SP0003": // Internet VNPT
                locationData[0] = "Đà Nẵng"; locationData[1] = "16.0471"; locationData[2] = "108.2062"; break;
            case "SP0004": // Truyền hình VTVCab
                locationData[0] = "Hải Phòng"; locationData[1] = "20.8449"; locationData[2] = "106.6881"; break;
            case "STORE01": // Test Store
                locationData[0] = "Cần Thơ"; locationData[1] = "10.0452"; locationData[2] = "105.7469"; break;
            default:
                locationData[0] = "Unknown Location"; locationData[1] = "0.0"; locationData[2] = "0.0"; break;
        }
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
