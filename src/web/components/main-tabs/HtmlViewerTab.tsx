import { useState, useEffect, useRef } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List, { ListRowProps } from 'react-virtualized/dist/commonjs/List';
import { SearchInput } from '../common/SearchInput';
import { App } from 'antd';
import Icon from '../common/Icon';
import { HtmlViewerData } from '../../../@types/Context';
import AddHtmlViewModal from './html-viewer/AddHtmlViewerModal';

export function HtmlViewerTab() {
  const [search, setSearch] = useState<string>('');
  const [list, setList] = useState<HtmlViewerData[]>([]);
  useEffect(() => {
    setList(window.myAPI.sync('getHtmlViewer'));
    const subscribeFn = window.myAPI.subscribe('htmlViewer', (sender, data) => {
      setList(data);
    });
    return () => subscribeFn();
  }, []);
  useEffect(() => {
    const grid = window.document.getElementsByClassName('ReactVirtualized__Grid').item(0);
    if (grid) grid.scrollTop = 0;
  }, []);
  return (
    <>
      <SearchInput search={search} setSearch={setSearch} />
      <div className='h-full w-full'>
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              rowCount={list.length}
              rowHeight={48}
              rowRenderer={(props: ListRowProps) => <HtmlViewerRow row={list[props.index]} {...props} />}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
      <AddHtmlViewModal />
    </>
  );
}

export const HtmlViewerRow = ({ row, style }: ListRowProps & { row: HtmlViewerData }) => {
  const { message } = App.useApp();
  return (
    <div
      style={style}
      key={row.uuid}
      onClick={() => {
        window.myAPI.async('openFloatHtmlWindow', row);
      }}
      onContextMenu={() => window.myAPI.async('openFloatWindow', row)}
      className='relative border-0 border-solid border-b cursor-pointer break-all break-word overflow-hidden border:gray-100 border-gray-600 bg-default-hover'>
      <div className='m-0.5 ml-1 mr-8 h-[calc(100%-1.5rem)] overflow-hidden text-white'>{row.title}</div>
      <div
        title='remove'
        style={{ right: '10px' }}
        className='absolute bottom-1 p-0 m-0 group'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.myAPI.async('removeHtmlViewer', { uuid: row.uuid });
          message.error({
            content: '항목이 제거되었습니다.',
            duration: 1.5,
          });
        }}>
        <Icon icon={'cross'} className='w-3.5 h-3.5 fill-gray-500 group-hover:fill-red-500' />
      </div>
    </div>
  );
};
