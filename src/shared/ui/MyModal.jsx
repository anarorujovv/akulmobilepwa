import React from 'react';
import useTheme from '../theme/useTheme';

const MyModal = ({
  modalVisible,
  setModalVisible,
  width,
  height,
  center,
  position,
  children
}) => {
  const theme = useTheme();

  if (!modalVisible) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: center ? 'center' : 'flex-start',
      alignItems: center ? 'center' : 'flex-start',
      zIndex: 1000
    },
    modal: {
      position: position ? 'absolute' : 'relative',
      backgroundColor: theme.stable.white,
      borderRadius: 5,
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      width: width || 'auto',
      height: height || 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      ...position
    }
  };

  return (
    <div
      style={styles.overlay}
      onClick={() => setModalVisible(false)}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default MyModal;
