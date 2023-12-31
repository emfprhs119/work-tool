import { useEffect } from 'react';
import { Layout } from 'antd';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Header } from 'antd/es/layout/layout';
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
    <Layout style={{ width: '100vw', height: '100vh' }}>
      <Sider className='inactive ' width={64} style={{ backgroundColor: 'rgb(3 7 18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100%' }}>
          <SideTopBar />
          <SideBottomBar />
        </div>
      </Sider>
      <Layout>
        <Header className='inactive h-8 leading-7 p-0 bg-gray-900'>
          <CaptionBar />
        </Header>
        <Routes>
          <Route path='/' Component={ClipboardTab} />
          <Route key={`clipboard`} path={`clipboard`} Component={ClipboardTab} />
          <Route key={`settings`} path={`settings`} Component={SettingsTab} />
        </Routes>
      </Layout>
    </Layout>
  );
};
