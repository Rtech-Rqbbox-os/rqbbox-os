/**
 * RQBBOX OS USB Launcher — Windows (Electron)
 * ─────────────────────────────────────────────
 * Plug in USB → auto-launches RQBBOX OS in fullscreen kiosk mode
 * No boot required. No install required.
 *
 * App URL: https://inquisitive-rqbbox-core-play.base44.app
 * GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
 * RTech    — GOTECH AI
 */

const { app, BrowserWindow, screen, shell } = require('electron');
const path = require('path');

const APP_URL = 'https://inquisitive-rqbbox-core-play.base44.app';

// Prevent multiple instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    fullscreen: true,
    kiosk: false,
    frame: false,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, '../../assets/rqbbox-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: false,
    },
    title: 'RQBBOX OS',
  });

  // Load RQBBOX OS
  const appUrl = process.env.RQBBOX_URL || APP_URL;
  mainWindow.loadURL(appUrl);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Reload on crash
  mainWindow.webContents.on('render-process-gone', () => {
    mainWindow.reload();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
