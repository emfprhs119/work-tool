import { useEffect, useState } from 'react';
import Icon from '../common/Icon';
import { Header } from 'antd/es/layout/layout';

function Title() {
  const [currDateTitle, setCurrDateTitle] = useState(new Date(Date.now()).toLocaleString());
  useEffect(() => {
    setInterval(() => {
      setCurrDateTitle(new Date(Date.now()).toLocaleString());
    }, 200);
  }, []);
  return (
    <div className='h-11 flex m-auto'>
      <p className='m-auto text-lg ml-11'>{currDateTitle}</p>
    </div>
  );
}
export const CaptionBar = () => {
  return (
    <Header className='inactive h-8 leading-7 p-0 bg-gray-900 flex justify-end'>
      <SysIcon className={'hover:bg-gray-700'} icon={'camera'} onClick={() => window.myAPI.async('takeScreenshot')} />
      <SysIcon className={'hover:bg-gray-700'} icon={'minus'} onClick={() => window.myAPI.async('minimize')} />
      <SysIcon className={'hover:bg-red-700 pr-1'} icon={'cross'} onClick={() => window.myAPI.async('hide')} />
    </Header>
  );
};
const SysIcon = (props: any) => {
  const { icon, onClick, className } = props;
  return (
    <div className={`group active cursor-pointer w-10 ${className}`} onClick={onClick}>
      <p className='text-center'>
        <Icon className='fill-gray-500 group-hover:fill-gray-300' size={11} icon={icon} />
      </p>
    </div>
  );
};
