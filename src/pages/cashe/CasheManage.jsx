import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import Line from '../../shared/ui/Line';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';

const CasheManage = ({ route, navigation }) => {

  let { id, name, balance } = route.params;

  let theme = useTheme();

  const [casheData, setCasheData] = useState([]);
  const [cashe, setCashe] = useState(null);
  const [selectedTime, setSelectedTime] = useState(4);

  const [filter, setFilter] = useState(
    {
      pg: 0,
      dr: 1,
      lm: 100,
      sr: "Moment",
    }
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    }
  })

  let fetchingCasheData = async () => {
    let obj = {
      ...filter,
      cashid: id,
      token: await AsyncStorage.getItem('token')
    }
    await api('transactions/history.php', obj).then(res => {
      if (res != null) {
        setCasheData([...res.List]);
        let obj = { ...res };
        delete obj.List;
        setCashe(obj);
      }
    }).catch(err => {
      ErrorMessage(err);
    })
  }

  useEffect(() => {
    fetchingCasheData();
  }, [filter])


  return (
    <View style={styles.container}>
      <Text style={{
        color: theme.black,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold'
      }}>{name}</Text>
      <Text style={{
        textAlign: 'center',
        color: theme.input.grey,
      }}>Üzləşmə aktı</Text>
      <View style={{ margin: 5 }} />
      <Line width={'90%'} />

      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />
      {
        cashe == null ?
          ""
          :
          <DocumentInfo data={[
            {
              title: "Alınıb",
              value: formatPrice(cashe.InSum)
            },
            {
              title: "Verilib",
              value: formatPrice(cashe.OutSum)
            },
            {
              title: "Balans",
              value: formatPrice(balance)
            }
          ]} />
      }

      {
        casheData !== null ?
          casheData[0] ?

            <ScrollView style={{
              width: '100%',
              padding: 10
            }}>

              {
                casheData.map((item, index) => {
                  return (
                    <ListItem
                    notIcon={true}
                      centerText={formatPrice(item.Amount)}
                      endText={item.Moment}
                      index={index + 1}
                      priceText={formatPrice(item.Balance)}
                    />
                  )
                })
              }
            </ScrollView>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={'large'} color={theme.primary} />
            </View>
          :
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontWeight: 'bold',
              color: theme.red
            }}>List boşdur!</Text>
          </View>
      }
    </View>
  )
}

export default CasheManage

