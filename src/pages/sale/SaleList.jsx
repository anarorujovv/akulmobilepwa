import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import useTheme from '../../shared/theme/useTheme';
import {useFocusEffect} from '@react-navigation/native';
import getDateByIndex from '../../services/report/getDateByIndex';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import {formatPrice} from '../../services/formatPrice';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentInfo from '../../shared/ui/DocumentInfo';

const SaleList = ({route, navigation}) => {
  let theme = useTheme();
  let [filter, setFilter] = useState({
    dr: 1,
    lm: 100,
    pg: 0,
    sr: 'Moment',
    ...getDateByIndex(0),
  });
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(null);
  const [selectedTime, setSelectedTime] = useState(0);

  const makeApiRequest = async () => {
    let obj = {
      ...filter,
      token: await AsyncStorage.getItem('token'),
    };

    await api('sales/get.php', obj)
      .then(element => {
        if (element != null) {
          if (filter.agrigate == 1) {
            setSaleSum(element);
          }
          setSales(element.List);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        centerText={item.CustomerName}
        firstText={item.SalePointName}
        endText={`${item.Moment} - ${item.EmployeeName || ''}`}
        notIcon={true}
        index={index + 1}
        priceText={formatPrice(item.Amount)}
        onPress={() => {
          navigation.navigate('sale-manage', {
            id: item.Id,
          });
        }}
      />
    );
  };

  useFocusEffect(
    useCallback(() => {
      makeApiRequest();
    }, [filter]),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.bg,
      }}>
      <ListPagesHeader
        filter={filter}
        setFilter={setFilter}
        header={'Satış'}
        isSearch={true}
        filterSearchKey={'docNumber'}
        isFilter={true}
        processFilterClick={() => {
          navigation.navigate('filter', {
            filter: filter,
            setFilter: setFilter,
            searchParams: [
              'documentName',
              'product',
              'customers',
              'stocks',
              'salePoint',
              'odenis',
              'owners',
            ],
            sortList: [
              {
                id: 1,
                label: 'Ad',
                value: 'Name',
              },
              {
                id: 2,
                label: 'Satış nöqtəsi',
                value: 'SalePointName',
              },
              {
                id: 3,
                label: 'Tarix',
                value: 'Moment',
              },
              {
                id: 4,
                label: 'Tərəf-Müqabil',
                value: 'customerName',
              },
              {
                id: 5,
                label: 'Nağd',
                value: 'Cash',
              },
              {
                id: 6,
                label: 'Bonus',
                value: 'UseBonus',
              },
              {
                id: 7,
                label: 'Borca',
                value: 'Credit',
              },
              {
                id: 8,
                label: 'Qazanc',
                value: 'Profit',
              },
            ],
            customFields: {
              odenis: {
                title: 'Ödəniş',
                name: 'paytype',
                type: 'select',
                customSelection: true,
                options: [
                  {
                    key: 'p',
                    value: 'Nağd',
                  },
                  {
                    key: 'i',
                    value: 'Köçürmə',
                  },
                  {
                    key: '',
                    value: 'Hamısı',
                  },
                ],
              },
              owners: {
                title: 'Satıcı',
                type: 'select',
                api: 'employees',
                name: 'employeeId',
              },
            },
          });
        }}
      />
      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />
      {saleSum == null ? (
        <View
          style={{
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={30} color={theme.primary} />
        </View>
      ) : (
        <DocumentInfo
          data={[
            {
              value: formatPrice(saleSum.CashSum),
              title: 'Nağd',
            },
            {
              title: 'Nağdız',
              value: formatPrice(saleSum.BankSum),
            },
            {
              title: 'Bonus',
              value: formatPrice(saleSum.BonusSum),
            },
            {
              title: 'Borc',
              value: formatPrice(saleSum.CreditSum),
            },
            {
              title: 'Yenuk məbləö',
              value: formatPrice(saleSum.AmountSum),
            },
            {
              title: 'Maya',
              value: formatPrice(saleSum.AllCost),
            },
            {
              title: 'Qazanc',
              value: formatPrice(saleSum.AllProfit),
            },
          ]}
        />
      )}

      <FlatList
        data={sales}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50,
            }}>
            {sales === null ? (
              <ActivityIndicator size={30} color={theme.primary} />
            ) : (
              <Text style={{color: theme.text}}>List boşdur</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default SaleList;

const styles = StyleSheet.create({});
