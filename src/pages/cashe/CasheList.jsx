import { ActivityIndicator, FlatList, StyleSheet, View, Text } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import NoData from './../../shared/ui/NoData';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import prompt from '../../services/prompt';
import ListItem from '../../shared/ui/list/ListItem';
import Line from '../../shared/ui/Line';
import { useFocusEffect } from '@react-navigation/native';

const CasheList = ({ route, navigation }) => {
  let theme = useTheme();
  let permissions = useGlobalStore(state => state.permissions);
  const [selectedTime, setSelectedTime] = useState(null);

  const [filter, setFilter] = useState({
    docNumber: "",
    dr: 1,
    pg: 1,
    lm: 20,
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

  const fetchingDocumentData = useCallback(async () => {
    setIsRefreshing(true);
    let obj = { ...filter, token: await AsyncStorage.getItem('token') }
    obj.pg = obj.pg - 1;

    try {
      const element = await api('cashes/get.php', obj);
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
  }, [filter]);

  const handleDelete = async (id) => {
    if (permission_ver(permissions, 'cashes', 'D')) {
      await api('cashes/del.php?id=' + id, {
        token: await AsyncStorage.getItem('token')
      }).then(element => {
        if (element != null) {
          setDocuments([]);
          fetchingDocumentData();
        }
      }).catch(err => {
        ErrorMessage(err)
      })
    } else {
      ErrorMessage("İcazə yoxdur!");
    }
  }


  const RenderFooter = () => {
    return (
      documents.length == 20 || filter.pg != 1 ?

        <MyPagination
          pageSize={20}
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
        index={index + 1}
        firstText={item.Name}
        priceText={formatPrice(item.Balance)}
        onPress={() => {
          if (permission_ver(permissions, 'cashes', 'R')) {
            navigation.navigate('cashe-manage', { id: item.Id, name: item.Name, balance: item.Balance });
          } else {
            ErrorMessage('İcaz��niz yoxdur!');
          }
        }}
        onLongPress={() => {
          prompt('Hesabı siməyə əminsiniz ?', () => {
            handleDelete(item.Id)
          })
        }}
      />
    </>
  );


  return (
    <View style={styles.container}>
      <ListPagesHeader
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'docNumber'}
        header={'Hesablar'}
      />

      {documentsInfo != null ? (
        <DocumentInfo
          data={[
            {
              title: "Məbləğ",
              value: formatPrice(documentsInfo.AllSum)
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
            keyExtractor={item => item.Id.toString()}
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

      <FabButton
        onPress={() => {
          if (permission_ver(permissions, 'cashes', 'C')) {
            navigation.navigate('cashe-create');
          }
        }}
      />
    </View>
  );
};

export default CasheList;
