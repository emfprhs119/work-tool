import { useEffect } from 'react';
import { Layout } from 'antd';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import { CaptionBar } from './components/main-layouts/CaptionBar';
import { SideBottomBar, SideTopBar } from './components/main-layouts/SideBar';
import { ClipboardTab } from './components/main-tabs/clipboard/ClipboardTab';
import { SettingsTab } from './components/main-tabs/SettingsTab';

export const App = () => {
  const location = useLocation();
  useEffect(() => {
    window.myAPI.async('setTitle', { title: 'WorkTool' });
    if (location.pathname === '/') window.location.replace('#main/clipboard');
  }, [location]);

  return (
    <Layout>
      <Sider className='inactive bg-black' width={64}>
        <div className='flex flex-col justify-between h-screen'>
          <SideTopBar />
          <SideBottomBar />
        </div>
      </Sider>
      <Layout className=' overflow-hidden'>
        <Header className='inactive h-8 leading-7 p-0 bg-gray-900'>
          <CaptionBar />
        </Header>
        <Content className='flex flex-col h-[calc(100vh-2rem)]'>
          <Routes>
            <Route path='/' Component={ClipboardTab} />
            <Route key={`clipboard`} path={`clipboard`} Component={ClipboardTab} />
            <Route key={`settings`} path={`settings`} Component={SettingsTab} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
