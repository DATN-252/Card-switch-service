@echo off
echo ==========================================
echo      DEMO: ISO 8583 Client (ATM/POS)
echo ==========================================
echo.
echo [1/3] Compiling Test Client...
if not exist "out" mkdir out
javac -cp "jpos/build/install/jpos/lib/*;jpos/build/libs/*" jpos/src/main/java/com/bkbank/test/E2ETest.java -d out
if %errorlevel% neq 0 (
    echo Compilation Failed!
    pause
    exit /b %errorlevel%
)

echo [2/3] Setting up resources...
xcopy jpos\src\main\resources\packager packager /E /I /Y >nul

echo [3/3] STARTING ISO CLIENT...
echo.
echo ---------------------------------------------------
echo  Simulating POS Terminal -> Sending ISO 8583 to jPOS
echo ---------------------------------------------------
echo.
java -cp "out;jpos/build/install/jpos/lib/*;jpos/build/libs/*" com.bkbank.test.E2ETest
echo.
echo ==========================================
echo      DEMO COMPLETED
echo ==========================================
pause
