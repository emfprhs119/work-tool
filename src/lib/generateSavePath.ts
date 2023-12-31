import { readdirSync } from 'fs';
import path from 'path';
import { getAppSettings } from './settings';

export const generateSavePath = () => {
  const appSettings = getAppSettings();
  const appendTime = 60 * 60 * 1000 * 9;
  let filename = 'capture-0001';
  if (appSettings.screenshotFileNameType === 'capture-y-m-d_hms') {
    filename = `capture-${new Date(Date.now() + appendTime)
      .toISOString()
      .replace(/((:)|(\..+))/g, '')
      .replace('T', '_')}`;
  } else if (appSettings.screenshotFileNameType === 'capture-incremental') {
    const list = readdirSync(appSettings.screenshotSavePath);
    let num = 1;
    const numList = list.map((f) => f.split('\\').pop() as string).filter((f) => f.match(/capture-[0-9]{4}/));
    for (const numStr of numList) {
      if (numStr === `capture-${('000' + num).slice(-4)}.png`) {
        num += 1;
        filename = `capture-${('000' + num).slice(-4)}`;
      } else {
        break;
      }
    }
  }
  return path.join(appSettings.screenshotSavePath, `${filename}.png`);
};
