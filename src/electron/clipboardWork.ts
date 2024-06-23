import { BrowserWindow, NativeImage, app, clipboard, nativeImage } from 'electron';
import clipboardListener from '../lib/clipboard';
import path from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync, readFile, unlink, unlinkSync, writeFile, writeFileSync } from 'fs';
import { ClipboardData } from '../@types/Context';
import { clipboardImageBasePath, clipboardJsonPath } from '../res/file-path';
// import ioHook from 'iohook';
export const clipboardTmp: ClipboardData[] = [];

let preventOnce = false;

// setInterval(() => {
//   console.log(clipboard.readText('selection'));
// }, 1000);

// const printSelectedText = (selectedText: string) => {
//   console.log(`Selected Text: ${selectedText}`);
// };
export const startClipboardListening = (onChange: (clipboardTmp: ClipboardData[]) => void) => {
  // registerShortcut('F6', printSelectedText);
  // ioHook.on('mousemove', (event: {}) => {
  // console.log(event); // { type: 'mousemove', x: 700, y: 400 }
  // mainWindow.webContents.send('mousemove', event);
  // });

  // ioHook.on('mouseclick', (event: {}) => {
  // console.log(event);
  // mainWindow.webContents.send('mouseclick', event);
  // });

  // Register and start hook
  // ioHook.start();
  clipboardListener.on('change', async () => {
    if (preventOnce) {
      preventOnce = false;
      return;
    }
    const uuid = randomUUID();
    const date = Date.now();
    const format = clipboard.availableFormats()[0];
    if (format === 'image/png') {
      const image = clipboard.readImage();
      if (
        clipboardTmp.length > 0 &&
        clipboardTmp[0].src &&
        image.toDataURL() === nativeImage.createFromPath(clipboardTmp[0].src).toDataURL()
      )
        return;
      const imgFileName = `${Date.now().toString()}.png`;
      const imgPath = path.join(clipboardImageBasePath, imgFileName);
      writeFileSync(imgPath, image.toPNG());
      clipboardTmp.unshift({
        uuid,
        date,
        format,
        src: imgFileName,
        ...image.getSize(),
      });
    } else if (format === 'text/plain') {
      const plainText = clipboard.readText().trim();
      if (clipboardTmp.length > 0 && clipboardTmp[0].text === plainText) return;
      if (clipboardTmp.length > 0) {
        const idx = clipboardTmp.slice(0, 10).findIndex((c) => c.text === plainText);
        if (idx > -1) clipboardTmp.splice(idx, 1);
      }
      clipboardTmp.unshift({
        uuid,
        date,
        format,
        text: plainText,
      });
    }
    writeFile(clipboardJsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => onChange(clipboardTmp));
  });
  readFile(clipboardJsonPath, { encoding: 'utf8' }, (error, data) => {
    if (data) {
      clipboardTmp.push(...(JSON.parse(data) as unknown as ClipboardData[]));
    }
  });
  clipboardListener.startListening();
};

export const copyClipboard = (uuid: string) => {
  const clip = clipboardTmp.find((c) => c.uuid === uuid);
  if (clip) {
    preventOnce = true;
    switch (clip.format) {
      case 'image/png':
        if (clip.src) {
          const fullPath = path.join(clipboardImageBasePath, clip.src);
          const image = nativeImage.createFromPath(fullPath);
          clipboard.writeImage(image);
        } else console.warn('missing clipboard data');
        break;
      case 'text/plain':
      default:
        if (clip.text) {
          clipboard.writeText(clip.text);
        } else console.warn('missing clipboard data');
        break;
    }
  }
};

export const copyClipboardImg = (img: NativeImage) => {
  clipboard.writeImage(img);
};

export const favoriteClipboard = (win: BrowserWindow, uuid: string) => {
  const idx = clipboardTmp.findIndex((c) => c.uuid === uuid);
  if (idx > -1) {
    clipboardTmp[idx].fav = !clipboardTmp[idx].fav;
    writeFile(clipboardJsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => {
      win.webContents.send('clipboard', clipboardTmp);
    });
  }
};

export const removeClipboard = (win: BrowserWindow, uuid: string) => {
  const idx = clipboardTmp.findIndex((c) => c.uuid === uuid);
  if (idx > -1) {
    const target = clipboardTmp[idx];
    if (target.format === 'image/png' && target.src) {
      unlink(path.join(clipboardImageBasePath, target.src), (err) => {
        if (err) console.error(err);
      });
    }
    clipboardTmp.splice(idx, 1);
    writeFile(clipboardJsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => {
      win.webContents.send('clipboard', clipboardTmp);
    });
  }
};

export const removeClipboardAll = (win: BrowserWindow) => {
  unlinkSync(clipboardImageBasePath);
  mkdirSync(clipboardImageBasePath, { recursive: true });
  clipboardTmp.splice(0, clipboardTmp.length);
  writeFile(clipboardJsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => {
    win.webContents.send('clipboard', clipboardTmp);
  });
};
