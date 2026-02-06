import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ManageCard from './ManageCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '../theme/useTheme';
import Button from './Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import ListItem from './list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import { useFocusEffect } from '@react-navigation/native';
import MyModal from './MyModal';
import ErrorMessage from './RepllyMessage/ErrorMessage';

const ReleatedDocuments = ({ document, selection, payment, navigation, shouldDisable, onSubmit, hasUnsavedChanged, onClickItem }) => {


  let theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      flexDirection: 'row',
    },
    modalContent: {
      flex: 1,
      gap: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:theme.whiteGrey,
      borderRadius:5
    },
    optionButton: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 5,
      width: '80%',
      alignItems: 'center',
    },
    optionText: {
      color: theme.primary,
      fontWeight: 'bold',
    },
  });

  

  const [releatedDocuments, setReleatedDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiReleatedDocuments = async () => {

    if (document.Id) {
      let obj = {
        doctype: document.target,
        id: document.Id,
        token: await AsyncStorage.getItem("token"),
      };

      await api('links/get.php', obj)
        .then(element => {
          if (element != null) {
            if (element.List[0]) {
              setReleatedDocuments(element.List);
            } else {
              setReleatedDocuments(null);
            }
          }
        })
        .catch(err => {
          ErrorMessage(err);
        });
    } else {
      setReleatedDocuments(null);
    }
  };

  const handlePayment = (documentLastId) => {
    let params = {
      id: null,
      type: "payment",
      direct: payment,
      routeByDocument: { ...document, Id: documentLastId }
    }
    navigation.navigate('payment', params);
  }

  const click = async (type, clickFunction) => {
    setIsLoading(true)

    let id = null;

    if (!hasUnsavedChanged) {
      if (document.Id != undefined) {
        id = document.Id;
      } else {
        ErrorMessage("Boş sənədə əlaqəli sənət yaradmaq olmaz!")
      }
    } else {
      id = await onSubmit();
    }

    if (id) {
      setModalVisible(false)
      if (type == 'pay') {
        handlePayment(id);
      } else {
        clickFunction(id);
      }
    }
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      if (releatedDocuments == null || releatedDocuments[0]) {
        setReleatedDocuments([]);
      }
      fetchApiReleatedDocuments();
    }, [])
  );


  return (
    <>
      {(
        <ManageCard
          customPadding={{
            paddingTop: 10,
            paddingBottom: 10,
          }}>

          <View style={styles.header}>
            <Ionicons size={20} color={theme.grey} name='documents' />
            <Text style={{ color: theme.grey }}>Əlaqəli sənədlər</Text>
          </View>

          {
            releatedDocuments == null ?
              ""
              :
              releatedDocuments[0] ? (
                releatedDocuments.map((element, index) => (
                  <ListItem
                    key={index}
                    firstText={element.Moment}
                    centerText={element.Name}
                    priceText={formatPrice(element.Amount)}
                    index={index + 1}
                    onPress={() => {
                      onClickItem(element);
                    }}
                  />
                ))
              ) : (
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <ActivityIndicator size={30} color={theme.primary} />
                </View>
              )}

          {
            !shouldDisable &&
            <View style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
              marginBottom: 30,
              marginTop: 10,
            }}>
              <Button
                onClick={() => {
                  setModalVisible(true);
                }}
                width={'70%'}
              >
                Sənəd yarat
              </Button>
            </View>
          }
        </ManageCard>
      )}

      <MyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        width={300}
        height={150}
        center
      >
        <View style={styles.modalContent}>
          {
            !isLoading ?
              <>
                {
                  payment &&
                  <TouchableOpacity style={styles.optionButton} onPress={() => {
                    click('pay');
                  }}>
                    <Text style={styles.optionText}>Ödəniş</Text>
                  </TouchableOpacity>
                }

                {selection != undefined &&
                  selection.map((element, index) => {
                    return (
                      <TouchableOpacity style={styles.optionButton} onPress={() => {
                        click('custom', element.onClick);
                      }}>
                        <Text style={styles.optionText}>{element.Text}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </>
              :
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ActivityIndicator size={30} color={theme.primary} />
              </View>
          }
        </View>
      </MyModal>
    </>
  );
};

export default ReleatedDocuments;
