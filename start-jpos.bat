@echo off
echo ============================================
echo   BkBank jPOS Switch Server Startup Script
echo ============================================

echo [0/5] Setting environment variables...
set CMS_SERVICE_URL=http://localhost:8082/api/transaction
set CMS_INTERNAL_API_KEY=jpos-to-cms-secret-key-2025

echo [1/5] Stopping existing Java processes...
taskkill /F /IM java.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

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
xcopy /E /Y /I "jpos\src\main\resources\packager" "jpos\build\install\jpos\packager" >nul

echo [5/5] Starting jPOS Q2 Server...
cd jpos\build\install\jpos
del /f jpos.pid >nul 2>&1
.\bin\q2.bat

pause
