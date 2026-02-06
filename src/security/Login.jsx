import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import Input from '../shared/ui/Input'
import Button from '../shared/ui/Button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from 'axios'
import useTheme from '../shared/theme/useTheme'
import ErrorMessage from './../shared/ui/RepllyMessage/ErrorMessage';
import SuccessMessage from './../shared/ui/RepllyMessage/SuccessMessage';
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart';
import api from './../services/api';

const Login = () => {

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
        // Azerbaycan server seçildiğinde, özel URL'i kaldır
        await AsyncStorage.removeItem('apiCustomUrl');
        setCurrentApiServer('Azerbaycan');
        SuccessMessage('Azerbaycan serveri seçildi.');
      } else if (server === 'Rusiya') {
        // Rus server seçildiğinde, özel URL'i kaydet
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

    setIsLoading(true)

    // Mevcut özel API URL'ini korumak için
    const existingApiUrl = await AsyncStorage.getItem('apiCustomUrl');

    // Login için kullanılacak URL'i belirle
    const loginUrl = existingApiUrl
      ? `http://84.201.140.231/proxy/1.0/online/login/send.php` // Rus server için özel URL yapısı
      : 'https://api.akul.az/1.0/online/login/send.php'; // Varsayılan Azerbaycan server URL'i

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
          })
          RNRestart.Restart();
        } else {
          ErrorMessage(response.data.Body);
        }
      }).catch((err) => {
        ErrorMessage(err);
      })
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      ErrorMessage('API çağrısı sırasında bir hata oluştu');
    }
  }

  const renderSavedUserModal = () => (
    <Modal
      visible={showUserModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowUserModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.stable.white }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.stable.black }]}>Qeydiyyatlı istifadəçilər</Text>
            <TouchableOpacity
              onPress={() => setShowUserModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={theme.stable.black} />
            </TouchableOpacity>
          </View>

          {savedUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="person-outline" size={50} color={theme.stable.black} />
              <Text style={[styles.emptyText, { color: theme.stable.black }]}>Qeydiyyatlı istifadəçi tapılmadı</Text>
            </View>
          ) : (
            <FlatList
              data={savedUsers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectSavedUser(item)} style={[styles.userItem, { borderBottomColor: theme.input.grey }]}>
                  <View style={styles.userItemContent}>
                    <View >
                      <Ionicons name="person-circle-outline" size={24} color={theme.stable.black} />
                    </View>
                    <Text style={[styles.userName, { color: theme.stable.black }]}>{item.login}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteSavedUser(item)}>
                    <Ionicons name="trash" size={24} color={theme.stable.black} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              style={styles.userList}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  const renderApiServerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={apiServerModalVisible}
      onRequestClose={() => {
        setApiServerModalVisible(false);
      }}>
      <View style={styles.modalContainer}>
        <View style={[styles.apiModalContent, { backgroundColor: theme.stable.white }]}>
          <Text style={{ fontSize: 18, marginBottom: 20, color: theme.stable.black }}>Server seçin:</Text>
          <TouchableOpacity
            style={[styles.serverButton, currentApiServer === 'Azerbaycan' ? { backgroundColor: theme.pink } : { backgroundColor: theme.primary }]}
            onPress={() => {
              handleSelectApiServer('Azerbaycan');
            }}>
            <Text style={styles.serverButtonText}>Azerbaycan Server</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.serverButton, currentApiServer === 'Rusiya' ? { backgroundColor: theme.pink } : { backgroundColor: theme.primary }]}
            onPress={() => {
              handleSelectApiServer('Rusiya');
            }}>
            <Text style={styles.serverButtonText}>Rusiya Server</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.stable.white }}>
      {renderSavedUserModal()}
      {renderApiServerModal()}

      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: theme.stable.black }]}>BeinAZ</Text>
      </View>

      <Input
        width={'90%'}
        value={login}
        onChange={(txt) => {
          setLogin(txt);
        }}
        placeholder={'Login'}
      />

      <View style={{ margin: 5 }} />

      <Input
        password={true}
        width={'90%'}
        value={password}
        onChange={(txt) => {
          setPassword(txt);
        }}
        placeholder={'Şifrə'}
      />

      <View style={{ margin: 10 }} />

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Ionicons
            name={rememberMe ? 'checkbox' : 'square-outline'}
            size={24}
            color={theme.stable.black}
          />
          <Text style={[styles.rememberMeText, { color: theme.stable.black }]}>Xatırla</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serverSelectButton}
          onPress={() => setApiServerModalVisible(true)}
        >
          <AntDesign name="cloud" size={20} color={theme.stable.black} />
          <Text style={[styles.serverSelectText, { color: theme.stable.black }]}>{currentApiServer}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ margin: 10 }} />

      <Button
        icon={<Ionicons size={15} name='lock-open-outline' />}
        width={'70%'}
        onClick={() => {
          fetchingAuthApi(login, password)
        }}
        isLoading={isLoading}
      >Daxil ol</Button>
    </View>
  )
}

export default Login;

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 30,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
  },
  serverSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  serverSelectText: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 15,
    elevation: 5,
    overflow: 'hidden',
  },
  apiModalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  serverButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  serverButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C8C8C8',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  userList: {
    maxHeight: 300,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C8C8C8',
  },
  userItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    marginLeft: 10,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
