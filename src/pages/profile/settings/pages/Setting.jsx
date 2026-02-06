import { StyleSheet, Text, View, Modal, ActivityIndicator, Switch, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import useTheme from '../../../../shared/theme/useTheme';
import ListPagesHeader from '../../../../shared/ui/ListPagesHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessMessage from '../../../../shared/ui/RepllyMessage/SuccessMessage';
import { Pressable } from '@react-native-material/core';
import api from '../../../../services/api';
import ErrorMessage from '../../../../shared/ui/RepllyMessage/ErrorMessage';
import RNRestart from 'react-native-restart';
import useGlobalStore from '../../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../../services/permissionVerification';

const Setting = ({ route, navigation }) => {
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

    loadApiServerStatus();
  }, []);

  useEffect(() => {
    const loadLocalPermissions = async () => {
      try {
        const stored = await AsyncStorage.getItem('local_per');
        const permissions = stored ? JSON.parse(stored) : {
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
            customerOrder: {
              listPrice: true,
              positionPrice: true,
              positionModalPrice: true,
              customerDebt: true
            }
          }
        };
        setLocalPerms(permissions);
      } catch (error) {
        ErrorMessage('İcazələr yüklənərkən xəta baş verdi');
      }
    };
    loadLocalPermissions();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,  // Background color based on theme
      paddingHorizontal: 0,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    optionIcon: {
      marginRight: 16,
    },
    optionText: {
      fontSize: 16,
      color: theme.black,  // Option text color based on theme
    },
    separator: {
      height: 1,
      backgroundColor: theme.whiteGrey,  // Separator color based on theme
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.modalBackground,  // Replaced with theme modal background
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: theme.stable.white,  // Modal background color based on theme
      borderRadius: 10,
      alignItems: 'center',
      elevation: 5,  // Shadow for Android
      shadowColor: '#000',  // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    modalButton: {
      width: '100%',  // Ensures button width is consistent
      padding: 15,
      backgroundColor: theme.primary,  // Button background color based on theme
      borderRadius: 5,
      marginVertical: 10,  // Spacing between buttons
      alignItems: 'center',  // Centers the button text
    },
    modalButtonText: {
      color: theme.stable.white,  // Button text color based on theme
      fontSize: 16,
      textAlign: 'center',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    permissionText: {
      fontSize: 14,
      color: theme.black,
    },
  });

  const handleUpdatePermission = async () => {
    setPermissionLoadingModal(true);
    await api('permissions/get.php', {
      token: await AsyncStorage.getItem('token')
    }).then(async element => {
      if (element != null) {
        let permissions = element.Permissions;
        await AsyncStorage.setItem('ownerId', element.OwnerId);
        await AsyncStorage.setItem("depId", element.DepartmentId);
        await AsyncStorage.setItem('perlist', JSON.stringify(permissions));
        RNRestart.restart();
      }
    }).catch(err => {
      ErrorMessage(err)
    })
    setPermissionLoadingModal(false);
  }

  const handleSelectApiServer = async (server) => {
    try {
      if (server === 'Azerbaycan') {
        // Azerbaycan server seçildiğinde, özel URL'i kaldır
        await AsyncStorage.removeItem('apiCustomUrl');
        setCurrentApiServer('Azerbaycan');
        SuccessMessage('Azerbaycan serveri seçildi. Sistem yeniden başlatılmayacak.');
      } else if (server === 'Rusiya') {
        // Rus server seçildiğinde, özel URL'i kaydet
        await AsyncStorage.setItem('apiCustomUrl', 'http://84.201.140.231/proxy/1.0/online/controllers/');
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
    newPerms.demands[module][permission] = !newPerms.demands[module][permission];
    setLocalPerms(newPerms);

    // Save to AsyncStorage and global state
    await AsyncStorage.setItem('local_per', JSON.stringify(newPerms));
    setLocal(newPerms);
    SuccessMessage('İcazələr yeniləndi');
  };

  let data = [
    {
      label: "Xərc-Maddələri",
      name: "spenditems",
      icon: <MaterialCommunityIcons name='sitemap' size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => {
        navigation.navigate("spend-items");
      },
    },
    {
      label: "Əsas Ölçü Vahidi",
      name: "defaultunit",
      icon: <MaterialIcons name='format-list-numbered-rtl' size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => {
        setModalVisible(true); // Open the modal
      }
    },
    {
      label: 'İcazələr',
      name: 'permission',
      icon: <MaterialCommunityIcons name='security-network' size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: handleUpdatePermission
    },
    {
      label: `API Server (${currentApiServer})`,
      name: 'apiserver',
      icon: <AntDesign name='cloud' size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => {
        setApiServerModalVisible(true);
      }
    },
    permission_ver(permissions, 'settingPage', 'C') && {
      label: "Lokal İcazələr",
      name: "localpermissions",
      icon: <MaterialCommunityIcons name='shield-lock' size={24} color={theme.primary} style={styles.optionIcon} />,
      onPress: () => setLocalPermModal(true)
    }

  ];

  const handleSelectDefaultUnit = async (value) => {
    await AsyncStorage.setItem("defaultUnit", String(value));
    setModalVisible(false);
    SuccessMessage(`${value == 0 ? 'Əsas' : "Digər"} ölçü vahidi seçildi`)
  }

  return (
    <>
      <ListPagesHeader
        header={'Ayarlar'}
      />
      <View style={styles.container}>
        {
          data.map((element, index) => {
            return (
              <View key={index}>
                <Pressable onPress={element.onPress} pressEffectColor={theme.grey} style={styles.optionItem}>
                  {element.icon}
                  <Text style={styles.optionText}>{element.label}</Text>
                </Pressable>
                <View style={styles.separator} />
              </View>
            )
          })
        }
      </View>

      {/* Ölçü Birimi Modal*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false); // Close the modal
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Seçim edin:</Text>
            <Pressable style={styles.modalButton} onPress={() => {
              handleSelectDefaultUnit(0);
            }}>
              <Text style={styles.modalButtonText}>Əsas Ölçü</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => {
              handleSelectDefaultUnit(1)
            }}>
              <Text style={styles.modalButtonText}>Digər</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* API Server Seçim Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={apiServerModalVisible}
        onRequestClose={() => {
          setApiServerModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Server seçin:</Text>
            <Pressable style={[styles.modalButton, currentApiServer === 'Azerbaycan' ? { backgroundColor: theme.pink } : {}]} onPress={() => {
              handleSelectApiServer('Azerbaycan');
            }}>
              <Text style={styles.modalButtonText}>Azerbaycan Server</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, currentApiServer === 'Rusiya' ? { backgroundColor: theme.pink } : {}]} onPress={() => {
              handleSelectApiServer('Rusiya');
            }}>
              <Text style={styles.modalButtonText}>Rusiya Server</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={permissionLoadingModal}
        onRequestClose={() => {
          setPermissionLoadingModal(false); // Close the modal
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size={40} color={theme.primary} />
            <Text style={{ textAlign: 'center', color: theme.primary }}>İcazələr Yenilənir...</Text>
          </View>
        </View>
      </Modal>

      {/* Local Permissions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={localPermModal}
        onRequestClose={() => setLocalPermModal(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: '90%', maxHeight: '80%' }]}>
            <Text style={{ fontSize: 18, marginBottom: 20, color: theme.black }}>Lokal İcazələr</Text>
            <ScrollView style={{ width: '100%' }}>
              {localPerms && Object.keys(localPerms.demands).map((module) => (
                <View key={module} style={styles.permissionSection}>
                  <Text style={styles.permissionHeader}>
                    {module === 'demand' ? 'Satış' :
                      module === 'demandReturn' ? 'Satış Qaytarma' :
                        module === 'demandToPayment' ? 'Satışdan ödəniş' :
                          module === 'stockBalance' ? 'Anbar qalığı' : module}
                  </Text>
                  {Object.entries(localPerms.demands[module]).map(([perm, value]) => (
                    <View key={perm} style={styles.permissionItem}>
                      <Text style={styles.permissionText}>
                        {perm === 'listPrice' ? 'Siyahı Qiyməti' :
                          perm === 'positionPrice' ? 'Position Qiyməti' :
                            perm === 'positionModalPrice' ? 'Position Modal Qiyməti' :
                              perm === 'customerDebt' ? 'Müştəri Borcu' :
                                perm === 'sum' ? 'Cəmi' :
                                  perm === 'supplyBalance' ? 'Alış' :
                                    perm === 'allSum' ? 'List cəmlər' :
                                      perm === 'date' ? 'Tarix' :
                                        perm}
                      </Text>
                      <Switch
                        value={value}
                        onValueChange={() => handleTogglePermission(module, module, perm)}
                        trackColor={{ false: theme.grey, true: theme.primary }}
                      />
                    </View>
                  ))}
                </View>
              ))}

            </ScrollView>
            <Pressable
              style={styles.modalButton}
              onPress={() => setLocalPermModal(false)}>
              <Text style={styles.modalButtonText}>Bağla</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default Setting;
