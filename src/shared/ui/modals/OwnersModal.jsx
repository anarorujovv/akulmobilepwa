import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';
import Input from '../Input';
import contains from '../../../services/contains';

const OwnerModal = ({
  state,
  setState
}) => {
  
  const theme = useTheme();

  const [infos, setInfos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchingInfos = async () => {
    await api('owners/get.php', {
      token: await AsyncStorage.getItem('token'),
    }).then((element) => {
      if (element != null) {
        if (element.List[0]) {
          setInfos([...element.List]);
        } else {
          setInfos(null)
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
          setState(rel => ({ ...rel, ['OwnerName']: item.Name }))
          setState(rel => ({ ...rel, ['OwnerId']: item.Id }));
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
    if (modalVisible && infos != null && !infos[0]) {
      fetchingInfos();
    }

  }, [modalVisible])

  useEffect(() => {
    fetchingInfos();
  }, [])

  return (
    <>
      {
        infos[0] ?
          <Pressable onPress={() => setModalVisible(true)}>
            <Input
              disabled={true}
              type={'string'}
              width={'100%'}
              value={contains(infos,state.OwnerId) == null ? "" :  contains(infos,state.OwnerId).Name}
              placeholder={'Cavabdeh'}
            />
          </Pressable>
          :
          <View style={{
            width: '100%',
            height: 55,
            justifyContent: 'center',
          }}>
            <ActivityIndicator size={30} color={theme.primary} />
          </View>
      }
      <MyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        width={'100%'}
        height={"100%"}
      >
        {
          infos == null ?
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
                infos[0] ?
                  <FlatList
                    data={infos}
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
    </>
  )
}

export default OwnerModal

const styles = StyleSheet.create({})