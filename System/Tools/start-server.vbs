Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "H:\RQBBOX_OS"
WshShell.Run "node System/Server/server.js", 0, False
