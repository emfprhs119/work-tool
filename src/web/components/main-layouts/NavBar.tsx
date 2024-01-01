import { useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { Footer } from 'antd/es/layout/layout';

export const NavBar = ({ children }: React.PropsWithChildren) => {
  return (
    <Footer className='active h-11 p-0 bg-slate-800'>
      <div className='bottom-0 right-0 z-50 h-11 border-t border-gray-600 bg-default-hover'>
        <div className={`grid h-full grid-cols-3 mx-auto`}>{children}</div>
      </div>
    </Footer>
  );
};
