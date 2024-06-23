import { Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { FormInstance } from 'antd';

export const SearchInput = ({
  search,
  setSearch,
  form,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  form: FormInstance;
}) => {
  const searchRef = useRef(null);
  return (
    <Form form={form} className='mr-1 p-0' style={{ height: 35 }}>
      <Form.Item name={'search'}>
        <Input
          ref={searchRef}
          placeholder='검색어를 입력하세요.'
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
          suffix={
            search !== '' && (
              <CloseOutlined
                onClick={(e) => {
                  form.resetFields();
                  setSearch('');
                }}
              />
            )
          }
        />
      </Form.Item>
    </Form>
  );
};
