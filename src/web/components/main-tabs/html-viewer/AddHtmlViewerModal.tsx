import { useState, useRef, useEffect } from 'react';
import { App, Button, FloatButton, Form, Input, Modal, Upload } from 'antd';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

const AddHtmlViewModal = () => {
  const tmpHtmlRef = useRef<RcFile>();
  const tmpTitleRef = useRef<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    tmpHtmlRef.current = undefined;
    tmpTitleRef.current = undefined;
    form.resetFields();
  }, [isModalOpen]);

  return (
    <>
      <Modal
        title='Html 뷰어 추가'
        styles={{ body: { height: 180 } }}
        open={isModalOpen}
        onOk={() => {
          if (tmpHtmlRef.current && tmpTitleRef.current && tmpTitleRef.current !== '') {
            window.myAPI.async('addHtmlViewer', { src: tmpHtmlRef.current.path, title: tmpTitleRef.current });
            setIsModalOpen(false);
          } else {
            if (!tmpTitleRef.current || tmpTitleRef.current === '')
              message.error({
                content: `제목이 비어 있습니다.`,
                duration: 1.5,
              });
            if (!tmpHtmlRef.current)
              message.error({
                content: `Html 파일이 없습니다.`,
                duration: 1.5,
              });
          }
        }}
        onCancel={() => setIsModalOpen(false)}>
        <Form form={form}>
          <Form.Item name={'title'} label={'제목'}>
            <Input placeholder='제목을 입력하세요.' onChange={(e) => (tmpTitleRef.current = e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Upload
              listType='picture'
              maxCount={1}
              beforeUpload={(rc) => {
                const isHTML = rc.type === 'text/html';
                if (!isHTML) {
                  message.error({
                    content: `${rc.name} is not a html file`,
                    duration: 1.5,
                  });
                  return Upload.LIST_IGNORE;
                }
                return true;
              }}
              onChange={(rc) => {
                if (rc.file.status === 'done' && rc.file.originFileObj) {
                  tmpHtmlRef.current = rc.file.originFileObj;
                }
              }}>
              <Button icon={<UploadOutlined />}>HTML 파일 업로드</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <FloatButton
        onClick={() => setIsModalOpen(true)}
        icon={<PlusCircleOutlined />}
        type='primary'
        style={{ right: 24, bottom: 24 }}
      />
    </>
  );
};

export default AddHtmlViewModal;
