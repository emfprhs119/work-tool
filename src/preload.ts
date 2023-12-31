import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from './@types/Context';
import log from 'electron-log/renderer';

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    //if esc key was not pressed in combination with ctrl or alt or shift
    const isNotCombinedKey = !(event.ctrlKey || event.altKey || event.shiftKey);
    if (isNotCombinedKey) {
      ipcRenderer.invoke('async', ['close']);
    }
  }
});

const api: IElectronAPI = {
  sync: (fn: string, args?: any): any => ipcRenderer.sendSync('sync', [fn, args]),
  async: (fn: string, args?: any) => ipcRenderer.invoke('async', [fn, args]),
  subscribe: (channel: string, fn: (evt: any, data: any) => void) => {
    ipcRenderer.addListener(channel, fn);
    return () => ipcRenderer.removeListener(channel, fn);
  },
  openExternal: (arg: string): Promise<void> => ipcRenderer.invoke('async', ['openExternal', arg]),
  log: log.log,
};

contextBridge.exposeInMainWorld('myAPI', api);
