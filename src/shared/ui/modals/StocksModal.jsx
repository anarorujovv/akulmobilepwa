import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';

const StockModal = ({
  modalVisible,
  setModalVisible,
  setProduct
}) => {

  const theme = useTheme();

  const [stocks, setStocks] = useState([]);

  const fetchingStocks = async () => {
    await api('stocks/get.php', {
      token: await AsyncStorage.getItem('token'),
    }).then((element) => {
      if (element != null) {
        if (element.List[0]) {
          setStocks([...element.List]);
        } else {
          setStocks(null)
        }
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  const renderItem = ({ item, index }) => {
    return (
      <>
        <Pressable onPress={() => {
          setProduct(rel => ({ ...rel, ['StockName']: item.Name }))
          setProduct(rel => ({ ...rel, ['StockId']: item.Id }));
          setModalVisible(false);
        }} pressEffectColor={theme.input.grey} style={{
          width: '100%',
          height: 55,
          paddingLeft: 20,
          justifyContent: 'center',
        }}>
          <Text style={{
            color: theme.black,
            fontSize: 13
          }}>{item.Name}</Text>
        </Pressable>
        <Line width={'90%'} />
      </>
    )
  }

  useEffect(() => {
    if (modalVisible && stocks != null && !stocks[0]) {
      fetchingStocks();
    }

    if (!modalVisible) {
      setStocks([])
    }
  }, [modalVisible])

  useEffect(() => {
    fetchingStocks();
  }, [])

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      width={'100%'}
      height={"100%"}
    >
      {
        stocks == null ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              fontSize: 16,
              color: theme.primary
            }}>Məlumat tapılmadı...</Text>
          </View>
          :
          <View style={{
            width: '100%',
            height: '100%'
          }}>
            {
              stocks[0] ?
                <FlatList
                  data={stocks}
                  renderItem={renderItem}
                />
                :
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <ActivityIndicator size={40} color={theme.primary} />
                </View>
            }
          </View>
      }
    </MyModal>
  )
}

export default StockModal

const styles = StyleSheet.create({})