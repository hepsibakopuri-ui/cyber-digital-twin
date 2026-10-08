@echo off
echo Compiling Weka AI Engine...
if not exist "bin" mkdir bin
javac -cp "lib/*;." -d bin src/WekaAttackPredictor.java src/AttackPathPredictor.java src/WekaServer.java
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Compilation complete. Binaries in bin/
) else (
    echo [ERROR] Compilation failed.
)
