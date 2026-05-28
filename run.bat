@echo off
set PATH=C:\Program Files\nodejs;%PATH%
echo ========================================
echo   NEXTFIT - ENTERPRISE SYSTEM
echo ========================================
echo.
echo Starting server...
echo.
echo   Store:  http://localhost:3000
echo   Admin:  http://localhost:3000/admin/login
echo   Login:  admin / admin123
echo.
"C:\Program Files\nodejs\node.exe" server.js
pause