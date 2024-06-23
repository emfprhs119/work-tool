import { BrowserWindow, Menu, app } from 'electron';

export const adjustContextMenu = (
  window: BrowserWindow,
  menu: () => Electron.MenuItemConstructorOptions[] = () => []
) => {
  const WM_INITMENU = 0x0116;
  const setSystemContextMenu = () =>
    window.hookWindowMessage(WM_INITMENU, () => {
      window.setEnabled(false);
      window.setEnabled(true);
      const buildMenu = Menu.buildFromTemplate(menu());
      buildMenu.popup();
    });
  setSystemContextMenu();
  window.addListener('always-on-top-changed', setSystemContextMenu);
  setTimeout(() => window.setAlwaysOnTop(window.isAlwaysOnTop()), 500);
};

export const makeContextMenu = (
  window: BrowserWindow,
  menu: 'AlwaysOnTop' | 'CloseWindow' | 'HideWindow' | 'CloseApp'
) => {
  switch (menu) {
    case 'AlwaysOnTop':
      return {
        label: window.isAlwaysOnTop() ? '항상 위 해제' : '항상 위 고정',
        click: () => window.setAlwaysOnTop(!window.isAlwaysOnTop()),
      };
    case 'CloseApp':
      return {
        label: '종료',
        click: () => app.quit(),
      };
    case 'CloseWindow':
      return {
        label: '창 닫기',
        click: () => window.close(),
      };
    case 'HideWindow':
      return {
        label: '창 닫기',
        click: () => window.hide(),
      };
  }
};
