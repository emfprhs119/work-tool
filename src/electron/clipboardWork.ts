import { BrowserWindow, NativeImage, app, clipboard, nativeImage } from 'electron';
import clipboardListener from '../lib/clipboard';
import path from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync, readFile, unlinkSync, writeFile, writeFileSync } from 'fs';
import { ClipboardData } from '../@types/Context';

export const clipboardTmp: ClipboardData[] = [];
export const imgBasePath = path.join(app.getPath('userData'), 'png');
const jsonPath = path.join(app.getPath('userData'), 'clipboard.json');

mkdirSync(imgBasePath, { recursive: true });
let preventOnce = false;

export const startClipboardListening = (onChange: (clipboardTmp: ClipboardData[]) => void) => {
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
      const imgPath = path.join(imgBasePath, `${Date.now().toString()}.png`);
      writeFileSync(imgPath, image.toPNG());
      clipboardTmp.unshift({
        uuid,
        date,
        format,
        src: imgPath,
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
    writeFile(jsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => onChange(clipboardTmp));
  });
  readFile(jsonPath, { encoding: 'utf8' }, (error, data) => {
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
          const image = nativeImage.createFromPath(clip.src);
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
    writeFile(jsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => {
      win.webContents.send('clipboard', clipboardTmp);
    });
  }
};

export const removeClipboard = (win: BrowserWindow, uuid: string) => {
  const idx = clipboardTmp.findIndex((c) => c.uuid === uuid);
  if (idx > -1) {
    const target = clipboardTmp[idx];
    if (target.format === 'image/png' && target.src) unlinkSync(target.src);
    clipboardTmp.splice(idx, 1);
    writeFile(jsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => {
      win.webContents.send('clipboard', clipboardTmp);
    });
  }
};

export const removeClipboardAll = (win: BrowserWindow) => {
  unlinkSync(imgBasePath);
  mkdirSync(imgBasePath, { recursive: true });
  clipboardTmp.splice(0, clipboardTmp.length);
  writeFile(jsonPath, JSON.stringify(clipboardTmp), { encoding: 'utf8' }, () => {
    win.webContents.send('clipboard', clipboardTmp);
  });
};
