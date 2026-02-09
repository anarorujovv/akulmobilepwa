import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  List,
  Popup,
  SpinLoading,
  Space,
  ActionSheet
} from 'antd-mobile';
import {
  UserOutlined,
  LockOutlined,
  DeleteOutlined,
  CloudOutlined,
  LoginOutlined
} from '@ant-design/icons';
import axios from 'axios';
import ErrorMessage from './../shared/ui/RepllyMessage/ErrorMessage';
import SuccessMessage from './../shared/ui/RepllyMessage/SuccessMessage';
import AsyncStorage from './../services/AsyncStorageWrapper';
import api from './../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [serverActionVisible, setServerActionVisible] = useState(false);
  const [currentApiServer, setCurrentApiServer] = useState('Azerbaycan');

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
      setServerActionVisible(false);
    } catch (error) {
      ErrorMessage('API server ayarları kaydedilirken hata oluştu');
    }
  };

  const loadSavedUsers = async () => {
    try {
      const users = await AsyncStorage.getItem('savedUsers');
      if (users) {
        setSavedUsers(JSON.parse(users));
        setShowUserPopup(true);
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
    setShowUserPopup(false);
    setLogin(user.login);
    setPassword(user.password);
    fetchingAuthApi(user.login, user.password);
  };

  const deleteSavedUser = async (user, e) => {
    e.stopPropagation();
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
        if (response.data.Headers.ResponseStatus == 0) {
          if (rememberMe) {
            await saveUser();
          }

          await AsyncStorage.setItem('refreshToken', '');
          await AsyncStorage.setItem('token', response.data.Body.Token);
          await AsyncStorage.setItem('publicMode', response.data.Body.PublicMode);
          await AsyncStorage.setItem('login_info', JSON.stringify(response.data.Body));
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
              await AsyncStorage.setItem('depId', element.DepartmentId);
              await AsyncStorage.setItem('perlist', JSON.stringify(permissions));
            }
          }).catch(err => {
            ErrorMessage(err);
          });

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

  const serverActions = [
    {
      text: 'Azerbaycan Server',
      key: 'az',
      onClick: () => handleSelectApiServer('Azerbaycan'),
      description: currentApiServer === 'Azerbaycan' ? '✓ Aktiv' : undefined
    },
    {
      text: 'Rusiya Server',
      key: 'ru',
      onClick: () => handleSelectApiServer('Rusiya'),
      description: currentApiServer === 'Rusiya' ? '✓ Aktiv' : undefined
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--adm-color-background)',
      padding: 20
    }}>
      {/* Logo / Title */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: 'var(--adm-color-primary)',
          margin: 0
        }}>
          BeinAZ
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--adm-color-weak)',
          marginTop: 8
        }}>
          İdarəetmə sisteminə xoş gəlmisiniz
        </p>
      </div>

      {/* Login Form Card */}
      <Card style={{
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 8
      }}>
        <Form layout='vertical'>
          <Form.Item>
            <Input
              placeholder='Login'
              value={login}
              onChange={setLogin}
              clearable
              style={{ '--font-size': '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Input
              placeholder='Şifrə'
              type='password'
              value={password}
              onChange={setPassword}
              clearable
              style={{ '--font-size': '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                style={{ '--icon-size': '20px', '--font-size': '14px' }}
              >
                Xatırla
              </Checkbox>

              <Button
                size='small'
                fill='none'
                onClick={() => setServerActionVisible(true)}
              >
                <Space align='center' style={{ '--gap': '4px' }}>
                  <CloudOutlined />
                  <span>{currentApiServer}</span>
                </Space>
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              block
              color='primary'
              size='large'
              loading={isLoading}
              onClick={() => fetchingAuthApi(login, password)}
              style={{
                '--border-radius': '8px',
                fontWeight: 600
              }}
            >
              <Space align='center' style={{ '--gap': '8px' }}>
                <LoginOutlined />
                <span>Daxil ol</span>
              </Space>
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Saved Users Button */}
      {savedUsers.length > 0 && (
        <Button
          fill='none'
          style={{ marginTop: 20, color: 'var(--adm-color-primary)' }}
          onClick={() => setShowUserPopup(true)}
        >
          <Space align='center' style={{ '--gap': '6px' }}>
            <UserOutlined />
            <span>Yadda saxlanmış istifadəçilər ({savedUsers.length})</span>
          </Space>
        </Button>
      )}

      {/* Saved Users Popup */}
      <Popup
        visible={showUserPopup}
        onMaskClick={() => setShowUserPopup(false)}
        bodyStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '60vh'
        }}
      >
        <div style={{ padding: '16px 16px 0 16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <h3 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--adm-color-text)'
            }}>
              Qeydiyyatlı istifadəçilər
            </h3>
            <Button
              fill='none'
              size='small'
              onClick={() => setShowUserPopup(false)}
            >
              Bağla
            </Button>
          </div>
        </div>

        {savedUsers.length === 0 ? (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: 'var(--adm-color-weak)'
          }}>
            <UserOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <p>Qeydiyyatlı istifadəçi tapılmadı</p>
          </div>
        ) : (
          <List>
            {savedUsers.map((user, index) => (
              <List.Item
                key={index}
                prefix={<UserOutlined style={{ fontSize: 20, color: 'var(--adm-color-primary)' }} />}
                extra={
                  <Button
                    fill='none'
                    size='small'
                    onClick={(e) => deleteSavedUser(user, e)}
                  >
                    <DeleteOutlined style={{ color: 'var(--adm-color-danger)' }} />
                  </Button>
                }
                onClick={() => selectSavedUser(user)}
                arrow={false}
              >
                {user.login}
              </List.Item>
            ))}
          </List>
        )}
      </Popup>

      {/* Server Selection ActionSheet */}
      <ActionSheet
        visible={serverActionVisible}
        actions={serverActions}
        onClose={() => setServerActionVisible(false)}
        cancelText='Ləğv et'
      />
    </div>
  );
};

export default Login;
