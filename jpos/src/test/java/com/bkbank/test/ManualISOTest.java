package com.bkbank.test;

import org.jpos.iso.ISOMsg;
import org.jpos.iso.channel.XMLChannel;
import org.jpos.iso.packager.XMLPackager;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ManualISOTest {
    @Test
    public void testIsoTransaction() {
        try {
            System.out.println("Connecting to jPOS at localhost:10000...");
            XMLChannel channel = new XMLChannel("localhost", 10000, new XMLPackager());
            channel.connect();
            
            // Create ISO 0200 Message (Financial Request)
            ISOMsg msg = new ISOMsg();
            msg.setMTI("0200");
            msg.set(2, "1234567890123456"); // Card Number
            msg.set(3, "000000"); // Processing Code
            msg.set(4, "000000010000"); // Amount (100.00)
            msg.set(7, org.jpos.iso.ISODate.getDateTime(new java.util.Date()));
            msg.set(11, "000001"); // STAN
            
            msg.setPackager(new XMLPackager()); // Set packager for local packing/printing
            System.out.println("Sending: " + new String(msg.pack()));
            channel.send(msg);
            
            ISOMsg response = channel.receive();
            System.out.println("Received Response MTI: " + response.getMTI());
            System.out.println("Response Code (F39): " + response.getString(39));
            
            // Expect 00 (Approved) because SwitchRequestListener defaults to false for Fraud (so runs authorization) 
            // and Authorize defaults to true.
            assertEquals("00", response.getString(39));
            
            channel.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
            fail("Exception during test: " + e.getMessage());
        }
    }
}
