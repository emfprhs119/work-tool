import { useEffect } from 'react';
import { Layout } from 'antd';
import { Route, Routes, useLocation } from 'react-router-dom';
import { PathAntdIcon, PathIcon, SideBarWrap, SideBottomBar, SideTopBar } from './components/main-layouts/SideBar';
import { ClipboardTab } from './components/main-tabs/ClipboardTab';
import { SettingsTab } from './components/main-tabs/SettingsTab';
import { SettingOutlined, Html5Outlined } from '@ant-design/icons';
import { MainContentWrap } from './components/main-layouts/MainContent';
import { HtmlViewerTab } from './components/main-tabs/HtmlViewerTab';
export const App = () => {
  const location = useLocation();
  useEffect(() => {
    window.myAPI.async('setTitle', { title: 'WorkTool' });
    if (location.pathname === '/') window.location.replace('#main/clipboard');
  }, [location]);

  return (
    <Layout>
      <SideBarWrap>
        <SideTopBar>
          <PathIcon path='/clipboard' icon='clipboard' />
          <PathAntdIcon path='/html-viewer' AntdIcon={Html5Outlined} />
        </SideTopBar>
        <SideBottomBar>
          <PathAntdIcon path='/settings' AntdIcon={SettingOutlined} />
        </SideBottomBar>
      </SideBarWrap>
      <MainContentWrap>
        <Routes>
          <Route path='/' Component={ClipboardTab} />
          <Route path='clipboard' Component={ClipboardTab} />
          <Route path='html-viewer' Component={HtmlViewerTab} />
          <Route path='settings' Component={SettingsTab} />
        </Routes>
      </MainContentWrap>
    </Layout>
  );
};
