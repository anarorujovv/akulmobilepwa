import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, List, Card, SpinLoading, Divider, Image } from 'antd-mobile';
import {
  LogoutOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  WalletOutlined,
  SettingOutlined
} from '@ant-design/icons';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import packageJson from '../../../package.json';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoSource = require('../../images/logo_only.png');

  const fetchingProfileInfo = async () => {
    try {
      const item = await api('company/get.php', {
        token: await AsyncStorageWrapper.getItem('token')
      });
      if (item != null) {
        const loginInfoStr = await AsyncStorageWrapper.getItem('login_info');
        const loginData = loginInfoStr ? JSON.parse(loginInfoStr) : null;
        setProfile(item);
        setLoginInfo(loginData);
      }
    } catch (err) {
      ErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorageWrapper.removeItem('token');
      await AsyncStorageWrapper.removeItem('publicMode');
      await AsyncStorageWrapper.removeItem('login_info');
      window.location.reload();
    } catch (error) {
      ErrorMessage('Çıxış işlemi başarısız oldu.');
    }
  };

  const handleSupport = () => {
    window.open('https://chat.integracio.ru/7db6cfb178b2bfc6c8e488cc8c53775a/akul.az/az', '_blank');
  };

  const handleBalanceIncrease = () => {
    window.open('https://million.az/services/other/beinaz_yigim', '_blank');
  };

  const handleSettingsPress = () => {
    navigate('settings');
  };

  useEffect(() => {
    fetchingProfileInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--adm-color-background)'
      }}>
        <SpinLoading color='primary' style={{ '--size': '48px' }} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--adm-color-background)'
    }}>
      <NavBar
        back={null}
        right={
          <LogoutOutlined
            style={{ fontSize: 22, color: '#fff' }}
            onClick={handleLogout}
          />
        }
        style={{
          '--height': '50px',
          '--border-bottom': 'none',
          backgroundColor: 'var(--adm-color-primary)',
          color: '#fff'
        }}
      >
        Profil
      </NavBar>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {loginInfo && profile ? (
          <>
            {/* Profile Card */}
            <Card style={{ marginBottom: 12, borderRadius: 12 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: 'var(--adm-color-fill-content)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserOutlined style={{ fontSize: 36, color: 'var(--adm-color-weak)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    color: 'var(--adm-color-primary)',
                    marginBottom: 4
                  }}>
                    {profile.CompanyName}
                  </div>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--adm-color-text)',
                    marginBottom: 2
                  }}>
                    {loginInfo.OwnerName}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--adm-color-weak)'
                  }}>
                    {loginInfo.Login}
                  </div>
                </div>
              </div>
            </Card>

            {/* Balance Card */}
            <Card style={{ marginBottom: 12, borderRadius: 12, textAlign: 'center' }}>
              <div style={{
                fontSize: 14,
                color: 'var(--adm-color-weak)',
                marginBottom: 4
              }}>
                Balans
              </div>
              <div style={{
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--adm-color-primary)'
              }}>
                ₼{loginInfo.Balance}
              </div>
            </Card>

            {/* Options List */}
            <List style={{ borderRadius: 12, overflow: 'hidden' }}>
              <List.Item
                prefix={
                  <CustomerServiceOutlined style={{ fontSize: 22, color: 'var(--adm-color-primary)' }} />
                }
                onClick={handleSupport}
                arrow
              >
                Support
              </List.Item>
              <Divider style={{ margin: 0 }} />
              <List.Item
                prefix={
                  <WalletOutlined style={{ fontSize: 22, color: 'var(--adm-color-primary)' }} />
                }
                onClick={handleBalanceIncrease}
                arrow
              >
                Balans Artımı
              </List.Item>
              <Divider style={{ margin: 0 }} />
              <List.Item
                prefix={
                  <SettingOutlined style={{ fontSize: 22, color: 'var(--adm-color-primary)' }} />
                }
                onClick={handleSettingsPress}
                arrow
              >
                Ayarlar
              </List.Item>
            </List>
          </>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200
          }}>
            <SpinLoading color='primary' />
          </div>
        )}

        {/* Version */}
        <div style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--adm-color-weak)',
          marginTop: 24
        }}>
          Version {packageJson.version}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 24,
          paddingBottom: 20
        }}>
          <Image
            src={logoSource}
            width={60}
            height={60}
            fit='contain'
            style={{ marginBottom: 8 }}
          />
          <span style={{
            fontSize: 13,
            color: 'var(--adm-color-weak)'
          }}>
            From
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--adm-color-primary)'
          }}>
            Bein Systems
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
