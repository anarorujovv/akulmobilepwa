import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import useTheme from '../../shared/theme/useTheme'
import translateProductStockTerm from './../../services/report/translateProductStockTerm';
import { formatPrice } from '../../services/formatPrice'
import MyPagination from '../../shared/ui/MyPagination'
import Line from './../../shared/ui/Line';
import ListItem from '../../shared/ui/list/ListItem'
import DateRangePicker from '../../shared/ui/DateRangePicker'
import moment from 'moment'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import DocumentTimes from '../../shared/ui/DocumentTimes'
import useGlobalStore from '../../shared/data/zustand/useGlobalStore'

const StockBalanceManage = ({ route, params }) => {

  let { id, name } = route.params

  let theme = useTheme();

  const [selectedTime, setSelectedTime] = useState(4);
  const local = useGlobalStore(state => state.local);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg
    },
    iconContainer: {
      width: 15,
      height: 15,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
  
  let [filter, setFilter] = useState({
    lm: 50,
    productid: id,
    dr: 1,
    pg: 0,
    sr: "Moment",
  })

  const [productStaus, setProductStatus] = useState(null);
  const [itemSize, setItemSize] = useState(0)

  let fetchingStockList = async () => {
    let obj = { ...filter };
    obj.token = await AsyncStorage.getItem("token")
    await api('producthistory/get.php', obj).then(item => {
      if (item != null) {
        setItemSize(item.Count);
        let data = [...item.List]
        console.log(data);
        if(!local.demands.stockBalance.supplyBalance){
          data = data.filter(item => item.Document != 'supplies' && 'supplyreturns');
        }
        item.List = [...data];
        setProductStatus(item);
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  useEffect(() => {
    fetchingStockList()
  }, [filter])

  return (
    <View style={styles.container}>
      <Text style={{
        margin: 10, textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: theme.black
      }}>{name}</Text>
      <Line width={'90%'} />
      <View style={{
        width: '100%'
      }}>
        <DateRangePicker
          submit={true}
          width={'100%'}
          filter={filter}
          setFilter={setFilter}
        />
      </View>

      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />

      {
        productStaus == null ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={40} color={theme.primary} />
          </View>
          :
          <>
            <ScrollView>
              {
                productStaus.List.map((element, index) => {

                  return (
                      <ListItem
                        index={index + 1}
                        iconBasket={true}
                        firstText={translateProductStockTerm(element.Document)}
                        centerText={formatPrice(element.Price)}
                        endText={formatPrice(element.Quantity)}
                        priceText={<Text>{formatPrice(element.StockQuantity)} <FontAwesome size={10} name='cube' color={formatPrice(element.StockQuantity) >= 0 ? theme.green : theme.red} /></Text>}
                        notPriceIcon={true}
                      />
                  )
                })
              }

              <MyPagination
                itemSize={itemSize}
                page={filter.pg + 1}
                pageSize={50}
                setPage={(e) => {
                  setFilter(rel => ({ ...rel, ['pg']: e - 1 }))
                }}
              />
            </ScrollView>
          </>
      }
    </View>
  )
}

export default StockBalanceManage

