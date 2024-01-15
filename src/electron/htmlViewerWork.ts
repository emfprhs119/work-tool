import { BrowserWindow, app } from 'electron';
import path from 'path';
import { randomUUID } from 'crypto';
import { copyFileSync, mkdirSync, readFile, unlink, unlinkSync, writeFile } from 'fs';
import { HtmlViewerData } from '../@types/Context';
import { htmlViewerJsonPath, htmlViewerBasePath } from '../res/file-path';

export const htmlViewerTmp: HtmlViewerData[] = [];
export const initHtmlViewer = () => {
  readFile(htmlViewerJsonPath, { encoding: 'utf8' }, (error, data) => {
    if (data) {
      htmlViewerTmp.push(...(JSON.parse(data) as unknown as HtmlViewerData[]));
    }
  });
};

export const addHtmlViewer = (win: BrowserWindow, src: string, title: string) => {
  const uuid = randomUUID();
  const date = Date.now();
  const htmlPath = path.join(htmlViewerBasePath, `${uuid}.html`);
  copyFileSync(src, htmlPath);
  htmlViewerTmp.unshift({
    uuid,
    date,
    src: `${uuid}.html`,
    title,
  });
  writeFile(htmlViewerJsonPath, JSON.stringify(htmlViewerTmp), { encoding: 'utf8' }, () => {
    win.webContents.send('htmlViewer', htmlViewerTmp);
  });
};

export const removeHtmlViewer = (win: BrowserWindow, uuid: string) => {
  const idx = htmlViewerTmp.findIndex((c) => c.uuid === uuid);
  if (idx > -1) {
    const target = htmlViewerTmp[idx];
    if (target.src) {
      unlink(path.join(htmlViewerBasePath, target.src), (err) => {
        if (err) console.error(err);
      });
    }
    htmlViewerTmp.splice(idx, 1);
    writeFile(htmlViewerJsonPath, JSON.stringify(htmlViewerTmp), { encoding: 'utf8' }, () => {
      win.webContents.send('htmlViewer', htmlViewerTmp);
    });
  }
};

export const removeHtmlAll = (win: BrowserWindow) => {
  unlinkSync(htmlViewerBasePath);
  mkdirSync(htmlViewerBasePath, { recursive: true });
  htmlViewerTmp.splice(0, htmlViewerTmp.length);
  writeFile(htmlViewerJsonPath, JSON.stringify(htmlViewerTmp), { encoding: 'utf8' }, () => {
    win.webContents.send('html', htmlViewerTmp);
  });
};
