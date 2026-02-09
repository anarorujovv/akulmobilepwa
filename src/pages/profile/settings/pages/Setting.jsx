import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../../shared/theme/useTheme';
import ListPagesHeader from '../../../../shared/ui/ListPagesHeader';
import { MdSecurity, MdFormatListNumberedRtl, MdCloud, MdShield } from 'react-icons/md';
import { BiSitemap } from 'react-icons/bi';
import AsyncStorageWrapper from '../../../../services/AsyncStorageWrapper';
import SuccessMessage from '../../../../shared/ui/RepllyMessage/SuccessMessage';
import api from '../../../../services/api';
import ErrorMessage from '../../../../shared/ui/RepllyMessage/ErrorMessage';
import useGlobalStore from '../../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../../services/permissionVerification';
import MyModal from '../../../../shared/ui/MyModal';
import Switch from 'react-switch'; // Assuming react-switch is available or standard input checkbox

// Custom Switch component if react-switch is not installed
const CustomSwitch = ({ checked, onChange, onColor }) => {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 20 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: checked ? onColor : '#ccc', transition: '.4s', borderRadius: 20
      }}>
        <span style={{
          position: 'absolute', content: "", height: 16, width: 16, left: checked ? 22 : 2, bottom: 2,
          backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
        }}></span>
      </span>
    </label>
  );
};


