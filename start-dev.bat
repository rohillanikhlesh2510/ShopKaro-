@echo off
title ShopKaro Launcher
echo ====================================================
echo Starting ShopKaro E-Commerce System
echo ====================================================

echo [1/2] Launching Backend Server on port 5000...
start "ShopKaro Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"

echo [2/2] Launching Frontend Server on port 3000...
start "ShopKaro Frontend" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo.
echo ====================================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ====================================================
echo Servers are launching in separate windows!
