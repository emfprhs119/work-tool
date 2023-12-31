import { BrowserWindow } from 'electron';
import settings from 'electron-settings';

export const windowStateKeeper = async (windowName: string) => {
  let debounce: NodeJS.Timeout;
  const saveState = async (win: BrowserWindow) => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      await settings.set(`windowState.${windowName}`, { ...win.getBounds(), isMaximized: win.isMaximized() });
    }, 500);
  };
  const track = async (win: BrowserWindow) => {
    win.on('move', () => saveState(win));
    win.on('resize', () => saveState(win));
    win.on('close', () => saveState(win));
  };
  if (await settings.has(`windowState.${windowName}`)) {
    return {
      ...((await settings.get(`windowState.${windowName}`)) as {
        x: number;
        y: number;
        width: number;
        height: number;
        isMaximized: boolean;
      }),
      track,
    };
  } else return { x: undefined, y: undefined, width: undefined, height: undefined, isMaximized: undefined, track };
};
