import React from 'react';
import { NavBar, SpinLoading } from 'antd-mobile';

const PositionManageHeader = ({ navigation, handleSave, loading, id, createText, updateText, hasUnsavedChanges, onBack }) => {

  const handleBack = () => {
    if (onBack) onBack();
    else navigation?.goBack();
  };

  return (
    <NavBar
      onBack={handleBack}
      right={
        <div
          onClick={!loading ? handleSave : undefined}
          style={{
            fontSize: 16,
            color: loading ? '#ccc' : 'var(--adm-color-primary)',
            cursor: loading ? 'default' : 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? <SpinLoading color='primary' style={{ '--size': '18px' }} /> : (id == null ? createText : updateText)}
        </div>
      }
      style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}
    >

    </NavBar>
  );
};

export default PositionManageHeader;