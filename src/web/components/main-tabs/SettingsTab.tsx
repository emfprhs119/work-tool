import { App, Button, Card, Checkbox, Form, Radio, Select, Switch } from 'antd';
import { useState } from 'react';
import { SettingData } from '../../../lib/settings';

export const SettingsTab = () => {
  const [settings, setSettings] = useState<SettingData>(window.myAPI.sync('getAppSettings'));
  const { modal } = App.useApp();
  console.log(settings.autoStart);
  return (
    <div className='m-3'>
      <Form
        size={'middle'}
        layout='vertical'
        style={{ width: '100%' }}
        onFieldsChange={(changedFields) => {
          window.myAPI.async('setAppSettings', { name: changedFields[0].name[0], value: changedFields[0].value });
        }}
        initialValues={{ size: 'default' }}>
        <Form.Item
          className='mb-2'
          label='[스크린샷 기능]'
          name='screenshotAfter'
          initialValue={[...settings.screenshotAfter, 'clipboard']}>
          <Checkbox.Group>
            <Checkbox value='save'>저장</Checkbox>
            <Checkbox value='floating'>플로팅</Checkbox>
            <Checkbox value='clipboard' disabled>
              클립보드
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item className='mb-4' label='[스크린샷 저장 경로]' name='screenshotSavePath'>
          <Card
            className='h-8 p-0 m-0'
            bodyStyle={{ padding: '3px 10px' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const dirPath = window.myAPI.sync('openDirectory');
              if (dirPath) {
                window.myAPI.async('setAppSettings', { name: 'screenshotSavePath', value: dirPath });
                setSettings((prev) => {
                  return { ...prev, screenshotSavePath: dirPath };
                });
              }
            }}>
            {settings.screenshotSavePath}
          </Card>
        </Form.Item>
        <Form.Item
          className='mb-4'
          label='[스크린샷 저장 파일명] prefix : (capture-)'
          name='screenshotFileNameType'
          initialValue={settings.screenshotFileNameType}>
          <Radio.Group>
            <Radio.Button value='capture-y-m-d_hms'>{'{년-월-일}_{시분초}'}</Radio.Button>
            <Radio.Button value='capture-incremental'>{'{순번}'}</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='autoStart'
          label='[윈도우 시작 시 자동시작]'
          initialValue={settings.autoStart ? 'checked' : ''}>
          <Switch />
        </Form.Item>
        {/* <Form.Item
          className='mb-2'
          label='[스크린샷 핫키]'
          name='screenshotHotKeys'
          initialValue={['S', 'ctrl', 'shift']}>
          <Checkbox.Group>
            <Checkbox value='ctrl'>ctrl</Checkbox>
            <Checkbox value='alt'>alt</Checkbox>
            <Checkbox value='shift'>shift</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name='screenshotHotKeys'>
          <Select
            style={{ display: 'inline-block', width: 80 }}
            // defaultValue={'S'}
            options={[
              ...[...Array(58).keys()].map((i) => {
                return { value: String.fromCharCode(i + 33) };
              }),
              ...[...Array(12).keys()].map((i) => {
                return { value: `F${i + 1}` };
              }),
            ]}
          />
        </Form.Item> */}
        <Form.Item className='mb-2' label='[설정 초기화]'>
          <Button
            onClick={() =>
              modal.confirm({
                title: '설정을 초기화 하시겠습니까?',
                onOk: () => {
                  window.myAPI.async('resetAppSettings').then(() => {
                    window.location.reload();
                  });
                },
              })
            }>
            초기화
          </Button>
        </Form.Item>
        <Form.Item className='mb-2' label='[클립보드 초기화]'>
          <Button
            onClick={() =>
              modal.confirm({
                title: '모든 클립보드 기록을 제거하시겠습니까?',
                onOk: () => window.myAPI.async('removeClipboardAll'),
              })
            }>
            초기화
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
