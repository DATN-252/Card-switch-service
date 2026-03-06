const net = require('net');

function getIsoMessage() {
    // 0200 + PAN(169999888877776666) + PCODE(000000) + AMOUNT(000000050000) + DATE(1231235959) + STAN(123456)
    // + MerchantID(MCD01          ) + MerchantName(McDonalds Hanoi                         )
    const mti = "0200";
    const bitmap = "7220000000600000";
    const f2 = "169999888877776666"; // LLVAR
    const f3 = "000000"; // Fixed 6
    const f4 = "000000050000"; // Fixed 12
    const f7 = "1231235959"; // Fixed 10
    const f11 = "123456"; // Fixed 6
    const f42 = "MCD01          "; // Fixed 15 (IF_CHAR)
    const f43 = "McDonalds Hanoi                         "; // Fixed 40 (IF_CHAR)

    const payload = mti + bitmap + f2 + f3 + f4 + f7 + f11 + f42 + f43;

    // ASCIIChannel uses 4 ASCII bytes for length prefix
    const lenStr = String(payload.length).padStart(4, '0');
    return lenStr + payload;
}

const client = new net.Socket();
client.connect(10000, '127.0.0.1', function () {
    console.log('Connected');
    const isoString = getIsoMessage();
    console.log('Sending: ' + isoString);
    client.write(isoString);
});

client.on('data', function (data) {
    console.log('Received: ' + data.toString());
    client.destroy(); // kill client after server's response
});

client.on('close', function () {
    console.log('Connection closed');
});
client.on('error', function (err) {
    console.error('Error:', err.message);
});
