import path from 'path';
import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron';
import { adjustContextMenu, makeContextMenu } from './electron/contextMenu';
import { asyncFn, syncFn } from './electron/invokeFn';
import log from 'electron-log/main';
import { startClipboardListening } from './electron/clipboardWork';
import { screenshot } from './electron/screenshotV2';
import { windowStateKeeper } from './lib/stateKeeper';
import { createTrayIcon } from './electron/tray';

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  log.transports.console.format = '[{level}]{h}:{i}:{s} : {text}';
  log.initialize({ preload: true });
  console.log = log.log;

  const siderWidth = 64;
  const createWindow = async () => {
    const mainWindowStateKeeper = await windowStateKeeper('main');
    const win = new BrowserWindow({
      x: mainWindowStateKeeper.x ?? 200,
      y: mainWindowStateKeeper.y ?? 100,
      width: mainWindowStateKeeper.width ?? 480 + siderWidth,
      height: mainWindowStateKeeper.height ?? 560,
      icon: 'assets/icon.ico',
      minWidth: 380,
      minHeight: 380,
      frame: false,
      darkTheme: true,
      transparent: false,
      alwaysOnTop: true,
      closable: true,
      minimizable: false,
      fullscreenable: false,
      maximizable: false,
      webPreferences: {
        preload: path.resolve(__dirname, 'preload.js'),
        devTools: true,
      },
    });
    mainWindowStateKeeper.track(win);
    startClipboardListening((clipboardTmp) => {
      win.webContents.send('clipboard', clipboardTmp);
    });
    adjustContextMenu(win, [makeContextMenu(win, 'AlwaysOnTop'), makeContextMenu(win, 'HideWindow')]);
    win.loadFile('dist/index.html', { hash: 'main' });
    createTrayIcon(win);
    if (DEBUG) win.webContents.openDevTools({ mode: 'detach' });
  };

  app.whenReady().then(() => {
    createWindow();
    ipcMain.on('sync', syncFn);
    ipcMain.handle('async', asyncFn);
    const ret = globalShortcut.register('CommandOrControl+Shift+S', () => {
      screenshot();
    });
  });
  app.once('window-all-closed', () => app.quit());
}
