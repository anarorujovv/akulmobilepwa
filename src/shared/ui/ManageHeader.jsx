import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoEllipsisVertical, IoPrint, IoCash } from 'react-icons/io5';
import { MdInsertDriveFile } from 'react-icons/md';
import { NavBar, Popover } from 'antd-mobile';
import useTheme from '../theme/useTheme';
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

  const actions = [];
  if (isExcel) actions.push({ key: 'Excel', text: 'Excel', icon: <MdInsertDriveFile /> });
  if (print) actions.push({ key: 'Print', text: 'Print', icon: <IoPrint /> });
  if (isPriceList) actions.push({ key: 'PriceList', text: 'Price List', icon: <IoCash /> });
  if (customMenu) {
    customMenu.forEach((item, index) => {
      actions.push({ key: `custom_${index}`, text: item.name, icon: <IoEllipsisVertical />, onPress: item.onPress });
    });
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'var(--adm-color-primary)'
      }}>
        <NavBar
          style={{
            '--height': '55px',
            '--background-color': 'var(--adm-color-primary)',
            '--title-color': '#fff',
            '--icon-color': '#fff'
          }}
          backArrow={<IoArrowBack size={25} />}
          onBack={handleBack}
          right={
            <Popover.Menu
              actions={actions}
              onAction={(node) => {
                if (node.key.startsWith('custom_')) {
                  node.onPress();
                } else {
                  handleMenuClick(node.key);
                }
              }}
              placement='bottom-end'
              trigger='click'
            >
              <IoEllipsisVertical size={25} color='#fff' style={{ cursor: 'pointer' }} />
            </Popover.Menu>
          }
        >
          {/* Title could go here if needed, or empty */}
        </NavBar>
      </div>
      <div style={{ height: 55 }} />
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
    </>
  );
};

export default ManageHeader;
