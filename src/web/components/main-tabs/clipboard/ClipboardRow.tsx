import { App } from 'antd';
import { ListRowProps } from 'react-virtualized';
import { ClipboardData } from '../../../../@types/Context';
import { htmlToEditor } from '../../../../lib/string';
import { timeSince } from '../../../../lib/time';
import Icon from '../../common/Icon';
const getContentData = (row: ClipboardData) => {
  switch (row.format) {
    case 'image/png':
      if (row.src && row.width && row.height) {
        return (
          <img
            src={`${window.myAPI.sync('getClipboardImageBasePath')}/${row.src}`}
            className={`m-0.5 h-[calc(100%-1.5rem)] max-w-[calc(100%-2rem)] mb-4 ml-1 mr-8 z-10 hover:fixed hover:max-w-none ${
              row.width > row.height ? 'hover:h-60' : 'hover:h-60'
            }`}
          />
        );
      }
    default:
      return (
        <div
          className='m-0.5 ml-1 mr-8 h-[calc(100%-1.5rem)] overflow-hidden text-white'
          dangerouslySetInnerHTML={{ __html: htmlToEditor(row.text || '') }} // escape html
        />
      );
  }
};

export const ClipboardRow = ({ row, style }: ListRowProps & { row: ClipboardData }) => {
  const { message } = App.useApp();
  return (
    <div
      style={style}
      title={row.format === 'image/png' ? '' : row.text}
      key={row.uuid}
      onClick={() => {
        window.myAPI.async('copyClipboard', { uuid: row.uuid });
        message.success({
          content: '클립보드에 복사되었습니다.',
          duration: 1.5,
        });
        window.myAPI.async('afterCopyClipboard');
      }}
      onContextMenu={() => window.myAPI.async('openFloatWindow', row)}
      className='relative border-0 border-solid border-b cursor-pointer break-all break-word overflow-hidden border:gray-100 border-gray-600 bg-default-hover'>
      {getContentData(row)}
      <div
        title='favorite'
        className='group'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.myAPI.async('favoriteClipboard', { uuid: row.uuid });
        }}>
        <Icon
          icon={'star-full'}
          style={{ right: '9px' }}
          className={`absolute top-1 w-4 h-4 fill-gray-500 group-hover:fill-yellow-500 ${row.fav && 'fill-yellow-500'}`}
        />
      </div>
      <div
        title='remove'
        style={{ right: '10px' }}
        className='absolute bottom-1 p-0 m-0 group'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.myAPI.async('removeClipboard', { uuid: row.uuid });
          message.error({
            content: '항목이 제거되었습니다.',
            duration: 1.5,
          });
        }}>
        <Icon icon={'cross'} className='w-3.5 h-3.5 fill-gray-500 group-hover:fill-red-500' />
      </div>
      <div className='absolute left-0.5 bottom-0.5'>
        <div className='inline '>
          <p className='inline px-1 text-xs text-gray-400'>{timeSince(row.date)}</p>
        </div>
        {(row.text || '').split('\n').length > 3 && (
          <p className='inline px-1 text-xs text-gray-300 border border-solid rounded border-gray-500'>{`${
            row.format === 'image/png' ? 'image' : (row.text || '').split('\n').length + ' lines'
          }`}</p>
        )}
      </div>
    </div>
  );
};
