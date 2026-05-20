const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('rqbbox', {
  platform: process.platform,
  version: '1.0.0',
  isUSB: true,
  onReady: (cb) => ipcRenderer.on('app-ready', cb),
});
