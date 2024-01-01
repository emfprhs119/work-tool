import { useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { SettingOutlined } from '@ant-design/icons';

export const SideTopBar = () => {
  return (
    <div className='active'>
      <PathIcon path={'/clipboard'} icon={'clipboard'} />
    </div>
  );
};

export const SideBottomBar = () => {
  return (
    <div className='active'>
      <PathAntdIcon path={'/settings'} AntdIcon={SettingOutlined} />
    </div>
  );
};

const PathIcon = ({ path, icon }: { path: string; icon: string }) => {
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

const PathAntdIcon = ({ path, AntdIcon }: { path: string; AntdIcon: any }) => {
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
