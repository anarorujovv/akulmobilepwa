import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoEllipsisVertical, IoPrint, IoCash } from 'react-icons/io5';
import { MdInsertDriveFile } from 'react-icons/md';
import useTheme from '../theme/useTheme';
import IconButton from './IconButton';
import TempsModal from './modals/TempsModal';
import prompt from '../../services/prompt';

const ManageHeader = ({
  document,
  print,
  hasUnsavedChanges,
  isExcel,
  isPriceList,
  onSubmit,
  type,
  customMenu
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [tempModal, setTempModal] = useState(false);
  const [priceListModal, setPriceListModal] = useState(false);

  const handleMenuClick = async (action) => {
    let id = null;
    if (document.Id && !hasUnsavedChanges) {
      id = document.Id;
    } else {
      if (onSubmit) {
        id = await onSubmit();
      }
      if (id == null) {
        setMenuVisible(false);
        return;
      }
    }

    if (id) {
      switch (action) {
        case 'Print':
          setTempModal(true);
          setMenuVisible(false);
          break;
        case 'Excel':
          setMenuVisible(false);
          break;
        case 'PriceList':
          setPriceListModal(true);
          setMenuVisible(false);
          break;
        default:
          setMenuVisible(false);
      }
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      // Web için window.confirm kullanılabilir veya custom prompt
      if (window.confirm('Çıxmağa əminsiniz ?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const styles = {
    top: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px',
      boxSizing: 'border-box',
      position: 'relative'
    },
    dropdown: {
      position: 'absolute',
      top: 55,
      right: 10,
      backgroundColor: theme.stable.white,
      borderRadius: 8,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: 150,
      padding: 10
    },
    menuItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '10px 15px',
      cursor: 'pointer',
      borderBottom: `1px solid ${theme.input.greyWhite}`,
      gap: 10
    },
    menuText: {
      fontSize: 16,
      color: theme.textColor,
      fontWeight: 500
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999
    }
  };

  return (
    <div style={styles.top}>
      <IconButton onPress={handleBack} size={40}>
        <IoArrowBack size={25} color={theme.stable.white} />
      </IconButton>

      <IconButton onPress={() => setMenuVisible(!menuVisible)} size={40}>
        <IoEllipsisVertical size={25} color={theme.stable.white} />
      </IconButton>

      {menuVisible && (
        <>
          <div style={styles.overlay} onClick={() => setMenuVisible(false)} />
          <div style={styles.dropdown}>
            {isExcel && (
              <div style={styles.menuItem} onClick={() => handleMenuClick('Excel')}>
                <MdInsertDriveFile size={20} color={theme.green} />
                <span style={styles.menuText}>Excel</span>
              </div>
            )}

            {print && (
              <div style={styles.menuItem} onClick={() => handleMenuClick('Print')}>
                <IoPrint size={20} color={theme.primary} />
                <span style={styles.menuText}>Print</span>
              </div>
            )}

            {isPriceList && (
              <div style={styles.menuItem} onClick={() => handleMenuClick('PriceList')}>
                <IoCash size={20} color={theme.primary} />
                <span style={styles.menuText}>Price List</span>
              </div>
            )}

            {customMenu && customMenu.map((item, index) => (
              <div key={index} style={styles.menuItem} onClick={() => {
                item.onPress();
                setMenuVisible(false);
              }}>
                {/* İkonu dinamik render etmek gerekebilir, şimdilik basit tuttum */}
                <span style={styles.menuText}>{item.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <TempsModal
        modalVisible={tempModal}
        setModalVisible={setTempModal}
        document={document}
        name={print}
        type={type}
      />

      <TempsModal
        modalVisible={priceListModal}
        setModalVisible={setPriceListModal}
        document={document}
        name={'products'}
        priceList={true}
      />
    </div>
  );
};

export default ManageHeader;
