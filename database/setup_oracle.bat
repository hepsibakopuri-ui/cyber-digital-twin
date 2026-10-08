@echo off
REM =============================================================================
REM AI-BASED CYBERSECURITY DIGITAL TWIN WITH ATTACK PREDICTION
REM Oracle Database Setup Script using SQL*Plus
REM =============================================================================

echo =============================================================================
echo   Setting up Oracle Database for Cybersecurity Digital Twin via SQL*Plus
echo =============================================================================

set DB_USER=CYBER_TWIN
set DB_PASS=CyberTwin#2026
set DB_TNS=localhost:1521/XE

echo [1/3] Testing SQL*Plus connectivity...
where sqlplus >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] sqlplus is not found in your system PATH.
    echo Please ensure Oracle Database / Instant Client is installed.
    exit /b 1
)

echo [2/3] Executing database schema DDL via SQL*Plus...
sqlplus -S %DB_USER%/"%DB_PASS%"@%DB_TNS% @%~dp0schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Encountered issues running schema.sql as %DB_USER%.
    echo Attempting to initialize user via sysdba...
    sqlplus -S "/ as sysdba" @"%~dp0init_user.sql"
    sqlplus -S %DB_USER%/"%DB_PASS%"@%DB_TNS% @%~dp0schema.sql
)

echo [3/3] Loading realistic enterprise seed data via SQL*Plus...
sqlplus -S %DB_USER%/"%DB_PASS%"@%DB_TNS% @%~dp0seed_data.sql

echo =============================================================================
echo   Oracle Database Setup via SQL*Plus Completed!
echo =============================================================================
