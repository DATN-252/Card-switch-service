import { NextResponse } from 'next/server';
import net from 'net';

// Helper to pad strings
const padRight = (str: string, len: number, char = ' ') => str.padEnd(len, char).slice(0, len);
const padLeft = (str: string | number, len: number, char = '0') => String(str).padStart(len, char).slice(0, len);

// TCP Socket Promise wrapper
function sendIsoMessage(isoMessage: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        let responseData = '';

        client.connect(10000, '127.0.0.1', () => {
            console.log('[POS Simulator] Connected to jPOS TCP Port 10000');
            console.log('[POS Simulator] Sending:', isoMessage);
            client.write(isoMessage);
        });

        client.on('data', (data) => {
            const chunk = data.toString();
            console.log('[POS Simulator] Received chunk:', chunk);
            responseData += chunk;

            // Basic check to see if we got the full message based on 4-char length header
            if (responseData.length >= 4) {
                const expectedLen = parseInt(responseData.substring(0, 4), 10);
                if (responseData.length >= expectedLen + 4) {
                    client.destroy(); // Got full message
                    resolve(responseData);
                }
            }
        });

        client.on('error', (err) => {
            console.error('[POS Simulator] TCP Error:', err.message);
            client.destroy();
            reject(err);
        });

        client.on('timeout', () => {
            console.error('[POS Simulator] TCP Timeout');
            client.destroy();
            reject(new Error('TCP Timeout'));
        });

        // Timeout after 10 seconds
        client.setTimeout(10000);
    });
}

function parseIsoResponse(isoResponse: string) {
    if (!isoResponse || isoResponse.length < 24) throw new Error("Invalid ISO Response length");

    // Header (4), MTI (4), Bitmap (16)
    let pointer = 24;

    // Field 2 (LLVAR)
    const f2Len = parseInt(isoResponse.substring(pointer, pointer + 2), 10);
    pointer += 2;
    const pan = isoResponse.substring(pointer, pointer + f2Len);
    pointer += f2Len;

    // Field 3 (Fixed 6) -> Processing Code
    pointer += 6;

    // Field 4 (Fixed 12) -> Amount
    pointer += 12;

    // Field 7 (Fixed 10) -> Date
    pointer += 10;

    // Field 11 (Fixed 6) -> STAN
    const stan = isoResponse.substring(pointer, pointer + 6);
    pointer += 6;

    // Field 39 (Fixed 2) -> Response Code
    const responseCode = isoResponse.substring(pointer, pointer + 2);
    pointer += 2;

    return {
        pan,
        stan,
        responseCode,
        raw: isoResponse
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { pan, amount, merchantId = "STORE01", merchantName = "Test Store" } = body;

        if (!pan || !amount) {
            return NextResponse.json({ error: "Missing pan or amount" }, { status: 400 });
        }

        // Build ISO Message
        const mti = "0200";
        // Bitmap with fields: 2, 3, 4, 7, 11, 42, 43
        // 01110010 00100000 00000000 00000000 00000000 01100000 00000000 00000000
        const bitmap = "7220000000600000";

        // Field 2 (LLVAR): 2 digits length + PAN
        const f2 = padLeft(pan.length, 2) + pan;

        // Field 3: Processing Code "000000" (Purchase)
        const f3 = "000000";

        // Field 4: Amount in cents (12 characters, padded with leading 0)
        const amountCents = Math.round(Number(amount) * 100);
        const f4 = padLeft(amountCents, 12);

        // Field 7: Date 10 chars (MMDDHHMISS)
        const d = new Date();
        const f7 = padLeft(d.getMonth() + 1, 2) + padLeft(d.getDate(), 2) +
            padLeft(d.getHours(), 2) + padLeft(d.getMinutes(), 2) + padLeft(d.getSeconds(), 2);

        // Field 11: STAN (6 digits rand)
        const f11 = padLeft(Math.floor(Math.random() * 900000) + 100000, 6);

        // Field 42: Merchant ID (Fixed 15, right padded spaces)
        const f42 = padRight(merchantId, 15);

        // Field 43: Merchant Name (Fixed 40, right padded spaces)
        const f43 = padRight(merchantName, 40);

        // Concatenate without length header yet
        const payload = mti + bitmap + f2 + f3 + f4 + f7 + f11 + f42 + f43;

        // Add 4-byte ASCII length header
        const finalMessage = padLeft(payload.length, 4) + payload;

        // Send TCP
        const responseData = await sendIsoMessage(finalMessage);

        // Parse the response
        const parsed = parseIsoResponse(responseData);

        return NextResponse.json({
            status: parsed.responseCode === '00' ? "APPROVED" : "DECLINED",
            code: parsed.responseCode,
            stan: parsed.stan,
            pan: parsed.pan,
            error: parsed.responseCode !== '00' ? "Transaction Declined by jPOS" : null
        });

    } catch (err: any) {
        console.error("API Route Error:", err.message);
        return NextResponse.json({
            error: "Internal Error",
            message: err.message,
            status: "COMM_ERROR"
        }, { status: 500 });
    }
}
