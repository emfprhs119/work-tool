import { app } from 'electron';
import settings from 'electron-settings';

export const getAppSettings = () => {
  return {
    screenshotAfter: ['save', 'floating'],
    screenshotSavePath: app.getPath('desktop'),
    screenshotFileNameType: 'capture-y-m-d_hms',
    ...(settings.getSync('app.settings') as object),
  };
};
