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
    private static final String FRAUD_SERVICE_URL = System.getenv().getOrDefault("FRAUD_SERVICE_URL", "http://fraud-service:8081/api/check");
    private static final String CMS_SERVICE_URL = System.getenv().getOrDefault("CMS_SERVICE_URL", "http://host.docker.internal:8082/api/transaction");

    public SwitchRequestListener() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
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
                
                // 1. Check Fraud
                if (isFraudulent(cardNumber, amount)) {
                    System.out.println(">>> [jPOS] Fraud Detected");
                    resp.set(39, "34"); // Suspected Fraud
                } else {
                    // 2. Authorize with CMS (which calls Fineract)
                    System.out.println(">>> [jPOS] Calling CMS...");
                    boolean authorized = authorizeTransaction(cardNumber, amount, merchantId, merchantName);
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

    private boolean authorizeTransaction(String cardNumber, String amount, String merchantId, String merchantName) {
        // Call CMS for authorization
         try {
            // Convert amount from cents to dollars
            double amountInDollars = Double.parseDouble(amount) / 100.0;
            
            // Format JSON payload safely escaping characters if needed
            String jsonBody = String.format(java.util.Locale.US,
                "{\"cardNumber\":\"%s\", \"amount\":%.2f, \"merchantId\":\"%s\", \"merchantName\":\"%s\"}", 
                cardNumber, amountInDollars, 
                merchantId.replace("\"", "\\\""), 
                merchantName.replace("\"", "\\\"")
            );
            System.out.println(">>> [jPOS] Sending payload to CMS: " + jsonBody);
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(CMS_SERVICE_URL))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
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
