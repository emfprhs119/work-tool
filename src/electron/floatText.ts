import { BrowserWindow } from 'electron';
import path from 'path';
import { adjustContextMenu, makeContextMenu } from './contextMenu';
import { copyClipboard } from './clipboardWork';

export function createFloatTextWindow(
  text: string,
  coords: { x?: number; y?: number; width: number; height: number },
  uuid?: string
) {
  const { x, y, width, height } = coords;
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
  adjustContextMenu(win, [
    {
      label: '원본 크기로 되돌리기',
      click: () => win.setSize(width, height),
    },
    {
      label: '클립보드 복사',
      click: () => {
        if (uuid) copyClipboard(uuid);
      },
    },
    { type: 'separator' },
    makeContextMenu(win, 'AlwaysOnTop'),
    makeContextMenu(win, 'CloseWindow'),
  ]);
  win.focus();
  const tagText = `<Textarea id="textarea">${text}</Textarea>`;
  const script = `function showWindow(){setTimeout(()=>window.myAPI.async('show'),200)};`;
  const style = `<style>
    * {
      -webkit-app-region: drag;
      margin:0;
      padding:0;
      border-width: 0; 
      overflow:clip;
      box-sizing: border-box;
      word-break: break-all;
    }
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

    Textarea {
      margin:0;
      padding:8;
      background-color: rgb(55 65 81);
      color: white;
      font-size:16;
      width: 100vw;
      min-height: 100vh;
      height: 100vh;
      overflow: auto;
      resize:none;
    }
    </style>`;
  win.loadURL(`data:text/html;charset=utf-8,<head>${style}</head><body>${tagText}<script>${script}</script></body>`);
}
