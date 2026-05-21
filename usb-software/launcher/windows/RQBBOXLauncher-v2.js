/**
 * RQBBOX OS USB Launcher — Windows (Electron)
 * Version: 2.6.0.4
 * ─────────────────────────────────────────────
 * Loads RQBBOX OS v2.6.0.4 desktop shell locally.
 * No bootable USB required — flash and run.
 *
 * GitHub:  https://github.com/Rtech-Rqbbox-os/rqbbox-os
 * RTech    — GOTECH AI
 */

const { app, BrowserWindow, screen, shell, Menu } = require('electron');
const path = require('path');

const VERSION  = '2.6.0.4';
const OS_SHELL = path.join(__dirname, '../../core/os-shell-v2.html');

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }
else {
  app.on('second-instance', () => {
    if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
  });
}

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width, height,
    fullscreen: true,
    kiosk: false,
    frame: false,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, '../../assets/rqbbox-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
    title: `RQBBOX OS v${VERSION}`,
  });
  mainWindow.loadFile(OS_SHELL);
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('render-process-gone', () => mainWindow.reload());
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => { if (mainWindow === null) createWindow(); });
