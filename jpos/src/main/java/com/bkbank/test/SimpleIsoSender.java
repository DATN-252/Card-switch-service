package com.bkbank.test;

import org.jpos.iso.ISOMsg;
import org.jpos.iso.ISOException;
import org.jpos.iso.packager.GenericPackager;
import org.jpos.iso.channel.ASCIIChannel;

public class SimpleIsoSender {
    
    public static void main(String[] args) {
        String pan = args.length > 0 ? args[0] : "9999888877776666"; // Default Credit Card
        double amount = args.length > 1 ? Double.parseDouble(args[1]) : 500.00; // Default $500

        System.out.println("=== Sending Single ISO 8583 Message ===");
        System.out.println("PAN: " + pan);
        System.out.println("Amount: $" + amount);
        
        try {
            // Setup packager
            GenericPackager packager = new GenericPackager("packager/iso87ascii.xml");
            
            // Connect to jPOS server
            ASCIIChannel channel = new ASCIIChannel("localhost", 10000, packager);
            channel.connect();
            
            // Create Message
            ISOMsg msg = new ISOMsg();
            msg.setMTI("0200");
            msg.set(2, pan);
            msg.set(3, "000000"); 
            msg.set(4, String.format("%012d", (long)(amount * 100))); 
            msg.set(7, new java.text.SimpleDateFormat("MMddHHmmss").format(new java.util.Date()));
            msg.set(11, String.format("%06d", (int)(Math.random() * 1000000))); 
            
            System.out.println("Sending...");
            channel.send(msg);
            
            ISOMsg response = channel.receive();
            String responseCode = response.getString(39);
            
            System.out.println("Response Received!");
            System.out.println("MTI: " + response.getMTI());
            System.out.println("Response Code: " + responseCode);
            
            if ("00".equals(responseCode)) {
                System.out.println(">> ✅ TRANSACTION APPROVED");
            } else {
                System.out.println(">> ❌ TRANSACTION DECLINED (Code " + responseCode + ")");
            }
            
            channel.disconnect();
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
