/**
 * RQBBOX OS USB Launcher — macOS (Electron)
 * ─────────────────────────────────────────────
 * Loads the RQBBOX OS shell (os-shell.html) as a LOCAL desktop OS.
 * The OS shell itself contains the browser app for mobile/web access.
 *
 * Desktop/USB = full OS experience (local HTML shell)
 * Mobile/Browser = https://inquisitive-rqbbox-core-play.base44.app
 *
 * GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
 * RTech    — GOTECH AI
 */

const { app, BrowserWindow, screen, shell, Menu } = require('electron');
const path = require('path');

const OS_SHELL = path.join(__dirname, '../../core/os-shell.html');

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
    skipTaskbar: false,
  });

  // Load local OS shell
  mainWindow.loadFile(OS_SHELL);

  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('render-process-gone', () => {
    mainWindow.reload();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);

// macOS: keep running when windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
