import { BrowserWindow, app, dialog, nativeImage } from 'electron';
import path from 'path';
import { adjustContextMenu, makeContextMenu } from './contextMenu';
import { copyClipboard, copyClipboardImg } from './clipboardWork';
import { copyFileSync } from 'fs';
import { generateSavePath } from '../lib/generateSavePath';

export function createFloatImageWindow(
  fileFullPath: string,
  coords: { x?: number; y?: number; width: number; height: number },
  uuid?: string
) {
  const { x, y, width, height } = coords;
  const win = new BrowserWindow({
    skipTaskbar: true,
    frame: false,
    x,
    y,
    width,
    height,
    webPreferences: {
      webSecurity: false,
      preload: path.resolve(__dirname, 'preload.js'),
      //   devTools: true,
    },
    alwaysOnTop: true,
    closable: true,
    minimizable: false,
    fullscreenable: false,
    maximizable: false,
    resizable: true,
    show: false,
    minWidth: 10,
    minHeight: 10 * (width / height),
    opacity: 0,
  });
  win.setAspectRatio(width / height);
  win.on('show', () => {
    win.setOpacity(1);
  });

  adjustContextMenu(win, () => [
    {
      label: '원본 크기로 되돌리기',
      click: () => win.setSize(width, height),
    },
    {
      label: '클립보드 복사',
      click: () => {
        if (uuid) copyClipboard(uuid);
        else copyClipboardImg(nativeImage.createFromPath(fileFullPath));
      },
    },
    { type: 'separator' },
    {
      label: '저장',
      click: () => {
        copyFileSync(fileFullPath, generateSavePath());
      },
    },
    {
      label: '다른 이름으로 저장',
      click: () => {
        const result = dialog.showSaveDialogSync(win, {
          defaultPath: path.join(app.getPath('desktop'), 'image.png'),
          filters: [{ extensions: ['png'], name: 'PNG' }],
        });
        if (result) {
          copyFileSync(fileFullPath, result);
        }
      },
    },
    { type: 'separator' },
    makeContextMenu(win, 'AlwaysOnTop'),
    makeContextMenu(win, 'CloseWindow'),
  ]);
  const tagImg = `<img id="screenshot" onLoad="showWindow()" onFail="closeWindow()" src=${fileFullPath} alt="screenshot">`;
  const script = `function showWindow(){setTimeout(()=>window.myAPI.async('show'),200)};`;
  const style = `<style>
    * {
      -webkit-app-region: drag;
      margin:0;
      padding:0;
      overflow:clip;
      background-color:black;
    }
    img {
        width: 100%
    }
    </style>`;
  win.loadURL(`data:text/html;charset=utf-8,<head>${style}</head><body>${tagImg}<script>${script}</script></body>`);
}
