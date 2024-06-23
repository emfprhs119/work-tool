import { BrowserWindow, app, dialog, nativeImage, shell } from 'electron';
import { screenshot } from './screenshotV2';
import {
  clipboardTmp,
  copyClipboard,
  copyClipboardImg,
  favoriteClipboard,
  removeClipboard,
  removeClipboardAll,
} from './clipboardWork';
import { createFloatImageWindow } from './floatImage';
import settings from 'electron-settings';
import path from 'path';
import { copyFileSync, writeFileSync } from 'fs';
import { generateSavePath } from '../lib/generateSavePath';
import { getAppSettings, instantSettingsChange } from '../lib/settings';
import { createFloatTextWindow } from './floatText';
import { createFloatHtmlWindow } from './floatHtml';
import { addHtmlViewer, htmlViewerTmp, removeHtmlViewer } from './htmlViewerWork';
import { clipboardImageBasePath } from '../res/file-path';

export const asyncFn = (_e: Electron.IpcMainInvokeEvent, args: any[]) => {
  const [key, val] = args;
  const window = BrowserWindow.fromWebContents(_e.sender);
  if (!window || window.isDestroyed()) return;
  else if (key === 'AlwaysOnTop') {
    const { flag }: { flag: boolean } = val;
    if (window.isAlwaysOnTop() !== flag) {
      window.setAlwaysOnTop(flag);
      _e.sender.send('AlwaysOnTop', flag);
    }
  } else if (key === 'close') window.close();
  else if (key === 'minimize') window.minimize();
  else if (key === 'hide') window.hide();
  else if (key === 'show') window.show();
  else if (key === 'setTitle') window.setTitle(val.title);
  else if (key === 'takeScreenshot') screenshot();
  else if (key === 'openExternal') shell.openExternal(val.url, val.options);
  else if (key === 'copyClipboard') copyClipboard(val.uuid);
  else if (key === 'favoriteClipboard') favoriteClipboard(window, val.uuid);
  else if (key === 'removeClipboard') removeClipboard(window, val.uuid);
  else if (key === 'removeClipboardAll') removeClipboardAll(window);
  else if (key === 'afterCopyClipboard') {
    if (getAppSettings().hideAfterCopyClipboard) window.hide();
  } else if (key === 'addHtmlViewer') addHtmlViewer(window, val.src, val.title);
  else if (key === 'removeHtmlViewer') removeHtmlViewer(window, val.uuid);
  else if (key === 'openFloatHtmlWindow') {
    createFloatHtmlWindow(val.src, val.title, { width: val.width, height: val.height }, val.uuid);
  } else if (key === 'openFloatWindow') {
    if (val.format === 'image/png') {
      const fullPath = path.join(clipboardImageBasePath, val.src);
      createFloatImageWindow(fullPath, { width: val.width, height: val.height }, val.uuid);
    } else if (val.format === 'text/plain') createFloatTextWindow(val.text, { width: 400, height: 300 }, val.uuid);
  } else if (key === 'cropAndCopyClipboard') {
    const image = nativeImage.createFromPath(val.src);
    const cropImage = image.crop(val.rect);
    const cropImagePath = path.join(clipboardImageBasePath, `${Date.now().toString()}.png`);
    writeFileSync(cropImagePath, cropImage.toPNG());
    const appSettings = getAppSettings();
    if (appSettings.screenshotAfter.includes('save')) copyFileSync(cropImagePath, generateSavePath());
    if (appSettings.screenshotAfter.includes('floating'))
      createFloatImageWindow(cropImagePath, { width: val.rect.width, height: val.rect.height });
    copyClipboardImg(cropImage);
  } else if (key === 'setAppSettings') {
    const beforeSettings = getAppSettings();
    const afterSettings = getAppSettings();
    (afterSettings as any)[val.name] = val.value;
    settings.setSync('app.settings', afterSettings);
    instantSettingsChange(beforeSettings, afterSettings);
  } else if (key === 'resetAppSettings') {
    const beforeSettings = getAppSettings();
    settings.setSync('app.settings', {});
    instantSettingsChange(beforeSettings, getAppSettings());
  }
};

export const syncFn = (_e: Electron.IpcMainEvent, args: any[]) => {
  const [key, val] = args;
  const window = BrowserWindow.fromWebContents(_e.sender);
  if (!window || window.isDestroyed()) return;
  else if (key === 'isAlwaysOnTop') _e.returnValue = window.isAlwaysOnTop();
  else if (key === 'getClipboardImageBasePath') _e.returnValue = clipboardImageBasePath;
  else if (key === 'getClipboard') _e.returnValue = clipboardTmp;
  else if (key === 'getHtmlViewer') _e.returnValue = htmlViewerTmp;
  else if (key === 'openDirectory') {
    const result = dialog.showOpenDialogSync(window, {
      properties: ['openDirectory'],
    });
    _e.returnValue = result ? result[0] : undefined;
  } else if (key === 'getAppSettings') _e.returnValue = getAppSettings();
};
