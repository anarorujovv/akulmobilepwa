import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../shared/ui/Input';
import Button from '../shared/ui/Button';
import { IoLockOpenOutline, IoPersonCircleOutline, IoTrash, IoClose, IoCheckboxOutline, IoSquareOutline } from 'react-icons/io5';
import { AiOutlineCloud } from 'react-icons/ai';
import axios from 'axios';
import useTheme from '../shared/theme/useTheme';
import ErrorMessage from './../shared/ui/RepllyMessage/ErrorMessage';
import SuccessMessage from './../shared/ui/RepllyMessage/SuccessMessage';
import AsyncStorage from './../services/AsyncStorageWrapper';
import api from './../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [apiServerModalVisible, setApiServerModalVisible] = useState(false);
  const [currentApiServer, setCurrentApiServer] = useState('Azerbaycan');

  const theme = useTheme();

  useEffect(() => {
    loadSavedUsers();
    loadApiServerStatus();
  }, []);

  const loadApiServerStatus = async () => {
    try {
      const apiUrl = await AsyncStorage.getItem('apiCustomUrl');
      if (apiUrl === 'http://84.201.140.231/proxy/1.0/online/controllers/') {
        setCurrentApiServer('Rusiya');
      } else {
        setCurrentApiServer('Azerbaycan');
      }
    } catch (error) {
      ErrorMessage('API server bilgisi yüklenirken hata oluştu');
    }
  };

  const handleSelectApiServer = async (server) => {
    try {
      if (server === 'Azerbaycan') {
        await AsyncStorage.removeItem('apiCustomUrl');
        setCurrentApiServer('Azerbaycan');
        SuccessMessage('Azerbaycan serveri seçildi.');
      } else if (server === 'Rusiya') {
        await AsyncStorage.setItem('apiCustomUrl', 'http://84.201.140.231/proxy/1.0/online/controllers/');
        setCurrentApiServer('Rusiya');
        SuccessMessage('Rusiya serveri seçildi.');
      }
      setApiServerModalVisible(false);
    } catch (error) {
      ErrorMessage('API server ayarları kaydedilirken hata oluştu');
    }
  };

  const loadSavedUsers = async () => {
    try {
      const users = await AsyncStorage.getItem('savedUsers');
      if (users) {
        setSavedUsers(JSON.parse(users));
        setShowUserModal(true);
      }
    } catch (error) {
      ErrorMessage('Qeydiyyatlı istifadəçilər yüklənərkən xəta baş verdi');
    }
  };

  const saveUser = async () => {
    try {
      let users = await AsyncStorage.getItem('savedUsers');
      users = users ? JSON.parse(users) : [];

      const userExists = users.find(user => user.login === login);
      if (!userExists) {
        users.push({ login, password });
        await AsyncStorage.setItem('savedUsers', JSON.stringify(users));
      }
    } catch (error) {
      ErrorMessage('İstifadəçi saxlanarkən xəta baş verdi');
    }
  };

  const selectSavedUser = (user) => {
    setShowUserModal(false);
    setLogin(user.login);
    setPassword(user.password);
    fetchingAuthApi(user.login, user.password);
  };

  const deleteSavedUser = async (user) => {
    try {
      const users = savedUsers.filter(savedUser => savedUser.login !== user.login);
      setSavedUsers(users);
      await AsyncStorage.setItem('savedUsers', JSON.stringify(users));
    } catch (error) {
      ErrorMessage('İstifadəçi silinərkən xəta baş verdi');
    }
  };

  const fetchingAuthApi = async (loginParam = login, passwordParam = password) => {
    setIsLoading(true);

    const existingApiUrl = await AsyncStorage.getItem('apiCustomUrl');
    const loginUrl = existingApiUrl
      ? `http://84.201.140.231/proxy/1.0/online/login/send.php`
      : 'https://api.akul.az/1.0/online/login/send.php';

    try {
      await axios.post(loginUrl, {
        Login: loginParam,
        Password: passwordParam
      }).then(async (response) => {
        console.log(response.data);
        if (response.data.Headers.ResponseStatus == 0) {
          if (rememberMe) {
            await saveUser();
          }

          await AsyncStorage.setItem('refreshToken', '');
          await AsyncStorage.setItem("token", response.data.Body.Token);
          await AsyncStorage.setItem("publicMode", response.data.Body.PublicMode);
          await AsyncStorage.setItem("login_info", JSON.stringify(response.data.Body));
          await AsyncStorage.setItem('local_per', JSON.stringify({
            demands: {
              demand: {
                listPrice: true,
                positionPrice: true,
                positionModalPrice: true,
                customerDebt: true,
                sum: true,
                allSum: true,
                date: true
              },
              demandReturn: {
                listPrice: true,
                positionPrice: true,
                positionModalPrice: true,
                customerDebt: true,
                sum: true,
                allSum: true,
                date: true
              },
              demandToPayment: {
                customerDebt: true
              },
              stockBalance: {
                supplyBalance: true
              },
            },
          }));

          if (existingApiUrl) {
            await AsyncStorage.setItem('apiCustomUrl', existingApiUrl);
          }

          await api('permissions/get.php', {
            token: response.data.Body.Token
          }).then(async element => {
            if (element != null) {
              let permissions = element.Permissions;
              await AsyncStorage.setItem('ownerId', element.OwnerId);
              await AsyncStorage.setItem("depId", element.DepartmentId);
              await AsyncStorage.setItem('perlist', JSON.stringify(permissions));
            }
          }).catch(err => {
            ErrorMessage(err);
          });

          // React Native'deki RNRestart yerine window.location.reload() kullanıyoruz
          window.location.reload();
        } else {
          ErrorMessage(response.data.Body);
        }
      }).catch((err) => {
        ErrorMessage(err.message || 'Bağlantı xətası');
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      ErrorMessage('API çağrısı sırasında bir hata oluştu');
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      flex: 1,
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.stable.white,
      minHeight: '100vh'
    },
    titleContainer: {
      marginBottom: 30,
    },
    titleText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.stable.black
    },
    optionsRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      maxWidth: 400
    },
    rememberMeContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0
    },
    rememberMeText: {
      marginLeft: 8,
      color: theme.stable.black
    },
    serverSelectButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '5px 10px',
      borderRadius: 5,
      backgroundColor: '#f0f0f0',
      border: 'none',
      cursor: 'pointer'
    },
    serverSelectText: {
      marginLeft: 8,
      color: theme.stable.black
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: 20
    },
    modalContent: {
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
      borderRadius: 15,
      backgroundColor: theme.stable.white,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    },
    apiModalContent: {
      width: '80%',
      maxWidth: 350,
      padding: 20,
      borderRadius: 10,
      backgroundColor: theme.stable.white,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    },
    serverButton: {
      width: '100%',
      padding: 15,
      borderRadius: 5,
      margin: '10px 0',
      border: 'none',
      cursor: 'pointer',
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center'
    },
    modalHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottom: '1px solid #C8C8C8'
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.stable.black
    },
    closeButton: {
      padding: 5,
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    userList: {
      maxHeight: 300,
      overflowY: 'auto'
    },
    userItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      borderBottom: `1px solid ${theme.input.grey}`,
      cursor: 'pointer'
    },
    userItemContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    userName: {
      fontSize: 16,
      marginLeft: 10,
      color: theme.stable.black
    },
    emptyContainer: {
      padding: 30,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emptyText: {
      marginTop: 10,
      fontSize: 16,
      textAlign: 'center',
      color: theme.stable.black
    },
    deleteButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 5
    }
  };

  const renderSavedUserModal = () => {
    if (!showUserModal) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <span style={styles.modalTitle}>Qeydiyyatlı istifadəçilər</span>
            <button onClick={() => setShowUserModal(false)} style={styles.closeButton}>
              <IoClose size={24} color={theme.stable.black} />
            </button>
          </div>

          {savedUsers.length === 0 ? (
            <div style={styles.emptyContainer}>
              <IoPersonCircleOutline size={50} color={theme.stable.black} />
              <span style={styles.emptyText}>Qeydiyyatlı istifadəçi tapılmadı</span>
            </div>
          ) : (
            <div style={styles.userList}>
              {savedUsers.map((item, index) => (
                <div key={index} style={styles.userItem} onClick={() => selectSavedUser(item)}>
                  <div style={styles.userItemContent}>
                    <IoPersonCircleOutline size={24} color={theme.stable.black} />
                    <span style={styles.userName}>{item.login}</span>
                  </div>
                  <button style={styles.deleteButton} onClick={(e) => { e.stopPropagation(); deleteSavedUser(item); }}>
                    <IoTrash size={24} color={theme.stable.black} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApiServerModal = () => {
    if (!apiServerModalVisible) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setApiServerModalVisible(false)}>
        <div style={styles.apiModalContent} onClick={e => e.stopPropagation()}>
          <span style={{ fontSize: 18, marginBottom: 20, color: theme.stable.black }}>Server seçin:</span>
          <button
            style={{
              ...styles.serverButton,
              backgroundColor: currentApiServer === 'Azerbaycan' ? theme.pink : theme.primary
            }}
            onClick={() => handleSelectApiServer('Azerbaycan')}
          >
            Azerbaycan Server
          </button>
          <button
            style={{
              ...styles.serverButton,
              backgroundColor: currentApiServer === 'Rusiya' ? theme.pink : theme.primary
            }}
            onClick={() => handleSelectApiServer('Rusiya')}
          >
            Rusiya Server
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {renderSavedUserModal()}
      {renderApiServerModal()}

      <div style={styles.titleContainer}>
        <span style={styles.titleText}>BeinAZ</span>
      </div>

      <Input
        width={'90%'}
        value={login}
        onChange={(txt) => {
          setLogin(txt);
        }}
        placeholder={'Login'}
      />

      <div style={{ margin: 5 }} />

      <Input
        password={true}
        width={'90%'}
        value={password}
        onChange={(txt) => {
          setPassword(txt);
        }}
        placeholder={'Şifrə'}
      />

      <div style={{ margin: 10 }} />

      <div style={styles.optionsRow}>
        <button
          style={styles.rememberMeContainer}
          onClick={() => setRememberMe(!rememberMe)}
        >
          {rememberMe ? (
            <IoCheckboxOutline size={24} color={theme.stable.black} />
          ) : (
            <IoSquareOutline size={24} color={theme.stable.black} />
          )}
          <span style={styles.rememberMeText}>Xatırla</span>
        </button>

        <button
          style={styles.serverSelectButton}
          onClick={() => setApiServerModalVisible(true)}
        >
          <AiOutlineCloud size={20} color={theme.stable.black} />
          <span style={styles.serverSelectText}>{currentApiServer}</span>
        </button>
      </div>

      <div style={{ margin: 10 }} />

      <Button
        icon={<IoLockOpenOutline size={15} color="white" />}
        width={'70%'}
        onClick={() => {
          fetchingAuthApi(login, password);
        }}
        isLoading={isLoading}
      >Daxil ol</Button>
    </div>
  );
};

export default Login;
