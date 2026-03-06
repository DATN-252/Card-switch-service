@echo off
set "PAN=%1"
set "AMOUNT=%2"

if "%PAN%"=="" set "PAN=9999888877776666"
if "%AMOUNT%"=="" set "AMOUNT=500"

echo [Running] Sending ISO 8583 Message...
echo Card: %PAN%
echo Amount: %AMOUNT%
echo.

if not exist "out" mkdir out
javac -cp "jpos/build/install/jpos/lib/*;jpos/build/libs/*" jpos/src/main/java/com/bkbank/test/SimpleIsoSender.java -d out

xcopy jpos\src\main\resources\packager packager /E /I /Y >nul 2>&1

java -cp "out;jpos/build/install/jpos/lib/*;jpos/build/libs/*" com.bkbank.test.SimpleIsoSender %PAN% %AMOUNT%
echo.
pause
