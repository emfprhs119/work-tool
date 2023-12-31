import { app } from 'electron';
import settings from 'electron-settings';
import { autoStart } from '../electron/autostart';

export interface SettingData {
  autoStart: boolean;
  screenshotAfter: string[];
  screenshotSavePath: string;
  screenshotFileNameType: string;
}

export const getAppSettings = () => {
  return {
    autoStart: true,
    screenshotAfter: ['save', 'floating'],
    screenshotSavePath: app.getPath('desktop'),
    screenshotFileNameType: 'capture-y-m-d_hms',
    ...(settings.getSync('app.settings') as object),
  };
};

export const instantSettingsChange = (before: SettingData, after: SettingData) => {
  if (before.autoStart !== after.autoStart) autoStart();
};
