import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import NoData from './../../shared/ui/NoData';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import Line from '../../shared/ui/Line';
import translateProductStockTerm from './../../services/report/translateProductStockTerm';
import permission_ver from './../../services/permissionVerification';
import ListItem from '../../shared/ui/list/ListItem';
import moment from 'moment';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';

const SaleReportManage = ({ route, navigation }) => {

  let { id, name } = route.params;
  let theme = useTheme();
  let permissions = useGlobalStore(state => state.permissions);

  const [selectedTime, setSelectedTime] = useState(4)

  const [filter, setFilter] = useState({
    dr: 1,
    lm: 100,
    pg: 1,
    sr: "Moment",
    agrigate: 1
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
    let obj = {
      ...filter,
      productid: id,
      token: await AsyncStorage.getItem('token')
    }
    obj.pg = obj.pg - 1;

    try {
      const element = await api('producthistory/get.php', obj);
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

  const handleSubmitDate = (firstDate, lastDate) => {

    if (firstDate != null) {
      setFilter(rel => ({ ...rel, ['momb']: moment(firstDate).format("YYYY-MM-DD 00:00:00") }))
    }
    if (lastDate != null) {
      setFilter(rel => ({ ...rel, ['mome']: moment(lastDate).format('YYYY-MM-DD 23:59:59') }))
    }
  }

  useEffect(() => {
    setDocuments([]);
    let time = setTimeout(() => {
      fetchingDocumentData();
    }, 300);

    return () => clearTimeout(time);
  }, [filter]);

  const renderItem = ({ item, index }) => (


    <>
      <ListItem
        index={index + 1}
        firstText={translateProductStockTerm(item.Document)}
        iconBasket={true}
        priceText={formatPrice(item.DocPrice)}
        priceBottomText={formatPrice(item.Quantity)}
        priceNotBottomText={false}
        centerText={item.Moment}
        endText={formatPrice(item.StockQuantity)}
        onPress={() => {
          if (permission_ver(permissions, 'salereports', 'R')) {
            navigation.navigate('sale-report-manage', { id: item.ProductId });
          } else {
            ErrorMessage('İcazəniz yoxdur!');
          }
        }}
      />
    </>
  );



  return (
    <View style={styles.container}>

      <ListPagesHeader
        header={"Mənfəət"}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'docNumber'}
        isSearch={true}
      />

      <Text style={{
        color: theme.black,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold'
      }}>{name}</Text>
      <View style={{ margin: 5 }} />
      <Line width={'90%'} />
      <View style={{
        width: '100%',
        padding: 10
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

      {documentsInfo != null ? (
        <DocumentInfo
          data={[
            {
              title: "Alınıb",
              value: formatPrice(documentsInfo.PositiveSum)
            },
            {
              title: 'Verilib',
              value: formatPrice(documentsInfo.NegativeSum)
            },
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

      {documents.length === 0 && !isRefreshing ? (
        <NoData />
      ) : (
        <>
          <FlatList
            data={documents}
            renderItem={renderItem}
            refreshing={isRefreshing}
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

export default SaleReportManage;
