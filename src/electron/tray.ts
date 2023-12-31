import { BrowserWindow, Menu, Tray } from 'electron';
import { makeContextMenu } from './contextMenu';
import path from 'path';

export const createTrayIcon = (win: BrowserWindow) => {
  const tray = new Tray(path.join(__dirname, 'assets', 'icon.ico'));

  tray.on('click', () => {
    if (!win.isVisible()) {
      win.show();
    } else {
      win.moveTop();
      win.center();
    }
  });
  const contextMenu = Menu.buildFromTemplate([makeContextMenu(win, 'CloseApp')]);
  tray.setContextMenu(contextMenu);
};
