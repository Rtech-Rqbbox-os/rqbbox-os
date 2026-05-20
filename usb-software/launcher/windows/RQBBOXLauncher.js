/**
 * RQBBOX OS USB Launcher — Windows (Electron)
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

const OS_SHELL  = path.join(__dirname, '../../core/os-shell.html');
const APP_URL   = 'https://inquisitive-rqbbox-core-play.base44.app';

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
      // Allow loading local OS shell
      webSecurity: true,
    },
    title: 'RQBBOX OS',
  });

  // Load local OS shell — the full desktop OS experience
  mainWindow.loadFile(OS_SHELL);

  // Remove menu bar (OS handles its own UI)
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Reload on crash
  mainWindow.webContents.on('render-process-gone', (e, details) => {
    console.log('Renderer crashed:', details.reason);
    mainWindow.reload();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });
