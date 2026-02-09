import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdExitToApp, MdAccountCircle, MdSupportAgent, MdAccountBalanceWallet, MdSettings } from 'react-icons/md';
import useTheme from '../../shared/theme/useTheme';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import packageJson from '../../../package.json';

const ProfileScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.bg,
      padding: 10,
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary
    },
    exitIcon: {
      marginRight: 16,
      padding: 8,
      cursor: 'pointer'
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 24,
    },
    avatarIcon: {
      marginRight: 16,
    },
    userInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    companyName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.primary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.black,
      marginBottom: 2,
    },
    email: {
      fontSize: 14,
      color: theme.grey,
    },
    separator: {
      height: 1,
      backgroundColor: theme.whiteGrey,
      width: '100%',
      margin: '10px 0'
    },
    balanceSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingVertical: 16,
    },
    balanceTitle: {
      fontSize: 16,
      color: theme.grey,
      marginBottom: 1,
    },
    balanceValue: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.primary,
    },
    optionItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      cursor: 'pointer'
    },
    optionIcon: {
      marginRight: 16,
    },
    optionText: {
      fontSize: 16,
      color: theme.black,
    },
    versionText: {
      textAlign: 'center',
      fontSize: 14,
      color: theme.grey,
      marginTop: 20,
    },
    footerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 'auto',
      paddingBottom: 20,
    },
    logoImage: {
      width: 60,
      height: 60,
      marginBottom: 5,
      objectFit: 'contain'
    },
    companyText: {
      fontSize: 14,
      color: theme.grey,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  const fetchingProfileInfo = async () => {
    await api('company/get.php', {
      token: await AsyncStorageWrapper.getItem("token")
    })
      .then(async item => {
        if (item != null) {
          const data = item;
          const loginInfoStr = await AsyncStorageWrapper.getItem("login_info");
          const loginData = loginInfoStr ? JSON.parse(loginInfoStr) : null;
          setProfile(data);
          setLoginInfo(loginData);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorageWrapper.removeItem("token");
      await AsyncStorageWrapper.removeItem("publicMode");
      await AsyncStorageWrapper.removeItem("login_info");
      window.location.reload();
    } catch (error) {
      ErrorMessage("Çıxış işlemi başarısız oldu.");
    }
  };

  const handleSupport = () => {
    window.open('https://chat.integracio.ru/7db6cfb178b2bfc6c8e488cc8c53775a/akul.az/az', '_blank');
  };

  useEffect(() => {
    fetchingProfileInfo();
  }, []);

  const handleBalanceIncrease = () => {
    window.open("https://million.az/services/other/beinaz_yigim", "_blank");
  };

  const handleSettingsPress = () => {
    navigate("settings");
  };

  // Use a placeholder logo if import fails or verify path. 
  // Since I cannot verify generic assets easily, I will use a simple img tag with relative path 
  // or assume the build system handles it. 
  // If the image is in src/images, in React it depends on how it's imported.
  // I will use require logic if using Webpack/Vite compatible bundler or just text if fail.
  // For now I'll use a placeholder or try to mimic the import.
  // React Native `require` works in Webpack.
  const logoSource = require('../../images/logo_only.png');

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <span style={styles.headerText}>Profil</span>
        <div onClick={handleLogout} style={styles.exitIcon}>
          <MdExitToApp size={28} color={theme.primary} />
        </div>
      </div>

      {loginInfo == null ? (
        ""
      ) : profile != null ? (
        <>
          <div style={styles.profileSection}>
            <MdAccountCircle size={80} color={theme.input.grey} style={styles.avatarIcon} />

            <div style={styles.userInfo}>
              <span style={styles.companyName}>{profile.CompanyName}</span>
              <span style={styles.userName}>{loginInfo.OwnerName}</span>
              <span style={styles.email}>{loginInfo.Login}</span>
            </div>
          </div>

          <div style={styles.separator} />

          <div style={styles.balanceSection}>
            <span style={styles.balanceTitle}>Balans</span>
            <span style={styles.balanceValue}>₼{loginInfo.Balance}</span>
          </div>

          <div style={styles.separator} />

          <div onClick={handleSupport} style={styles.optionItem}>
            <MdSupportAgent size={24} color={theme.primary} style={styles.optionIcon} />
            <span style={styles.optionText}>Support</span>
          </div>

          <div style={styles.separator} />

          <div onClick={handleBalanceIncrease} style={styles.optionItem}>
            <MdAccountBalanceWallet size={24} color={theme.primary} style={styles.optionIcon} />
            <span style={styles.optionText}>Balans Artımı</span>
          </div>

          <div style={styles.separator} />

          <div onClick={handleSettingsPress} style={styles.optionItem}>
            <MdSettings size={24} color={theme.primary} style={styles.optionIcon} />
            <span style={styles.optionText}>Ayarlar</span>
          </div>

        </>
      ) : (
        <div style={styles.loadingContainer}>
          <div className="spinner"></div>
        </div>
      )}

      <div style={styles.versionText}>Version {packageJson.version}</div>

      <div style={styles.footerContainer}>
        <img src={logoSource} style={styles.logoImage} alt="Logo" />
        <span style={styles.companyText}>From</span>
        <span style={{ ...styles.companyText, fontWeight: '700', color: theme.primary }}>Bein Systems</span>
      </div>

    </div>
  );
};

export default ProfileScreen;
