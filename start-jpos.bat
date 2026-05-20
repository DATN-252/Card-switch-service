@echo off
echo ============================================
echo   BkBank jPOS Switch Server Startup Script
echo ============================================

echo [0/5] Setting environment variables...
set CMS_SERVICE_URL=https://cms-service-production-692b.up.railway.app/api/transaction
set FRAUD_SERVICE_URL=https://inference-service-production-10b7.up.railway.app/api/check
set LEDGER_MERCHANTS_URL=https://core-ledger-service-production.up.railway.app/merchants?size=1000
set CMS_INTERNAL_API_KEY=jpos-to-cms-secret-key-2025
set LEDGER_SYSTEM_API_KEY=bkbank-internal-system-api-key-2025



echo [2/4] Building jPOS...
cd /d "%~dp0"
call .\gradlew.bat -p jpos installApp
if errorlevel 1 (
    echo BUILD FAILED!
    pause
    exit /b 1
)

echo [3/5] Copying deploy configs to install directory...
copy /Y "jpos\src\dist\deploy\10_switch_server.xml" "jpos\build\install\jpos\deploy\10_switch_server.xml"
copy /Y "jpos\src\dist\deploy\00_logger.xml" "jpos\build\install\jpos\deploy\00_logger.xml"

echo [4/5] Copying packager configs...
if not exist "jpos\build\install\jpos\packager" mkdir "jpos\build\install\jpos\packager"
xcopy /E /Y /I "jpos\src\main\resources\packager\*" "jpos\build\install\jpos\packager\" >nul
if not exist "jpos\build\install\jpos\packager\iso87ascii.xml" (
    echo PACKAGER COPY FAILED: jpos\build\install\jpos\packager\iso87ascii.xml not found
    pause
    exit /b 1
)

echo [5/5] Starting jPOS Q2 Server...
cd jpos\build\install\jpos
del /f jpos.pid >nul 2>&1
.\bin\q2.bat

pause
