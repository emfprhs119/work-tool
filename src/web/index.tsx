// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { App as AntdApp, theme } from 'antd';
import './antd.css';
import './main.css';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AliasToken } from 'antd/lib/theme/interface';

const customToken: Partial<AliasToken> = {
  screenXSMax: 360,
  screenXS: 300,
  screenXSMin: 280,
  colorBgBase: 'rgb(55 65 81)',
  colorPrimary: 'rgb(253, 224, 71)',
};

createRoot(document.getElementById('root') as Element).render(
  // <StrictMode>
  <HashRouter basename='/main'>
    <ConfigProvider theme={{ token: customToken, algorithm: theme.darkAlgorithm }}>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </HashRouter>
  // </StrictMode>
);
