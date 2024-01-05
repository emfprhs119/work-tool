import { useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { PropsWithChildren } from 'react';
import Sider from 'antd/es/layout/Sider';

export const SideBarWrap = ({ children }: PropsWithChildren) => {
  return (
    <Sider className='inactive bg-black' width={64}>
      <div className='flex flex-col justify-between h-screen'>{children}</div>
    </Sider>
  );
};

export const SideTopBar = ({ children }: PropsWithChildren) => {
  return <div className='active'>{children}</div>;
};

export const SideBottomBar = ({ children }: PropsWithChildren) => {
  return <div className='active'>{children}</div>;
};

export const PathIcon = ({ path, icon }: { path: string; icon: string }) => {
  const location = useLocation();
  const isSelected = location.pathname === path;
  return (
    <a href={`#main${path}`} className='group'>
      <Icon
        icon={icon}
        className={`p-4 h-16 group-hover:fill-gray-300 ${isSelected ? 'fill-gray-300' : 'fill-gray-500'}`}
      />
    </a>
  );
};

export const PathAntdIcon = ({ path, AntdIcon }: { path: string; AntdIcon: any }) => {
  const location = useLocation();
  const isSelected = location.pathname === path;
  return (
    <a href={`#main${path}`} className='group'>
      <AntdIcon
        style={{ fontSize: '32px' }}
        className={`p-4 font-size-4 group-hover:text-gray-300 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}
      />
    </a>
  );
};
