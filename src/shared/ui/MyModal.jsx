import React from 'react';
import { Modal } from 'antd-mobile';

const MyModal = ({
  modalVisible,
  setModalVisible,
  width,
  height,
  center,
  position,
  children,
  title
}) => {
  return (
    <Modal
      visible={modalVisible}
      content={children}
      closeOnMaskClick
      onClose={() => {
        setModalVisible(false)
      }}
      showCloseButton
    />
  );
};

export default MyModal;
