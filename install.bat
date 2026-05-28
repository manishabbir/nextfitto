@echo off
set PATH=C:\Program Files\nodejs;%PATH%
echo Installing Nextfit Enterprise dependencies...
call npm install
echo.
echo Done! You can now run: npm start
pause