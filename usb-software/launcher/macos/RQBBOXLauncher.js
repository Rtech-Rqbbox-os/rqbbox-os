/**
 * RQBBOX OS USB Launcher — macOS (Electron)
 * ─────────────────────────────────────────────
 * Plug in USB → auto-launches RQBBOX OS in fullscreen mode
 * No boot required. No install required.
 *
 * App URL: https://inquisitive-rqbbox-core-play.base44.app
 * GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
 * RTech    — GOTECH AI
 */

const { app, BrowserWindow, screen, shell } = require('electron');
const path = require('path');

const APP_URL = 'https://inquisitive-rqbbox-core-play.base44.app';

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
    frame: false,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, '../../assets/rqbbox-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'RQBBOX OS',
    // macOS: hide dock icon while in fullscreen
    skipTaskbar: false,
  });

  const appUrl = process.env.RQBBOX_URL || APP_URL;
  mainWindow.loadURL(appUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.on('render-process-gone', () => {
    mainWindow.reload();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// macOS: keep app running when all windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
