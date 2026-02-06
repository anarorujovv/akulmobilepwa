import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import CardItem from '../../shared/ui/list/CardItem';
import { Pressable } from '@react-native-material/core';

const ShiftList = ({navigation}) => {

  let theme = useTheme();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({
    dr: 1,
    lm: 100,
    pg: 0
  })

  const fetchingData = async () => {
    let obj = {
      ...filter,
      token: await AsyncStorage.getItem('token')
    }
    await api('shifts/get.php', obj)
      .then(element => {
        if (element != null) {
          setList(element.List)
        }
      })
      .catch(err => {
        ErrorMessage(err)
      })
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
      onPress={() => {
        navigation.navigate('shift-manage',{
          id:item.Id
        })
      }}
      >
        <CardItem
          title={item.SalePointName}
          items={[
            {
              key: 'Satus',
              value: item.Status == 1 ? <Text style={{
                color: theme.green
              }}>Açıqdır</Text> : 'Bağlıdır'
            },
            {
              key: 'Növbəni açıb',
              value: item.OpenOwnerName
            },
            {
              key: 'Növbəni bağlayıb',
              value: item.CloseOwnerName
            },
            {
              key: 'Açılma tarixi',
              value: item.OpenMoment
            },
            {
              key: 'Bağlanma tarixi',
              value: item.CloseMoment
            },
          ]}
        />
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    fetchingData();
  }, [])

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.bg,
      padding: 10
    }}>
      <FlatList
        data={list}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50
          }}>
            {list === null ? (
              <ActivityIndicator size={30} color={theme.primary} />
            ) : (
              <Text style={{ color: theme.text }}>List boşdur</Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

export default ShiftList

const styles = StyleSheet.create({})