const Setting = () => {
  const navigate = useNavigate();
  let theme = useTheme();
  const setLocal = useGlobalStore(state => state.setLocal);
  const permissions = useGlobalStore(state => state.permissions);

  // State to manage modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionLoadingModal, setPermissionLoadingModal] = useState(false);
  const [apiServerModalVisible, setApiServerModalVisible] = useState(false);
  const [currentApiServer, setCurrentApiServer] = useState('Azerbaycan');
  const [localPermModal, setLocalPermModal] = useState(false);
  const [localPerms, setLocalPerms] = useState(null);

  useEffect(() => {
    // API server durumunu yükleme
    const loadApiServerStatus = async () => {
      try {
        const apiUrl = await AsyncStorageWrapper.getItem('apiCustomUrl');
        if (apiUrl === 'http://84.201.140.231/proxy/1.0/online/controllers/') {
          setCurrentApiServer('Rusiya');
        } else {
          setCurrentApiServer('Azerbaycan');
        }
      } catch (error) {
        ErrorMessage('API server bilgisi yüklenirken hata oluştu');
      }
    };

    loadApiServerStatus();
  }, []);

  useEffect(() => {
    const loadLocalPermissions = async () => {
      try {
        const stored = await AsyncStorageWrapper.getItem('local_per');
        const perms = stored ? JSON.parse(stored) : {
          demands: {
            demand: {
              listPrice: true,
              positionPrice: true,
              positionModalPrice: true,
              customerDebt: true,
              date: true
            },
            demandReturn: {
              listPrice: true,
              positionPrice: true,
              positionModalPrice: true,
              customerDebt: true,
              date: true
            },
            demandToPayment: {
              // default structure from original if missing?
              // Checking original code: demandToPayment wasn't explicitly in default structure in useEffect, 
              // but referenced in rendering. I will add it if needed, or rely on stored.
              // "demandToPayment" keys? Original code logs undefined if absent.
            },
            stockBalance: {
              // ...
            },
            customerOrder: {
              listPrice: true,
              positionPrice: true,
              positionModalPrice: true,
              customerDebt: true
            }
          }
        };
        // Ensure structure exists
        if (!perms.demands.demandToPayment) perms.demands.demandToPayment = {};
        if (!perms.demands.stockBalance) perms.demands.stockBalance = {};

        setLocalPerms(perms);
      } catch (error) {
        ErrorMessage('İcazələr yüklənərkən xəta baş verdi');
      }
    };
    loadLocalPermissions();
  }, []);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      padding: 0,
    },
    optionItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      cursor: 'pointer'
    },
    optionIcon: {
      marginRight: 16,
    },
    optionText: {
      fontSize: 16,
      color: theme.black,
    },
    separator: {
      height: 1,
      backgroundColor: theme.whiteGrey,
      width: '100%'
    },
    modalContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      width: '100%'
    },
    modalButton: {
      width: '100%',
      padding: 15,
      backgroundColor: theme.primary,
      borderRadius: 5,
      marginVertical: 10,
      textAlign: 'center',
      cursor: 'pointer',
      border: 'none',
      color: theme.stable.white,
      fontSize: 16
    },
    permissionSection: {
      marginVertical: 10,
      width: '100%',
    },
    permissionHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.black,
      marginBottom: 10,
    },
    permissionItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    permissionText: {
      fontSize: 14,
      color: theme.black,
    },
  };

  const handleUpdatePermission = async () => {
    setPermissionLoadingModal(true);
    await api('permissions/get.php', {
      token: await AsyncStorageWrapper.getItem('token')
    }).then(async element => {
      if (element != null) {
        let permissions = element.Permissions;
        await AsyncStorageWrapper.setItem('ownerId', element.OwnerId);
        await AsyncStorageWrapper.setItem("depId", element.DepartmentId);
        await AsyncStorageWrapper.setItem('perlist', JSON.stringify(permissions));
        window.location.reload();
      }
    }).catch(err => {
      ErrorMessage(err)
    })
    setPermissionLoadingModal(false);
  }

  const handleSelectApiServer = async (server) => {
    try {
      if (server === 'Azerbaycan') {
        await AsyncStorageWrapper.removeItem('apiCustomUrl');
        setCurrentApiServer('Azerbaycan');
        SuccessMessage('Azerbaycan serveri seçildi. Sistem yeniden başlatılmayacak.');
      } else if (server === 'Rusiya') {
        await AsyncStorageWrapper.setItem('apiCustomUrl', 'http://84.201.140.231/proxy/1.0/online/controllers/');
        setCurrentApiServer('Rusiya');
        SuccessMessage('Rusiya serveri seçildi. Sistem yeniden başlatılmayacak.');
      }
      setApiServerModalVisible(false);
    } catch (error) {
      ErrorMessage('API server ayarları kaydedilirken hata oluştu');
    }
  }

  const handleTogglePermission = async (module, page, permission) => {
    const newPerms = { ...localPerms };
    if (!newPerms.demands[module]) newPerms.demands[module] = {};
    newPerms.demands[module][permission] = !newPerms.demands[module][permission];
    setLocalPerms(newPerms);

    await AsyncStorageWrapper.setItem('local_per', JSON.stringify(newPerms));
    setLocal(newPerms);
    SuccessMessage('İcazələr yeniləndi');
  };

  let data = [
    {
      label: "Xərc-Maddələri",
      name: "spenditems",
      icon: <BiSitemap size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => {
        navigate("spend-items");
      },
      show: true
    },
    {
      label: "Əsas Ölçü Vahidi",
      name: "defaultunit",
      icon: <MdFormatListNumberedRtl size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => {
        setModalVisible(true);
      },
      show: true
    },
    {
      label: 'İcazələr',
      name: 'permission',
      icon: <MdSecurity size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: handleUpdatePermission,
      show: true
    },
    {
      label: `API Server (${currentApiServer})`,
      name: 'apiserver',
      icon: <MdCloud size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => {
        setApiServerModalVisible(true);
      },
      show: true
    },
    {
      label: "Lokal İcazələr",
      name: "localpermissions",
      icon: <MdShield size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => setLocalPermModal(true),
      show: permission_ver(permissions, 'settingPage', 'C')
    }

  ];

  const handleSelectDefaultUnit = async (value) => {
    await AsyncStorageWrapper.setItem("defaultUnit", String(value));
    setModalVisible(false);
    SuccessMessage(`${value == 0 ? 'Əsas' : "Digər"} ölçü vahidi seçildi`)
  }

  return (
    <>
      <ListPagesHeader header={'Ayarlar'} />
      <div style={styles.container}>
        {data.map((element, index) => {
          if (!element.show) return null;
          return (
            <div key={index}>
              <div onClick={element.onPress} style={styles.optionItem}>
                {element.icon}
                <span style={styles.optionText}>{element.label}</span>
              </div>
              <div style={styles.separator} />
            </div>
          )
        })}
      </div>

      <MyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        center={true}
        width={'80%'}
      >
        <div style={styles.modalContainer}>
          <span style={{ fontSize: 18, marginBottom: 20 }}>Seçim edin:</span>
          <div style={styles.modalButton} onClick={() => handleSelectDefaultUnit(0)}>
            <span style={{ color: 'white' }}>Əsas Ölçü</span>
          </div>
          <div style={styles.modalButton} onClick={() => handleSelectDefaultUnit(1)}>
            <span style={{ color: 'white' }}>Digər</span>
          </div>
        </div>
      </MyModal>

      <MyModal
        modalVisible={apiServerModalVisible}
        setModalVisible={setApiServerModalVisible}
        center={true}
        width={'80%'}
      >
        <div style={styles.modalContainer}>
          <span style={{ fontSize: 18, marginBottom: 20 }}>Server seçin:</span>
          <div style={{ ...styles.modalButton, backgroundColor: currentApiServer === 'Azerbaycan' ? theme.pink : theme.primary }} onClick={() => handleSelectApiServer('Azerbaycan')}>
            <span style={{ color: 'white' }}>Azerbaycan Server</span>
          </div>
          <div style={{ ...styles.modalButton, backgroundColor: currentApiServer === 'Rusiya' ? theme.pink : theme.primary }} onClick={() => handleSelectApiServer('Rusiya')}>
            <span style={{ color: 'white' }}>Rusiya Server</span>
          </div>
        </div>
      </MyModal>

      <MyModal
        modalVisible={permissionLoadingModal}
        setModalVisible={setPermissionLoadingModal}
        center={true}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="spinner"></div>
          <span style={{ textAlign: 'center', color: theme.primary, marginTop: 10 }}>İcazələr Yenilənir...</span>
        </div>
      </MyModal>

      <MyModal
        modalVisible={localPermModal}
        setModalVisible={setLocalPermModal}
        center={true}
        width={'90%'}
        height={'80vh'} // Scrollable
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, marginBottom: 20, color: theme.black, textAlign: 'center' }}>Lokal İcazələr</span>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {localPerms && Object.keys(localPerms.demands).map((module) => (
              <div key={module} style={styles.permissionSection}>
                <div style={styles.permissionHeader}>
                  {module === 'demand' ? 'Satış' :
                    module === 'demandReturn' ? 'Satış Qaytarma' :
                      module === 'demandToPayment' ? 'Satışdan ödəniş' :
                        module === 'stockBalance' ? 'Anbar qalığı' : module}
                </div>
                {localPerms.demands[module] && Object.entries(localPerms.demands[module]).map(([perm, value]) => (
                  <div key={perm} style={styles.permissionItem}>
                    <span style={styles.permissionText}>
                      {perm === 'listPrice' ? 'Siyahı Qiyməti' :
                        perm === 'positionPrice' ? 'Position Qiyməti' :
                          perm === 'positionModalPrice' ? 'Position Modal Qiyməti' :
                            perm === 'customerDebt' ? 'Müştəri Borcu' :
                              perm === 'sum' ? 'Cəmi' :
                                perm === 'supplyBalance' ? 'Alış' :
                                  perm === 'allSum' ? 'List cəmlər' :
                                    perm === 'date' ? 'Tarix' :
                                      perm}
                    </span>
                    <CustomSwitch
                      checked={value}
                      onChange={() => handleTogglePermission(module, module, perm)}
                      onColor={theme.primary}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={styles.modalButton} onClick={() => setLocalPermModal(false)}>
            <span style={{ color: 'white' }}>Bağla</span>
          </div>
        </div>
      </MyModal>
    </>
  );
}

export default Setting;
