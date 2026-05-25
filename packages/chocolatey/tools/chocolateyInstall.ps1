$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'rqbbox-os'
  unzipLocation  = $toolsDir
  fileType       = 'EXE'
  url            = 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/download/v1.0.0/RQBBOX-OS-Setup-1.0.0.exe'
  url64bit       = 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/download/v1.0.0/RQBBOX-OS-Setup-1.0.0.exe'
  softwareName   = 'RQBBOX OS*'
  checksum       = 'UPDATE_AFTER_BUILD'
  checksumType   = 'sha256'
  checksum64     = 'UPDATE_AFTER_BUILD'
  checksumType64 = 'sha256'
  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
