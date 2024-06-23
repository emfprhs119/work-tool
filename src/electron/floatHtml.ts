import { BrowserWindow } from 'electron';
import path from 'path';
import { adjustContextMenu, makeContextMenu } from './contextMenu';
import { htmlViewerBasePath } from '../res/file-path';

export function createFloatHtmlWindow(
  fileFullPath: string,
  title: string,
  coords: { x?: number; y?: number; width: number; height: number },
  uuid?: string
) {
  const { x, y, width, height } = coords;
  const win = new BrowserWindow({
    skipTaskbar: true,
    icon: 'assets/icon.ico',
    title: title,
    autoHideMenuBar: true,
    frame: true,
    x,
    y,
    width,
    height,
    webPreferences: {
      webSecurity: false,
      preload: path.resolve(__dirname, 'preload.js'),
    },
    alwaysOnTop: true,
    closable: true,
    minimizable: false,
    fullscreenable: false,
    maximizable: false,
    resizable: true,
    show: true,
  });
  if (DEBUG) win.webContents.openDevTools({ mode: 'detach' });

  win.removeMenu();
  adjustContextMenu(win, () => [makeContextMenu(win, 'AlwaysOnTop'), makeContextMenu(win, 'CloseWindow')]);
  win.focus();
  win.loadURL(path.join(htmlViewerBasePath, fileFullPath));
}
