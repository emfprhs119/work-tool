import { app } from 'electron';
import path from 'path';
import { mkdirSync } from 'fs';

export const clipboardImageBasePath = path.join(app.getPath('userData'), 'SubApp', 'clipboard_png');
export const clipboardJsonPath = path.join(app.getPath('userData'), 'SubApp', 'clipboard.json');
mkdirSync(clipboardImageBasePath, { recursive: true });

export const htmlViewerBasePath = path.join(app.getPath('userData'), 'SubApp', 'html-viewer');
export const htmlViewerJsonPath = path.join(app.getPath('userData'), 'SubApp', 'html-viewer.json');
mkdirSync(htmlViewerBasePath, { recursive: true });
