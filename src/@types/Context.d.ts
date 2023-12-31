export interface IElectronAPI {
  subscribe(arg0: string, arg1: (evt: any, data: any) => void): () => void;
  sync: (fn: string, args?: any) => any;
  async: (fn: string, args?: any) => Promise<void>;
  openExternal: (arg: string) => void;
  log: (params: any[]) => void;
}

declare global {
  interface Window {
    myAPI: IElectronAPI;
  }
}

export type ClipboardData = {
  uuid: string;
  date: number;
  format: string;
  text?: string;
  src?: string;
  width?: number;
  height?: number;
  fav?: boolean;
};
