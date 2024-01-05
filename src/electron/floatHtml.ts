import { BrowserWindow } from 'electron';
import path from 'path';
import { adjustContextMenu, makeContextMenu } from './contextMenu';

export function createFloatHtmlWindow(
  html: { style: string; body: string; script: string },
  coords: { x?: number; y?: number; width: number; height: number },
  uuid?: string
) {
  const { x, y, width, height } = coords;
  const { style, body, script } = html;
  const win = new BrowserWindow({
    skipTaskbar: true,
    icon: 'assets/icon.ico',
    title: '',
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
    minWidth: 10,
    minHeight: 10 * (width / height),
  });
  //   if (DEBUG) win.webContents.openDevTools({ mode: 'detach' });

  win.removeMenu();
  adjustContextMenu(win, [makeContextMenu(win, 'AlwaysOnTop'), makeContextMenu(win, 'CloseWindow')]);
  win.focus();
  const styleWrap = `<style>
    *::-webkit-scrollbar {
    width: 10px;
    }
    *::-webkit-scrollbar-thumb {
    background-color: rgb(36, 41, 48);
    border-radius: 10px;
    background-clip: padding-box;
    border: 2px solid transparent;
    }
    *::-webkit-scrollbar-track {
    background-color: rgb(75, 85, 99);
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
    }
    ${style}
    </style>`;
  win.loadURL(`data:text/html;charset=utf-8,<head>${styleWrap}</head><body>${body}<script>${script}</script></body>`);
}
