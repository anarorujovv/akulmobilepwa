import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import {ActivityIndicator, Pressable} from '@react-native-material/core';
import Input from '../Input';
import contains from '../../../services/contains';
import {formatPrice} from '../../../services/formatPrice';

const CashesModal = ({
  document,
  setDocument,
  type,
  returnChanged,
  selectedType,
}) => {
  const theme = useTheme();

  const [cashs, setCashs] = useState([]);
  const [cashModal, setCashModal] = useState(false);

  let obj = {
    payment: 'cash',
    invoice: 'noncash',
  };

  const fetchingCashes = async () => {
    await api('cashes/get.php', {
      token: await AsyncStorage.getItem('token'),
    })
      .then(element => {
        if (element != null) {
          if (element.List[0]) {
            setCashs([...element.List]);
          } else {
            setCashs(null);
          }
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <Pressable
          onPress={() => {
            setDocument(rel => ({...rel, ['CashName']: item.Name}));
            setDocument(rel => ({...rel, ['CashId']: item.Id}));
            setCashModal(false);
            if (returnChanged) {
              returnChanged();
            }

            if (selectedType != undefined) {
              selectedType(item);
            }
          }}
          pressEffectColor={theme.input.grey}
          style={{
            width: '100%',
            height: 55,
            paddingLeft: 20,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.black,
              fontSize: 13,
            }}>
            {item.Name}
          </Text>
        </Pressable>
        <Line width={'90%'} />
      </>
    );
  };

  useEffect(() => {
    if (cashModal && cashs != null && !cashs[0]) {
      fetchingCashes();
    }
  }, [cashModal]);

  useEffect(() => {
    fetchingCashes();
  }, []);

  return (
    <>
      {cashs[0] ? (
        <Pressable
          style={{
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => {
            setCashModal(true);
          }}>
          <Input
            isRequired={true}
            width={'70%'}
            disabled={true}
            value={
              contains(cashs, document.CashId) == null
                ? ''
                : contains(cashs, document.CashId).Name
            }
            placeholder={'Hesab'}
          />
          {contains(cashs, document.CashId) == null ? (
            ''
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '70%',
              }}>
              <Text style={{fontSize: 12, color: theme.orange}}>Balans</Text>
              <Text
                style={{
                  fontSize: 12,
                  color:
                    formatPrice(contains(cashs, document.CashId).Balance) >= 0
                      ? theme.black
                      : theme.orange,
                }}>
                {formatPrice(contains(cashs, document.CashId).Balance)} ₼
              </Text>
            </View>
          )}
        </Pressable>
      ) : (
        <View
          style={{
            width: '100%',
            height: 55,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={30} color={theme.primary} />
        </View>
      )}
      <MyModal
        modalVisible={cashModal}
        setModalVisible={setCashModal}
        width={'100%'}>
        {cashs == null ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                color: theme.primary,
              }}>
              Məlumat tapılmadı...
            </Text>
          </View>
        ) : cashs[0] ? (
          <FlatList data={cashs} renderItem={renderItem} />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={40} color={theme.primary} />
          </View>
        )}
      </MyModal>
    </>
  );
};

export default CashesModal;

const styles = StyleSheet.create({});
