; Custom NSIS installer script for RQBBOX OS
!macro customInit
  ; Check Windows 10 minimum requirement
  ${If} ${AtLeastWin10}
    ; OK
  ${Else}
    MessageBox MB_OK|MB_ICONSTOP "RQBBOX OS requires Windows 10 or later."
    Abort
  ${EndIf}
!macroend
