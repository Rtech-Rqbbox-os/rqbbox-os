# RQBBOX OS Portable USB — Enable Autorun & Background Monitor
# Run once per PC: powershell -ExecutionPolicy Bypass -File .\Enable-Autorun.ps1

$ErrorActionPreference = "SilentlyContinue"
$ScriptDir = Split-Path $PSCommandPath -Parent
$RQBRoot = Resolve-Path (Join-Path $ScriptDir "..\..\")
$USBDrive = $RQBRoot.Path.Substring(0, 2)
$MonitorScript = Join-Path $ScriptDir "RQBBOX-BackgroundMonitor.ps1"
$StartupFolder = [Environment]::GetFolderPath("Startup")
$StartupShortcut = Join-Path $StartupFolder "RQBBOX USB Monitor.lnk"

Write-Host "=== RQBBOX OS Portable USB Setup ===" -ForegroundColor Cyan
Write-Host "Drive: $USBDrive" -ForegroundColor Gray

try {
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($StartupShortcut)
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$MonitorScript`" -DriveLetter $($USBDrive[0])"
    $shortcut.WorkingDirectory = $ScriptDir
    $shortcut.Description = "RQBBOX USB Monitor"
    $shortcut.Save()
    Write-Host "`u{2713} Added to Windows Startup"
} catch { Write-Host "~ Could not add to Startup" }

try {
    Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\AutoplayHandlers" EnableAutoPlay 1 -Type DWord
    Write-Host "`u{2713} AutoPlay enabled"
} catch { Write-Host "~ Could not enable AutoPlay" }

Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$MonitorScript`" -DriveLetter $($USBDrive[0])" -WindowStyle Hidden
Write-Host "`u{2713} Background monitor started"
Write-Host "$([char]10)Done! Plug in RQBBOX USB anytime - it auto-launches." -ForegroundColor Green
Write-Host "Unplug the USB to auto-close RQBBOX." -ForegroundColor Gray
