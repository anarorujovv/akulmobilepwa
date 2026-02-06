import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ManageCard from './ManageCard'
import api from '../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorMessage from './RepllyMessage/ErrorMessage'
import useTheme from '../theme/useTheme'
import ListItem from './list/ListItem'
import { formatPrice } from '../../services/formatPrice'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFocusEffect } from '@react-navigation/native'

const DocumentPaymentsCard = ({ target, id, navigation }) => {

  let theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      flexDirection: 'row'
    }
  })

  const [documents, setDocuments] = useState([]);

  let fetchApi = async () => {
    let obj = {
      doctype: target,
      id: id,
      token: await AsyncStorage.getItem("token")
    }
    await api('links/get.php', obj)
      .then(element => {
        if (element != null) {
          if (element.List[0]) {
            setDocuments(element.List);
          } else {
            setDocuments(null)
          }
        }
      })
      .catch(err => {
        ErrorMessage(err)
      })
  }

  useEffect(() => {
    fetchApi();
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (documents[0]) {
        setDocuments([])
      }
      fetchApi();
    }, [])
  )

  return (
    documents != null &&
    <ManageCard
      customPadding={{
        paddingTop: 10
      }}
    >
      <View style={styles.header}>
        <Ionicons size={20} color={theme.grey} name='cash-outline' />
        <Text style={{
          color: theme.grey
        }}>Ödənişlər</Text>
      </View>

      {
        documents.map((element, index) => {
          return (
            <ListItem
              firstText={element.Moment}
              centerText={element.Name}
              priceText={formatPrice(element.Amount)}
              index={index + 1}
              onPress={() => {
                navigation.navigate('payment', {
                  id: element.Id,
                  type: element.DocType,
                  direct: 's',
                })
              }}
            />
          );
        })
      }
    </ManageCard>
  )
}

export default DocumentPaymentsCard