@echo off
title Karvana Admin Console

echo Starting the Karvana development server...
echo You can close this window to stop the server and run cleanup.

REM Give the server a moment to start before opening the browser
timeout /t 5 /nobreak >nul

REM Opens the admin dashboard in the default web browser.
start "Karvana Admin" http://localhost:3000/admin

REM Starts the Next.js development server. This command will take over this window.
npm run dev
