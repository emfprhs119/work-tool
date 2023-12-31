import { app } from 'electron';
import { getAppSettings } from '../lib/settings';

export const autoStart = () => {
  const AutoLaunch = require('auto-launch');

  const autoLauncher = new AutoLaunch({
    name: 'Work Tool',
    path: app.getPath('exe'),
  });

  autoLauncher
    .isEnabled()
    .then(function (isEnabled: boolean) {
      const isAutoStart = getAppSettings().autoStart;
      if (isEnabled && !isAutoStart) {
        autoLauncher.disable();
        return;
      }
      if (!isEnabled && isAutoStart) autoLauncher.enable();
    })
    .catch(function (err: Error) {
      console.error(err);
    });
};
