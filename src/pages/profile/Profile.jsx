import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../shared/theme/useTheme';
import { Pressable } from '@react-native-material/core';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import RNRestart from 'react-native-restart';
import packageJson from '../../../package.json';

const ProfileScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,  // Using theme background color
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
    },
    exitIcon: {
      marginRight: 16,
      padding: 8,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 24,
    },
    avatarIcon: {
      marginRight: 16,
    },
    userInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.primary,  // Using theme's primary color
      marginBottom: 4,
    },
    userName: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.black,  // Using theme's black for text
      marginBottom: 2,
    },
    email: {
      fontSize: 14,
      color: theme.grey,  // Using theme's grey for email text
    },
    separator: {
      height: 1,
      backgroundColor: theme.whiteGrey,  // Using theme's whiteGrey for separator color
    },
    balanceSection: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    balanceTitle: {
      fontSize: 16,
      color: theme.grey,  // Using theme's grey for balance title
      marginBottom: 1,
    },
    balanceValue: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.primary,  // Using theme's primary color for balance value
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    optionIcon: {
      marginRight: 16,
    },
    optionText: {
      fontSize: 16,
      color: theme.black,  // Using theme's black for option text
    },
    versionText: {
      textAlign: 'center',
      fontSize: 14,
      color: theme.grey,  // Using theme's grey for version text
      marginTop: 20,
    },
    footerContainer: {
      alignItems: 'center',
      marginTop: 'auto',
      paddingBottom: 20,
    },
    logoImage: {
      width: 60,
      height: 60,
      marginBottom: 5,
    },
    companyText: {
      fontSize: 14,
      color: theme.grey,
      fontWeight: '500',
    }
  });

  // Fetch profile and login information

  const fetchingProfileInfo = async () => {
    await api('company/get.php', {
      token: await AsyncStorage.getItem("token")
    })
      .then(async item => {
        if (item != null) {
          const data = item;
          const loginData = JSON.parse(await AsyncStorage.getItem("login_info"));
          setProfile(data);
          setLoginInfo(loginData);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  // Log out function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("publicMode");
      await AsyncStorage.removeItem("login_info");
      RNRestart.restart();
    } catch (error) {
      ErrorMessage("Çıkış işlemi başarısız oldu.");
    }
  };

  const handleSupport = () => {
    Linking.openURL('https://chat.integracio.ru/7db6cfb178b2bfc6c8e488cc8c53775a/akul.az/az');
  }

  useEffect(() => {
    fetchingProfileInfo();
  }, []);


  const handleBalanceIncrease = () => {
    Linking.openURL("https://million.az/services/other/beinaz_yigim")
      .catch(err => ErrorMessage("Bağlantı açılamadı."));
  };

  const handleSettingsPress = () => {
    navigation.navigate("settings");
  };



  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.primary }}>Profil</Text>
        <Pressable pressEffectColor={theme.grey} onPress={handleLogout} style={styles.exitIcon}>
          <Icon name="exit-to-app" size={28} color={theme.primary} />
        </Pressable>
      </View>

      {
        loginInfo == null ?
          "" :
          profile != null ?
            <>
              <View style={styles.profileSection}>
                <Icon name="account-circle" size={80} color={theme.input.grey} style={styles.avatarIcon} />

                <View style={styles.userInfo}>
                  <Text style={styles.companyName}>{profile.CompanyName}</Text>
                  <Text style={styles.userName}>{loginInfo.OwnerName}</Text>
                  <Text style={styles.email}>{loginInfo.Login}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.balanceSection}>
                <Text style={styles.balanceTitle}>Balans</Text>
                <Text style={styles.balanceValue}>₼{loginInfo.Balance}</Text>
              </View>

              <View style={styles.separator} />

              <Pressable onPress={handleSupport} pressEffectColor={theme.grey} style={styles.optionItem}>
                <Icon name="support-agent" size={24} color={theme.primary} style={styles.optionIcon} />
                <Text style={styles.optionText}>Support</Text>
              </Pressable>

              <View style={styles.separator} />

              <Pressable onPress={handleBalanceIncrease} pressEffectColor={theme.grey} style={styles.optionItem}>
                <Icon name="account-balance-wallet" size={24} color={theme.primary} style={styles.optionIcon} />
                <Text style={styles.optionText}>Balans Artımı</Text>
              </Pressable>

              <View style={styles.separator} />

                  <Pressable onPress={handleSettingsPress} pressEffectColor={theme.grey} style={styles.optionItem}>
                    <Icon name="settings" size={24} color={theme.primary} style={styles.optionIcon} />
                    <Text style={styles.optionText}>Ayarlar</Text>
                  </Pressable>

            </>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={50} color={theme.primary} />
            </View>
      }

      <Text style={styles.versionText}>Version {packageJson.version}</Text>

      <View style={styles.footerContainer}>
        <Image 
          source={require('../../images/logo_only.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <Text style={styles.companyText}>From</Text>
        <Text style={[styles.companyText, {fontWeight: '700', color: theme.primary}]}>Bein Systems</Text>
      </View>

    </View>
  );
};

export default ProfileScreen;
