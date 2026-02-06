import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import ListItem from '../../shared/ui/list/ListItem';
import Line from '../../shared/ui/Line';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import { useFocusEffect } from '@react-navigation/native';
import getDateByIndex from '../../services/report/getDateByIndex';

const SaleReportList = ({ route, navigation }) => {
  let theme = useTheme();
  let permissions = useGlobalStore(state => state.permissions);

  const [selectedTime, setSelectedTime] = useState(4);
  const [filter, setFilter] = useState({
    dr: 0,
    sr: "Profit",
    pg: 1,
    gp: null,
    zeros: null,
    ar: null,
    lm: 100,
    own: null,
    showc: null,
    showh: null,
    pricetype: null,
    quick: null,
    docNumber: "",
    ...getDateByIndex(4)
  })



  const [documents, setDocuments] = useState([]);
  const [documentsInfo, setDocumentsInfo] = useState(null);
  const [itemSize, setItemSize] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg
    },
    deleteButton: {
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
    },
    deleteText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    }
  })

  const fetchingDocumentData = async () => {
    setIsRefreshing(true);
    let obj = { ...filter, token: await AsyncStorage.getItem('token') }
    obj.pg = obj.pg - 1;
    try {
      const element = await api('salereports/get.php', obj);
      if (element != null) {
        setItemSize(element.Count);
        if (filter.agrigate == 1) {
          setDocumentsInfo(element);
        }
        setDocuments([...element.List]);
      }
    } catch (err) {
      ErrorMessage(err);
    } finally {
      setIsRefreshing(false);
    }
  }

  const RenderFooter = () => {
    return (
      documents.length == 100 || filter.pg != 1 ?
        <MyPagination
          pageSize={100}
          page={filter.pg}
          setPage={(e) => {
            let filterData = { ...filter };
            filterData.agrigate = 0;
            filterData.pg = e;
            setFilter(filterData);
          }}
          itemSize={itemSize}
        />
        : ""
    )
  }

  useFocusEffect(
    useCallback(() => {
      setDocuments(null);
      let time = setTimeout(() => {
        fetchingDocumentData();
      }, 300);

      return () => clearTimeout(time);
    }, [filter])
  )

  const renderItem = ({ item, index }) => (
    <>
      <ListItem
        firstText={item.ProductName}
        priceText={formatPrice(item.SumPrice)}
        centerText={`${formatPrice(item.Quantity)} əd x ${formatPrice(formatPrice(item.SumPrice) / formatPrice(item.Quantity))}`}
        endText={formatPrice(item.Profit)}
        notIcon={true}
        onPress={() => {
          if (permission_ver(permissions, 'salereports', 'R')) {
            navigation.navigate('sale-report-manage', { id: item.ProductId, name: item.ProductName });
          } else {
            ErrorMessage('İcazəniz yoxdur!');
          }
        }}
        index={index + 1}
      />
    </>
  );



  return (
    <View style={styles.container}>
      <ListPagesHeader
        header={"Mənfəət"}
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'docNumber'}
        isFilter={true}
        processFilterClick={() => {
          navigation.navigate('filter', {
            filter: filter,
            setFilter: setFilter,
            searchParams: [
              'product',
              'groups',
              'customers',
              'stocks',
              'salePoint',
              'customerGroups'
            ],
            customFields: {
              groups: {
                title: "Qrup",
                name: 'gp',
                api: 'productfolders',
                type: 'select'
              },
              product: {
                title: "Məhsul",
                api: 'products',
                name: "productName",
                type: 'select',
                searchApi: 'products/getfast.php',
                searchKey: 'fast'
              },
            },
            isDate: true
          })
        }}
      />

      <DocumentTimes
        selected={selectedTime}
        setSelected={setSelectedTime}
        filter={filter}
        setFilter={setFilter}
      />

      {documentsInfo != null ? (
        <DocumentInfo
          data={[
            {
              title: "Satış",
              value: formatPrice(documentsInfo.AllAmount)
            },
            {
              title: "Qaytarma",
              value: formatPrice(documentsInfo.RetAllAmount)
            },
            {
              title: 'Maya',
              value: formatPrice(documentsInfo.AllCost)
            },
            {
              title: "Qazanc",
              value: formatPrice(documentsInfo.AllProfit)
            },
            {
              title: "Miqdar",
              value: formatPrice(documentsInfo.AllSaleQuantity)
            },
            {
              title: "Marja",
              value: formatPrice(documentsInfo.Margin)
            },
            {
              title: "Qaytarma mayası",
              value: formatPrice(documentsInfo.RetAllCost)
            }
          ]}
        />
      ) : (
        <View style={{
          width: '100%',
          height: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size={15} color={theme.primary} />
          <Line width={'100%'} />
        </View>
      )}

      {documents == null ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size={30} color={theme.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={documents}
            renderItem={renderItem}
            refreshing={isRefreshing}
            ListEmptyComponent={() => (
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 50
              }}>
                {documents === null ? (
                  <ActivityIndicator size={30} color={theme.primary} />
                ) : (
                  <Text style={{ color: theme.text }}>List boşdur</Text>
                )}
              </View>
            )}
            onRefresh={() => {
              let filterData = { ...filter };
              filterData.agrigate = 1;
              setFilter(filterData);
            }}
            ListFooterComponent={RenderFooter}
          />
        </>
      )}
    </View>
  );
};

export default SaleReportList;
