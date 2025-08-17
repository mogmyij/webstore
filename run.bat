@echo off
title Karvana Launcher

REM This starts the server script in a new window and waits for it to close.
start "Karvana Server" /wait cmd /c launch-admin.bat

REM --- The code below will only run AFTER the server window is closed ---

echo Server window closed. Running cleanup commands...

REM Add your cleanup command(s) here. For example, killing any lingering Node.js processes.
npm run deploy:public

echo Cleanup complete.
pause
