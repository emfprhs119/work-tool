import { MenuProps, Dropdown } from 'antd';
import { useSyncExternalStore } from 'react';

const AppDropdown = ({ children }: { children: JSX.Element }) => {
  const isAlwaysOnTop = useSyncExternalStore(
    (cb) => window.myAPI.subscribe('AlwaysOnTop', cb),
    () => window.myAPI.sync('AlwaysOnTop') as boolean
  );
  const items: MenuProps['items'] = [
    {
      label: `AlwaysOnTop ${isAlwaysOnTop ? '해제' : '고정'}`,
      key: 'AlwaysOnTop',
      onClick: () => window.myAPI.async('AlwaysOnTop', { flag: !isAlwaysOnTop }),
    },
  ];
  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      {children}
    </Dropdown>
  );
};
