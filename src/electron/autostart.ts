import { app } from 'electron';

export const autoStart = () => {
  const AutoLaunch = require('auto-launch');

  const autoLauncher = new AutoLaunch({
    name: 'Work Tool',
    path: app.getPath('exe'),
  });

  autoLauncher
    .isEnabled()
    .then(function (isEnabled: boolean) {
      if (isEnabled) {
        return;
      }
      autoLauncher.enable();
    })
    .catch(function (err: Error) {
      console.error(err);
    });
};
