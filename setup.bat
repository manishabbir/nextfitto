@echo off
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo npm install failed. Trying alternative method...
    "C:\Program Files\nodejs\node.exe" -e "process.chdir('%~dp0'); require('child_process').execSync('npm install', {cwd:process.cwd(), stdio:'inherit'})"
)
echo.
echo Done! Run the server with: run.bat
pause