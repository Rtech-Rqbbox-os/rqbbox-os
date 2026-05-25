# RQBBOX OS - Local API Server
# Serves launcher + provides USB filesystem, persistence, and launch APIs

param(
    [string]$DriveLetter = "H",
    [int]$Port = 19777
)

$ErrorActionPreference = "Stop"
$RQBRoot = "${DriveLetter}:\RQBBOX_OS"
$LauncherRoot = Join-Path $RQBRoot "System\Launcher"
$LogPath = Join-Path $RQBRoot "System\rqbbox-server.log"
$PidFile = Join-Path $RQBRoot "System\rqbbox-server.pid"

function Log($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogPath -Value "[$ts] $msg" -ErrorAction SilentlyContinue
}

function Safe-Path($rel) {
    if ([string]::IsNullOrWhiteSpace($rel)) { return $RQBRoot }
    $rel = $rel -replace '\\', '/'
    $rel = $rel.TrimStart('/')
    if ($rel -match '\.\.') { throw "Invalid path" }
    $full = Join-Path $RQBRoot ($rel -replace '/', '\')
    $full = [IO.Path]::GetFullPath($full)
    if (-not $full.StartsWith([IO.Path]::GetFullPath($RQBRoot), [StringComparison]::OrdinalIgnoreCase)) {
        throw "Path outside RQBBOX root"
    }
    return $full
}

function Read-JsonFile($rel) {
    $p = Safe-Path $rel
    if (-not (Test-Path $p)) { return $null }
    return Get-Content $p -Raw -Encoding UTF8 | ConvertFrom-Json
}

function Write-JsonFile($rel, $obj) {
    $p = Safe-Path $rel
    $dir = Split-Path $p -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $json = $obj | ConvertTo-Json -Depth 20
    [IO.File]::WriteAllText($p, $json, [Text.UTF8Encoding]::new($false))
}

function Get-Mime($path) {
    switch ([IO.Path]::GetExtension($path).ToLower()) {
        '.html' { 'text/html; charset=utf-8' }
        '.htm'  { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        '.webp' { 'image/webp' }
        '.wav'  { 'audio/wav' }
        '.mp3'  { 'audio/mpeg' }
        '.mp4'  { 'video/mp4' }
        '.webm' { 'video/webm' }
        '.txt'  { 'text/plain; charset=utf-8' }
        '.md'   { 'text/markdown; charset=utf-8' }
        default { 'application/octet-stream' }
    }
}

function Send-Response($ctx, $code, $body, $ctype = 'application/json') {
    $ctx.Response.StatusCode = $code
    $ctx.Response.Headers.Add('Access-Control-Allow-Origin', '*')
    $ctx.Response.Headers.Add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
    $ctx.Response.Headers.Add('Access-Control-Allow-Headers', 'Content-Type')
    $ctx.Response.ContentType = $ctype
    if ($body -is [byte[]]) {
        $ctx.Response.OutputStream.Write($body, 0, $body.Length)
    } elseif ($body -is [string]) {
        $bytes = [Text.Encoding]::UTF8.GetBytes($body)
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } elseif ($null -ne $body) {
        $json = $body | ConvertTo-Json -Depth 20 -Compress
        $bytes = [Text.Encoding]::UTF8.GetBytes($json)
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $ctx.Response.Close()
}

function Read-Body($ctx) {
    $reader = New-Object IO.StreamReader($ctx.Request.InputStream, $ctx.Request.ContentEncoding)
    $text = $reader.ReadToEnd()
    $reader.Close()
    if ([string]::IsNullOrWhiteSpace($text)) { return $null }
    try { return $text | ConvertFrom-Json } catch { return $text }
}

function List-Dir($rel) {
    $p = Safe-Path $rel
    if (-not (Test-Path $p)) { return @() }
    $items = Get-ChildItem $p -Force | ForEach-Object {
        @{
            name = $_.Name
            path = ($rel.TrimEnd('\','/') + '/' + $_.Name).TrimStart('/')
            type = if ($_.PSIsContainer) { 'folder' } else { 'file' }
            size = if ($_.PSIsContainer) { 0 } else { $_.Length }
            modified = $_.LastWriteTimeUtc.ToString('o')
            ext = $_.Extension
        }
    }
    return $items
}

function Copy-Recursive($src, $dst) {
    if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }
    Get-ChildItem $src -Force | ForEach-Object {
        $target = Join-Path $dst $_.Name
        if ($_.PSIsContainer) { Copy-Recursive $_.FullName $target }
        else { Copy-Item $_.FullName $target -Force }
    }
}

function Get-StorageInfo {
    $drive = $RQBRoot.Substring(0, 2)
    $vol = Get-Volume -DriveLetter $DriveLetter -ErrorAction SilentlyContinue
  if ($vol) {
        return @{
            drive = $drive
            label = $vol.FileSystemLabel
            freeBytes = $vol.SizeRemaining
            totalBytes = $vol.Size
            freeGB = [Math]::Round($vol.SizeRemaining / 1GB, 2)
            usedPct = [Math]::Round((($vol.Size - $vol.SizeRemaining) / $vol.Size) * 100, 1)
        }
    }
    $di = New-Object IO.DriveInfo($drive)
    return @{
        drive = $drive
        label = 'RQBBOX 0'
        freeBytes = $di.AvailableFreeSpace
        totalBytes = $di.TotalSize
        freeGB = [Math]::Round($di.AvailableFreeSpace / 1GB, 2)
        usedPct = [Math]::Round((($di.TotalSize - $di.AvailableFreeSpace) / $di.TotalSize) * 100, 1)
    }
}

function Handle-Api($ctx, $method, $path, $query) {
    $body = if ($method -in @('POST','DELETE')) { Read-Body $ctx } else { $null }

    switch -Regex ($path) {
        '^/api/storage$' {
            Send-Response $ctx 200 (Get-StorageInfo)
        }
        '^/api/config$' {
            if ($method -eq 'GET') {
                $cfg = Read-JsonFile 'Settings/config.json'
                Send-Response $ctx 200 @{ ok = $true; data = $cfg }
            } else {
                Write-JsonFile 'Settings/config.json' $body.data
                Send-Response $ctx 200 @{ ok = $true }
            }
        }
        '^/api/profiles$' {
            if ($method -eq 'GET') {
                $p = Read-JsonFile 'Profiles/profiles.json'
                Send-Response $ctx 200 @{ ok = $true; data = $p }
            } else {
                Write-JsonFile 'Profiles/profiles.json' $body.data
                Send-Response $ctx 200 @{ ok = $true }
            }
        }
        '^/api/store$' {
            $s = Read-JsonFile 'Store/catalog/store.json'
            Send-Response $ctx 200 @{ ok = $true; data = $s }
        }
        '^/api/files$' {
            $rel = $query['path']
            if (-not $rel) { $rel = '' }
            Send-Response $ctx 200 @{ ok = $true; path = $rel; items = (List-Dir $rel) }
        }
        '^/api/file/read$' {
            $rel = $query['path']
            $fp = Safe-Path $rel
            if (-not (Test-Path $fp)) { Send-Response $ctx 404 @{ ok = $false; error = 'Not found' }; return }
            if ((Get-Item $fp).PSIsContainer) { Send-Response $ctx 400 @{ ok = $false; error = 'Is directory' }; return }
            $ext = [IO.Path]::GetExtension($fp).ToLower()
            if ($ext -in @('.png','.jpg','.jpeg','.gif','.webp','.svg','.wav','.mp3','.mp4','.webm')) {
                $bytes = [IO.File]::ReadAllBytes($fp)
                Send-Response $ctx 200 $bytes (Get-Mime $fp)
            } else {
                $text = [IO.File]::ReadAllText($fp, [Text.UTF8Encoding]::new($false))
                Send-Response $ctx 200 @{ ok = $true; content = $text; path = $rel }
            }
        }
        '^/api/file/write$' {
            $rel = $body.path
            $fp = Safe-Path $rel
            $dir = Split-Path $fp -Parent
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
            if ($body.base64) {
                $bytes = [Convert]::FromBase64String($body.base64)
                [IO.File]::WriteAllBytes($fp, $bytes)
            } else {
                [IO.File]::WriteAllText($fp, [string]$body.content, [Text.UTF8Encoding]::new($false))
            }
            Send-Response $ctx 200 @{ ok = $true; path = $rel }
        }
        '^/api/file/delete$' {
            $rel = $body.path
            $fp = Safe-Path $rel
            if (Test-Path $fp) { Remove-Item $fp -Recurse -Force }
            Send-Response $ctx 200 @{ ok = $true }
        }
        '^/api/file/copy$' {
            $src = Safe-Path $body.from
            $dst = Safe-Path $body.to
            if ((Get-Item $src).PSIsContainer) { Copy-Recursive $src $dst }
            else {
                $dd = Split-Path $dst -Parent
                if (-not (Test-Path $dd)) { New-Item -ItemType Directory -Path $dd -Force | Out-Null }
                Copy-Item $src $dst -Force
            }
            Send-Response $ctx 200 @{ ok = $true }
        }
        '^/api/file/move$' {
            $src = Safe-Path $body.from
            $dst = Safe-Path $body.to
            $dd = Split-Path $dst -Parent
            if (-not (Test-Path $dd)) { New-Item -ItemType Directory -Path $dd -Force | Out-Null }
            Move-Item $src $dst -Force
            Send-Response $ctx 200 @{ ok = $true }
        }
        '^/api/launch$' {
            $rel = $body.path
            $fp = Safe-Path $rel
            if (-not (Test-Path $fp)) { Send-Response $ctx 404 @{ ok = $false; error = 'Not found' }; return }
            Start-Process -FilePath $fp -WorkingDirectory (Split-Path $fp -Parent)
            Send-Response $ctx 200 @{ ok = $true; launched = $rel }
        }
        '^/api/install$' {
            $id = $body.id
            $type = $body.type
            $pkgPath = Safe-Path "Store/packages/$id"
            $destFolder = if ($type -eq 'game') { 'Games' } else { 'Apps' }
            $dest = Safe-Path "$destFolder/$id"
            if (-not (Test-Path $pkgPath)) { Send-Response $ctx 404 @{ ok = $false; error = 'Package not found' }; return }
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Copy-Recursive $pkgPath $dest
            $profiles = Read-JsonFile 'Profiles/profiles.json'
            $key = if ($type -eq 'game') { 'games' } else { 'apps' }
            if ($profiles.installed.$key -notcontains $id) {
                $profiles.installed.$key += $id
            }
            $profiles.downloads += @{
                id = $id; type = $type; title = $body.title
                completedAt = (Get-Date -Format 'o'); path = "$destFolder/$id"
            }
            $nid = ($profiles.notifications | Measure-Object).Count + 1
            $profiles.notifications = @(@{ id = $nid; title = 'Install Complete'; message = "$($body.title) installed to USB."; time = 'Just now'; read = $false }) + @($profiles.notifications)
            Write-JsonFile 'Profiles/profiles.json' $profiles
            Send-Response $ctx 200 @{ ok = $true; path = "$destFolder/$id" }
        }
        '^/api/auth$' {
            $profiles = Read-JsonFile 'Profiles/profiles.json'
            $user = $profiles.users | Where-Object { $_.name -eq $body.username -or $_.id -eq $body.username } | Select-Object -First 1
            if (-not $user) { Send-Response $ctx 401 @{ ok = $false; error = 'User not found' }; return }
            if ($user.pin -and $user.pin -ne $body.password) { Send-Response $ctx 401 @{ ok = $false; error = 'Invalid PIN' }; return }
            Send-Response $ctx 200 @{ ok = $true; user = $user }
        }
        '^/api/register$' {
            $profiles = Read-JsonFile 'Profiles/profiles.json'
            $newUser = @{
                id = 'user-' + [guid]::NewGuid().ToString().Substring(0, 8)
                name = $body.name
                avatar = $body.name.Substring(0, 1).ToUpper()
                role = 'Member'
                pin = $body.password
                theme = 'neon-dark'
                recentApps = @()
                achievements = 0
                playTime = '0m'
                stats = @{
                    sessions = 0; minutesActive = 0; gamesLaunched = 0; appsLaunched = 0
                    achievements = 0; storeInstalls = 0; screenshots = 0; aiImages = 0
                    achievementNames = @()
                }
            }
            $profiles.users += $newUser
            Write-JsonFile 'Profiles/profiles.json' $profiles
            Send-Response $ctx 200 @{ ok = $true; user = $newUser }
        }
        '^/api/screenshot$' {
            $dir = Safe-Path 'Media/Screenshots'
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
            $name = 'screenshot-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.png'
            if ($body.base64) {
                $bytes = [Convert]::FromBase64String($body.base64)
                [IO.File]::WriteAllBytes((Join-Path $dir $name), $bytes)
            }
            Send-Response $ctx 200 @{ ok = $true; path = "Media/Screenshots/$name" }
        }
        '^/api/notify$' {
            $profiles = Read-JsonFile 'Profiles/profiles.json'
            $nid = ($profiles.notifications | Measure-Object).Count + 1
            $profiles.notifications = @(@{
                id = $nid; title = $body.title; message = $body.message
                time = 'Just now'; read = $false
            }) + @($profiles.notifications)
            Write-JsonFile 'Profiles/profiles.json' $profiles
            Send-Response $ctx 200 @{ ok = $true }
        }
        default {
            Send-Response $ctx 404 @{ ok = $false; error = 'Unknown API' }
        }
    }
}

function Serve-Static($ctx, $urlPath) {
    $rel = $urlPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rel) -or $rel -eq '/') { $rel = 'index.html' }

    # Map URL paths to filesystem
    if ($rel.StartsWith('branding/')) {
        $filePath = Join-Path (Join-Path $RQBRoot 'System/Branding') ($rel.Substring(9) -replace '/', '\')
    }
    elseif ($rel.StartsWith('store/')) {
        $filePath = Join-Path $RQBRoot ($rel -replace '/', '\')
    }
    elseif ($rel.StartsWith('games/')) {
        $filePath = Join-Path $RQBRoot ($rel -replace '/', '\')
    }
    elseif ($rel.StartsWith('apps/')) {
        $filePath = Join-Path $RQBRoot ($rel -replace '/', '\')
    }
    elseif ($rel.StartsWith('media/')) {
        $filePath = Join-Path $RQBRoot ($rel -replace '/', '\')
    }
    else {
        $filePath = Join-Path $LauncherRoot ($rel -replace '/', '\')
    }

    $filePath = [IO.Path]::GetFullPath($filePath)
    if (-not $filePath.StartsWith([IO.Path]::GetFullPath($RQBRoot), [StringComparison]::OrdinalIgnoreCase) -and
        -not $filePath.StartsWith([IO.Path]::GetFullPath($LauncherRoot), [StringComparison]::OrdinalIgnoreCase)) {
        Send-Response $ctx 403 '{"ok":false}' ; return
    }

    if (-not (Test-Path $filePath) -or (Get-Item $filePath).PSIsContainer) {
        Send-Response $ctx 404 '{"ok":false,"error":"Not found"}'
        return
    }

    $bytes = [IO.File]::ReadAllBytes($filePath)
    Send-Response $ctx 200 $bytes (Get-Mime $filePath)
}

# --- Start server ---
if (-not (Test-Path $RQBRoot)) { Write-Host "RQBBOX root not found: $RQBRoot"; exit 1 }

$listener = New-Object Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
$PID | Set-Content $PidFile
Log "Server started on $prefix"

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $url = $req.Url.LocalPath
        $method = $req.HttpMethod
        $query = @{}
        foreach ($k in $req.QueryString.AllKeys) { if ($k) { $query[$k] = $req.QueryString[$k] } }

        try {
            if ($method -eq 'OPTIONS') { Send-Response $ctx 204 $null; continue }
            if ($url.StartsWith('/api/')) { Handle-Api $ctx $method $url $query }
            else { Serve-Static $ctx $url }
        } catch {
            Log "Error: $_"
            Send-Response $ctx 500 @{ ok = $false; error = $_.Exception.Message }
        }
    }
} finally {
    $listener.Stop()
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    Log "Server stopped"
}
