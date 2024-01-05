import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { CaptionBar } from './CaptionBar';
import { PropsWithChildren } from 'react';

export const MainContentWrap = ({ children }: PropsWithChildren) => {
  return (
    <Layout>
      <CaptionBar />
      <Content className='flex flex-col h-[calc(100vh-2rem)]'>{children}</Content>
    </Layout>
  );
};
