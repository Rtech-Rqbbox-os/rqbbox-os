/**
 * RQBBOX OS USB — Electron Preload Script (Windows)
 * Safely exposes limited APIs to the renderer
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('rqbbox', {
  platform: process.platform,
  version: '1.0.0',
  isUSB: true,
  onReady: (cb) => ipcRenderer.on('app-ready', cb),
});
