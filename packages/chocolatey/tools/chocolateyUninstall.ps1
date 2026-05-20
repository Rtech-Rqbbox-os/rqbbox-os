$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'rqbbox-os'
  softwareName   = 'RQBBOX OS*'
  fileType       = 'EXE'
  silentArgs     = '/S'
  validExitCodes = @(0)
}

Uninstall-ChocolateyPackage @packageArgs
