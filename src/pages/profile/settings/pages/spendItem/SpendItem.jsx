import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../../../../shared/theme/useTheme'
import api from '../../../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../../../../shared/ui/RepllyMessage/ErrorMessage';
import ListItem from '../../../../../shared/ui/list/ListItem';
import ListPagesHeader from '../../../../../shared/ui/ListPagesHeader';
import FabButton from '../../../../../shared/ui/FabButton';
import Input from '../../../../../shared/ui/Input';
import Button from '../../../../../shared/ui/Button';
import SuccessMessage from '../../../../../shared/ui/RepllyMessage/SuccessMessage';
import prompt from '../../../../../services/prompt';

const SpendItem = () => {

  let theme = useTheme();
  const styles = StyleSheet.create({
    separator: {
      height: 1,
      backgroundColor: theme.whiteGrey,  // Using theme's whiteGrey for separator color
    },
    deleteButton: {
      backgroundColor: theme.red,  // Using theme's red for delete button
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
    },
    deleteText: {
      color: theme.stable.white,  // Using theme's stable white for delete text
      fontWeight: 'bold',
      fontSize: 16,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(1,1,1,0.2)',  // Using theme's black as background for modal
    },
    modalView: {
      width: '100%',
      backgroundColor: theme.stable.white,  // Using theme's stable white for modal background
      borderRadius: 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      minHeight: 200,
    },
    modalHeader: {
      flexDirection: 'row',
      gap: 10,
      padding: 15,
      width: '100%',
      alignItems: 'center',
    },
    itemContainer: {
      width: '100%',
      paddingLeft: 50,
      height: 40,
      justifyContent: 'center',
    },
    itemText: {
      color: theme.black,  // Using theme's black for text color
      fontSize: 18,
    }
  });

  const [productPurchase, setProductPurchase] = useState([]);
  const [costs, setCosts] = useState([]);

  const [manageModal, setManageModal] = useState(false);
  const [item, setItem] = useState(null);


  let fetchingSpendItem = async () => {
    await api('spenditems/get.php', {
      token: await AsyncStorage.getItem('token')
    })
      .then((element) => {
        if (element != null) {
          let list = [...element.List];
          let productPurchaseList = list.filter(element => element.Target == 0);
          let costsList = list.filter(element => element.Target == 1);
          setProductPurchase(productPurchaseList);
          setCosts(costsList);
        }
      })
      .catch((err) => {
        ErrorMessage(err)
      })
  }

  const handleSaveButton = async () => {
    let obj = {
      name: item.Name,
      id: item.Id,
      token: await AsyncStorage.getItem("token")
    }

    await api('spenditems/put.php', obj)
      .then((element) => {
        if (element != null) {
          success();
        }
      })
      .catch((err) => {
        ErrorMessage(err)
      })
  }

  const handleDelete = async (item) => {

    prompt('Silməyə əminsiniz ?', async () => {
      await api('spenditems/del.php?id=' + item.Id, {
        token: await AsyncStorage.getItem('token')
      })
        .then((element) => {
          if (element != null) {
            success();
          }
        }).catch(err => {
          ErrorMessage(err)
        })
    })


  }

  const success = () => {
    SuccessMessage("Əməliyyat uğurla icra olundu!")
    setManageModal(false);
    setProductPurchase([]);
    setCosts([]);
    fetchingSpendItem();
  }

  useEffect(() => {
    fetchingSpendItem();
  }, [])

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.bg,
    }}>

      <View style={{
        width: '100%',
        height: '50%',
      }}>
        <ListPagesHeader
          header={'Məhsul alışı'}
        />
        <ScrollView>
          {
            productPurchase[0] ?
              productPurchase.map((item, index) => {
                return (
                  <>
                    <ListItem
                      onLongPress={() => {
                        handleDelete(item)
                      }}
                      firstText={item.Name}
                      onPress={() => {
                        setItem(item);
                        setManageModal(true)
                      }}
                      index={index + 1}
                    />
                    <View style={styles.separator} />
                  </>
                )
              })
              :
              <View style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 50
              }}>
                <ActivityIndicator size={40} color={theme.primary} />
              </View>
          }
        </ScrollView>
      </View>

      <View style={{
        width: '100%',
        height: '50%',
      }}>
        <ListPagesHeader
          header={'Xərclər'}
        />
        <ScrollView>
          {
            costs[0] ?
              costs.map((item, index) => {
                return (
                  <>
                    <ListItem
                    index={index + 1}
                      onLongPress={() => {
                        handleDelete(item)
                      }}
                      firstText={item.Name}
                      onPress={() => {
                        setItem(item);
                        setManageModal(true)
                      }}
                    />
                    <View style={styles.separator} />
                  </>
                )
              })
              :
              <View style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 50
              }}>
                <ActivityIndicator size={40} color={theme.primary} />
              </View>
          }
        </ScrollView>
      </View>

      <FabButton
        onPress={() => {
          setManageModal(true);
          setItem({
            Name: "",
            Id: ""
          })
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={manageModal}
        onRequestClose={() => {
          setManageModal(!manageModal);
        }}>

        <TouchableOpacity activeOpacity={1} onPress={() => {
          setManageModal(false)
        }} style={styles.centeredView}>
          <TouchableOpacity onPress={() => {
          }} activeOpacity={1} style={styles.modalView}>
            {
              item != null ?
                <View style={{
                  width: '100%',
                  padding: 10
                }}>
                  <Input
                    value={item.Name}
                    onChange={(e) => {
                      setItem(rel => ({ ...rel, ['Name']: e }));
                    }}
                    placeholder={'Ad'}
                    width={'100%'}
                  />
                  <View style={{ margin: 10 }} />
                  <Button
                    width={'100%'}
                    isLoading={false}
                    onClick={handleSaveButton}
                  >
                    Yadda Saxla
                  </Button>
                </View>
                :
                ""
            }
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default SpendItem
