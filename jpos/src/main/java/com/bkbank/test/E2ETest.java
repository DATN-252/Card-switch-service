package com.bkbank.test;

import org.jpos.iso.ISOMsg;
import org.jpos.iso.ISOException;
import org.jpos.iso.packager.GenericPackager;
import org.jpos.iso.channel.ASCIIChannel;

import java.io.IOException;

public class E2ETest {
    
    public static void main(String[] args) {
        System.out.println("=== jPOS → CMS → Fineract E2E Test ===\n");
        
        try {
            // Setup packager
            GenericPackager packager = new GenericPackager("packager/iso87ascii.xml");
            
            // Connect to jPOS server
            ASCIIChannel channel = new ASCIIChannel("localhost", 10000, packager);
            channel.connect();
            System.out.println("✓ Connected to jPOS on port 10000\n");
            
            // Test 1: Credit Card Authorization (Should Approve)
            System.out.println("--- Test 1: Credit Card Authorization ($500) ---");
            ISOMsg creditCardMsg = createAuthMessage("9999888877776666", 500.00);
            channel.send(creditCardMsg);
            ISOMsg creditResponse = channel.receive();
            printResponse("Credit Card $500", creditResponse);
            
            // Test 2: Credit Card Exceeding Limit (Should Decline)
            System.out.println("\n--- Test 2: Credit Card Exceeding Limit ($50K) ---");
            ISOMsg exceedMsg = createAuthMessage("9999888877776666", 50000.00);
            channel.send(exceedMsg);
            ISOMsg exceedResponse = channel.receive();
            printResponse("Credit Card $50K", exceedResponse);
            
            // Test 3: Debit Card (Should Decline - Zero Balance)
            System.out.println("\n--- Test 3: Debit Card - Zero Balance ($100) ---");
            ISOMsg debitMsg = createAuthMessage("1111222233334444", 100.00);
            channel.send(debitMsg);
            ISOMsg debitResponse = channel.receive();
            printResponse("Debit Card $100", debitResponse);
            
            // Test 4: Invalid Card
            System.out.println("\n--- Test 4: Invalid Card Number ---");
            ISOMsg invalidMsg = createAuthMessage("0000000000000000", 10.00);
            channel.send(invalidMsg);
            ISOMsg invalidResponse = channel.receive();
            printResponse("Invalid Card", invalidResponse);
            
            channel.disconnect();
            System.out.println("\n=== Test Complete ===");
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static ISOMsg createAuthMessage(String pan, double amount) throws ISOException {
        ISOMsg msg = new ISOMsg();
        msg.setMTI("0200"); // Authorization request
        msg.set(2, pan);    // PAN
        msg.set(3, "000000"); // Processing code (purchase)
        msg.set(4, String.format("%012d", (long)(amount * 100))); // Amount in cents
        msg.set(7, getCurrentDateTime()); // Transmission date/time
        msg.set(11, generateSTAN()); // STAN
        msg.set(41, "TESTTERM"); // Terminal ID
        msg.set(42, "TESTMERCHANT01"); // Merchant ID
        msg.set(43, "BkBank Test Store"); // Merchant Name
        
        return msg;
    }
    
    private static void printResponse(String testName, ISOMsg response) throws ISOException {
        String responseCode = response.getString(39);
        String mti = response.getMTI();
        
        System.out.println("Test: " + testName);
        System.out.println("MTI: " + mti);
        System.out.println("Response Code: " + responseCode);
        
        String status;
        switch (responseCode) {
            case "00":
                status = "✓ APPROVED";
                break;
            case "51":
                status = "✗ DECLINED (Insufficient Funds/Credit Limit)";
                break;
            case "14":
                status = "✗ DECLINED (Invalid Card)";
                break;
            default:
                status = "? " + responseCode;
        }
        System.out.println("Status: " + status);
    }
    
    private static String getCurrentDateTime() {
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("MMddHHmmss");
        return sdf.format(new java.util.Date());
    }
    
    private static String generateSTAN() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }
}
