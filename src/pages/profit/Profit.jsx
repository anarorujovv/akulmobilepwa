import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import { Pressable } from '@react-native-material/core';
import useTheme from '../../shared/theme/useTheme';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from './../../services/formatPrice';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import getDateByIndex from './../../services/report/getDateByIndex';

const Profit = () => {
  let theme = useTheme();
  const [expandedItem, setExpandedItem] = useState(0);
  let [profit, setProfit] = useState(null);
  let [selectedTime, setSelectedTime] = useState(2);

  let [filter, setFilter] = useState(
    {
      dr: 1,
      sr: "",
      pg: 1,
      lm: 100,
      ...getDateByIndex(2)
    }
  )
  let [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      backgroundColor: theme.primary,  // Using theme's background color for the header
      padding: 12,
      justifyContent: 'space-between',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    headerText: {
      color: theme.bg,  // Using theme's grey for header text color
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.whiteGrey,  // Using theme's whiteGrey for border color
      backgroundColor: theme.whiteGrey,  // Using theme's whiteGrey for row background
      alignItems: 'center',
      borderRadius: 12
    },
    cell: {
      flex: 1,
      textAlign: 'left',
      fontSize: 14,
      color: theme.black,  // Using theme's black for text color
      paddingLeft: 10,
    },
    valueCell: {
      color: theme.black,  // Using theme's black for value cell text color
    },
    subRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingLeft: 20,  // Adds space for nested structure
      borderBottomWidth: 1,
      borderBottomColor: theme.whiteGrey,  // Using theme's whiteGrey for border color
      backgroundColor: theme.whiteGrey,  // Using theme's whiteGrey for background color
    },
    subCell: {
      flex: 1,
      textAlign: 'left',
      fontSize: 13,
      color: theme.grey,  // Using theme's grey for sub-cell text color
    },
    icon: {
      fontSize: 18,
      paddingRight: 10,  // Adds space to the right of the icon
      color: theme.primary,  // Using theme's primary color for the icon
      fontWeight: 'bold',
    },
  });

  const handleExpandItem = () => {
    setExpandedItem(rel => rel == 3 ? 0 : 3)
  }

  let isBold = [1, 3, 5]

  const renderItem = ({ item, index }) => {
    let answer = isBold.findIndex(rel => rel == item.id);

    if (item.isExpandable) {
      return (
        <View>
          <Pressable onPress={handleExpandItem} pressEffectColor={theme.grey} style={styles.row}>
            <Text style={[styles.cell]}>{item.key}</Text>
            <Text style={[styles.cell, styles.valueCell,]}>{item.value}</Text>
          </Pressable>

          {expandedItem === index && item.subItems.map((subItem, subIndex) => (
            <View key={subIndex} style={styles.subRow}>
              <Text style={styles.subCell}>{subItem.Name}</Text>
              <Text style={[styles.subCell, styles.valueCell]}>{formatPrice(subItem.Amount)}</Text>
            </View>
          ))}
        </View>
      );
    } else {
      return (
        item.id !== 5 ?
          <View style={styles.row}>
            <Text style={[styles.cell, answer != -1 && { fontWeight: 'bold' }]}>{item.key}</Text>
            <Text style={[styles.cell, styles.valueCell, answer != -1 && { fontWeight: 'bold' }]}>{item.value}</Text>
          </View>
          :
          <View style={styles.row}>
            <Text style={[styles.cell, answer != -1 && { fontWeight: 'bold' }]}>{item.key}</Text>
            <Text style={[styles.cell, styles.valueCell, answer != -1 && { fontWeight: 'bold' }, formatPrice(item.value) < 0 ? { color: theme.red } : {}]}>{item.value}</Text>
          </View>
      );
    }
  };

  const fetchingProfit = async () => {

    let obj = {
      ...filter,
      token: await AsyncStorage.getItem('token'),
      pg: filter.pg - 1
    }
    
    await api('profit/get.php', obj)
      .then((item) => {
        if (item != null) {
          let itemData = { ...item };
          let data = [
            { key: 'Satış dövriyyəsi', value: formatPrice(itemData.SaleSum), id: 1 },
            { key: 'Mayası', value: formatPrice(itemData.CostSum), id: 2 },
            { key: 'Dövriyyə mənfəəti', value: formatPrice(itemData.TurnoverProfit), id: 3 },
            {
              key: <Text><FontAwesome6 name='angle-down' size={15} /> Xərclər (toplam)</Text>,
              value: formatPrice(itemData.SpendItemsSum),
              isExpandable: true,
              id: 4,
              subItems: [...itemData.SpendItems]
            },
            { key: 'Təmiz mənfəət', value: formatPrice(itemData.NetProfit), id: 5 }
          ]
          setProfit(data);
          setLoading(false);
        }
      }).catch(err => {
        ErrorMessage(err)
      })
  }

  useEffect(() => {
    fetchingProfit();
  }, [filter])
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
      <ListPagesHeader
        header={'Mənfəət və Zərər'}
      />
      <>
        <DocumentTimes
          filter={filter}
          setFilter={setFilter}
          selected={selectedTime}
          setSelected={setSelectedTime}
        />

        <View style={{
          margin: 10,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: theme.primary
        }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Maddə</Text>
            <Text style={styles.headerText}>Mənfəət/Zərər</Text>
          </View>

          {
            loading ?
              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ActivityIndicator size={50} color={theme.primary} />
              </View>
              :
              <FlatList
                data={profit}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
          }
        </View>
      </>
      </ScrollView>
    </View>
  );
};

export default Profit;
