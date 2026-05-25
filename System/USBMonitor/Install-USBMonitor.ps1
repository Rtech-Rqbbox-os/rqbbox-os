# Install RQBBOX USB Monitor — runs Enable-Autorun setup
# This installs a background watcher that auto-launches when USB is plugged in

$script = Join-Path $PSScriptRoot "Enable-Autorun.ps1"
Write-Host "Installing RQBBOX USB Monitor..." -ForegroundColor Cyan
& powershell.exe -ExecutionPolicy Bypass -File "`"$script`""
Write-Host "`nRQBBOX USB Monitor installed. Unplug/replug your USB to test." -ForegroundColor Green
