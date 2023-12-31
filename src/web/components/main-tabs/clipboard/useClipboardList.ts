import { useState, useEffect } from 'react';
import { ClipboardData } from '../../../../@types/Context';
import { NavType } from './types';

export const useClipboardList = (nav: NavType, searchText: string) => {
  const [list, setList] = useState<ClipboardData[]>([]);
  useEffect(() => {
    setList(window.myAPI.sync('getClipboard'));
    const subscribeFn = window.myAPI.subscribe('clipboard', (sender, data) => {
      setList(data);
    });
    return () => subscribeFn();
  }, []);
  let resultList = list || [];
  if (nav === 'history') resultList = list;
  else if (nav === 'image') resultList = list.filter((c) => c.format === 'image/png');
  else if (nav === 'favorite') resultList = list.filter((c) => c.fav);
  if (searchText !== '') return resultList.filter((c) => c.text?.includes(searchText));
  return resultList;
};
