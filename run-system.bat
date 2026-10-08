@echo off
title Cybersecurity Digital Twin Launcher
color 0b
echo =====================================================================
echo    AI-Based Cybersecurity Digital Twin with Attack Prediction
echo    Enterprise SOC: React 18 + Node.js/Express + Oracle Database
echo =====================================================================
echo.

set ROOT_DIR=%~dp0

echo [1/3] Checking Oracle Database via SQL*Plus...
where sqlplus >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] SQL*Plus detected. Ensuring schema and seed data are ready...
    call "%ROOT_DIR%database\setup_oracle.bat" >nul 2>nul
) else (
    echo [NOTICE] sqlplus command not detected in PATH; using resilient dual-mode adapter.
)

echo [2/3] Starting Express Backend & Prediction Engine (:5000)...
start "Cyber-Twin Backend [Node.js/Express :5000]" cmd /k "cd /d %ROOT_DIR%backend && node server.js"

timeout /t 3 /nobreak >nul

echo [3/3] Starting React Enterprise SOC Dashboard (:3000)...
start "Cyber-Twin Frontend [React/Vite :3000]" cmd /k "cd /d %ROOT_DIR%frontend && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo.
echo =====================================================================
echo    All services initialized!
echo    Frontend SOC:  http://localhost:3000
echo    Backend API:   http://localhost:5000/api/health
echo    Oracle Mode:   CYBER_TWIN@localhost:1521/XE (14 Tables)
echo =====================================================================
echo Opening browser...
start http://localhost:3000
pause
