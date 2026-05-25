@echo off
title RQBBOX OS Portable USB ? RhysTech
cd /d "%~dp0"

:: Launch via Node.js server
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting RQBBOX OS server...
    start /min "" cmd /c "node System\Server\server.js"
    timeout /t 3 /nobreak >nul
    start "" "http://127.0.0.1:19777/"
    exit
)

:: Fallback: try parent directory launcher
if exist "..\Launch RQBBOX.bat" (
    call "..\Launch RQBBOX.bat"
    exit
)

:: Fallback: PowerShell launcher
powershell -ExecutionPolicy Bypass -File "%~dp0System\Launch-RQBBOX.ps1"
exit
