import { NavBar } from '../main-layouts/NavBar';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List, { ListRowProps } from 'react-virtualized/dist/commonjs/List';
import { useEffect, useState } from 'react';
import { NavIcon } from '../common/NavIcon';
import { useClipboardList } from './clipboard/useClipboardList';
import { NavType } from './clipboard/types';
import { ClipboardRow } from './clipboard/ClipboardRow';
import { SearchInput } from '../common/SearchInput';

export function ClipboardTab() {
  const [nav, setNav] = useState<NavType>('history');
  const [search, setSearch] = useState<string>('');
  const list = useClipboardList(nav, search);
  useEffect(() => {
    const grid = window.document.getElementsByClassName('ReactVirtualized__Grid').item(0);
    if (grid) grid.scrollTop = 0;
  }, [nav]);
  return (
    <>
      <SearchInput search={search} setSearch={setSearch} />
      <div className='h-full w-full'>
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              rowCount={list.length}
              rowHeight={(params) => {
                const clipboardData = list[params.index];
                if (clipboardData.format === 'image/png' && clipboardData.height) {
                  if (clipboardData.height > 144) return 144;
                  if (clipboardData.height > 40) return clipboardData.height;
                }
                if (clipboardData.format === 'text/plain') {
                  if ((clipboardData.text || '').split('\n').length == 2) return 72;
                  if ((clipboardData.text || '').split('\n').length >= 3) return 96;
                }
                return 48;
              }}
              rowRenderer={(props: ListRowProps) => <ClipboardRow row={list[props.index]} {...props} />}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
      <NavBar>
        <NavIcon isSelected={nav === 'history'} icon={'history'} onClick={() => setNav('history')} />
        <NavIcon isSelected={nav === 'image'} icon={'image'} onClick={() => setNav('image')} />
        <NavIcon isSelected={nav === 'favorite'} icon={'star-full'} onClick={() => setNav('favorite')} />
      </NavBar>
    </>
  );
}
