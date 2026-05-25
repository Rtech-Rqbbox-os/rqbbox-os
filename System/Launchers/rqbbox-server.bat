@echo off
title RQBBOX OS Portable USB — Server
cd /d "%~dp0"
echo Starting RQBBOX Server...
start /B node "%~dp0..\Server\server.js"
echo Server started at http://127.0.0.1:19777/
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://127.0.0.1:19777/
echo.
echo RQBBOX OS running. Close this window to stop the server.
pause
