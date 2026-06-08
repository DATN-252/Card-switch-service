#!/bin/bash

# Initialize SDKMAN if available to ensure correct Java version is in PATH
export SDKMAN_DIR="$HOME/.sdkman"
if [ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]; then
    source "$SDKMAN_DIR/bin/sdkman-init.sh"
    # Switch to the java/gradle version specified in .sdkmanrc
    sdk env
fi

echo "============================================"
echo "  BkBank jPOS Switch Server Startup Script  "
echo "============================================"

echo "[1/5] Setting environment variables..."
# Change localhost to your VPS IP if services are deployed on different hosts
export CMS_SERVICE_URL=${CMS_SERVICE_URL:-"https://cms-service-production-6aa4.up.railway.app/api/transaction"}
export FRAUD_SERVICE_URL=${FRAUD_SERVICE_URL:-"https://a32a-34-21-207-239.ngrok-free.app/api/check"}
export LEDGER_MERCHANTS_URL=${LEDGER_MERCHANTS_URL:-"https://core-ledger-service-production-9056.up.railway.app?size=1000"}
export CMS_INTERNAL_API_KEY=${CMS_INTERNAL_API_KEY:-"jpos-to-cms-secret-key-2025"}
export LEDGER_SYSTEM_API_KEY=${LEDGER_SYSTEM_API_KEY:-"bkbank-internal-system-api-key-2025"}

echo "[2/5] Building jPOS..."
chmod +x ./gradlew
./gradlew -p jpos installApp
if [ $? -ne 0 ]; then
    echo "BUILD FAILED!"
    exit 1
fi

echo "[3/5] Copying deploy configs to install directory..."
cp -v jpos/src/dist/deploy/10_switch_server.xml jpos/build/install/jpos/deploy/10_switch_server.xml
cp -v jpos/src/dist/deploy/00_logger.xml jpos/build/install/jpos/deploy/00_logger.xml

echo "[4/5] Copying packager configs..."
mkdir -p jpos/build/install/jpos/packager
cp -r jpos/src/main/resources/packager/* jpos/build/install/jpos/packager/

if [ ! -f "jpos/build/install/jpos/packager/iso87ascii.xml" ]; then
    echo "PACKAGER COPY FAILED: jpos/build/install/jpos/packager/iso87ascii.xml not found"
    exit 1
fi

echo "[5/5] Starting jPOS Q2 Server..."
cd jpos/build/install/jpos
rm -f jpos.pid
chmod +x bin/q2
./bin/q2
