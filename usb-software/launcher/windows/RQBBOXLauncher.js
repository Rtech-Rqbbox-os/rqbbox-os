/**
 * RQBBOX OS USB Launcher — Windows (Electron)
 * Plug in USB → auto-launches RQBBOX OS in fullscreen kiosk mode
 * No boot required. No install required.
 */

const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

// Prevent multiple instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
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
    },
    title: 'RQBBOX OS',
  });

  // Load RQBBOX OS — local index or remote Base44 app
  const appUrl = process.env.RQBBOX_URL || 'https://app.base44.com/apps/6a0d64e743c742005c890c76';
  mainWindow.loadURL(appUrl);

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

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
