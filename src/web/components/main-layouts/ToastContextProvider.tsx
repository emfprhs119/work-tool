import { MessageArgsProps, NotificationArgsProps, message, notification } from 'antd';
import { JointContent, MessageInstance, MessageType } from 'antd/es/message/interface';
import { NotificationInstance } from 'antd/es/notification/interface';
import React, { PropsWithChildren, useContext } from 'react';

interface ToastController {
  toastApi: NotificationInstance;
  messageApi: MessageInstance;
}

export const ToastContext = React.createContext<ToastController>({
  toastApi: {
    success: function (args: NotificationArgsProps): void {
      throw new Error('Function not implemented.');
    },
    error: function (args: NotificationArgsProps): void {
      throw new Error('Function not implemented.');
    },
    info: function (args: NotificationArgsProps): void {
      throw new Error('Function not implemented.');
    },
    warning: function (args: NotificationArgsProps): void {
      throw new Error('Function not implemented.');
    },
    open: function (args: NotificationArgsProps): void {
      throw new Error('Function not implemented.');
    },
    destroy: function (key?: React.Key | undefined): void {
      throw new Error('Function not implemented.');
    },
  },
  messageApi: {
    info: function (
      content: JointContent,
      duration?: number | VoidFunction | undefined,
      onClose?: VoidFunction | undefined
    ): MessageType {
      throw new Error('Function not implemented.');
    },
    success: function (
      content: JointContent,
      duration?: number | VoidFunction | undefined,
      onClose?: VoidFunction | undefined
    ): MessageType {
      throw new Error('Function not implemented.');
    },
    error: function (
      content: JointContent,
      duration?: number | VoidFunction | undefined,
      onClose?: VoidFunction | undefined
    ): MessageType {
      throw new Error('Function not implemented.');
    },
    warning: function (
      content: JointContent,
      duration?: number | VoidFunction | undefined,
      onClose?: VoidFunction | undefined
    ): MessageType {
      throw new Error('Function not implemented.');
    },
    loading: function (
      content: JointContent,
      duration?: number | VoidFunction | undefined,
      onClose?: VoidFunction | undefined
    ): MessageType {
      throw new Error('Function not implemented.');
    },
    open: function (args: MessageArgsProps): MessageType {
      throw new Error('Function not implemented.');
    },
    destroy: function (key?: React.Key | undefined): void {
      throw new Error('Function not implemented.');
    },
  },
});

export function ToastProvider({ children }: PropsWithChildren) {
  const [toastApi, contextHolder] = notification.useNotification();
  const [messageApi, msgContextHolder] = message.useMessage();
  return (
    <ToastContext.Provider value={{ toastApi: toastApi, messageApi: messageApi }}>
      {msgContextHolder}
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
}

// useToast.ts
export function useToast() {
  const { toastApi } = useContext(ToastContext);
  return toastApi;
}

// useMessage.ts
export function useMessage() {
  const { messageApi } = useContext(ToastContext);
  return messageApi;
}

// 실제 사용
// const showToast = useToast();

// const handleClickBtn = () => {
//   ...
//   showToast({ message: "🥰 소중한 의견 주셔서 감사해요", duration: 2.5 });
// }
