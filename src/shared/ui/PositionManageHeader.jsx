import React from 'react';
import IconButton from './IconButton';
import { IoArrowBack } from 'react-icons/io5';
import useTheme from '../theme/useTheme';
import prompt from '../../services/prompt';

const PositionManageHeader = ({ navigation, handleSave, loading, id, createText, updateText, hasUnsavedChanges, onBack }) => {

  const theme = useTheme();

  const styles = {
    top: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      boxSizing: 'border-box'
    },
    text: {
      fontSize: 18,
      color: theme.stable.white
    },
    saveButton: {
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0 10px'
    }
  };

  const handleBack = () => {
    // HasUnsavedChanges kontrolü prompt servisi ile
    // if (hasUnsavedChanges) {
    //   // prompt fonksiyonunun web versiyonu window.confirm olabilir veya custom modal.
    //   // Şimdilik varsayılan bir yapı kullanıyoruz
    //   if (window.confirm('Çıxmağa əminsiniz ?')) {
    //     if(onBack) onBack();
    //     else navigation?.goBack();
    //   }
    // } else {
    if (onBack) onBack();
    else navigation?.goBack();
    // }
  };


  return (
    <div style={styles.top}>
      <IconButton onPress={handleBack} size={40}>
        <IoArrowBack size={25} color={theme.stable.white} />
      </IconButton>

      <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
        {
          loading ?
            <div className="spinner-white"></div>
            :
            <span style={styles.text}>
              {
                id == null ?
                  createText
                  :
                  updateText
              }
            </span>
        }
      </button>
    </div>
  );
};

export default PositionManageHeader;