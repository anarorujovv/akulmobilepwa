import { ActivityIndicator, FlatList, StyleSheet, View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import FabButton from '../../shared/ui/FabButton';
import ListItem from '../../shared/ui/list/ListItem';
import { useFocusEffect } from '@react-navigation/native';

const CustomerList = ({ route, navigation }) => {

    const [customers, setCustomers] = useState([]);
    const [itemSize, setItemSize] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [filter, setFilter] = useState({
        dr: 0,
        sr: "GroupName",
        pg: 1,
        gp: "",
        lm: 20,
        ar: 0,
        fast: ""
    })

    let theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg
        }
    })

    const fetchingCustomers = async () => {
        setIsRefreshing(true)
        let obj = { ...filter, token: await AsyncStorage.getItem('token') }
        obj.pg = obj.pg - 1;
        await api('customers/get.php', obj)
            .then(element => {
                if (element != null) {
                    setItemSize(element.Count)
                    setCustomers([...element.List])
                }
            }).catch(err => {
                ErrorMessage(err)
            }).finally(() => {
                setIsRefreshing(false)
            })
    }

    const fetchingFastCustomers = async () => {
        setIsRefreshing(true)
        let obj = { ...filter, token: await AsyncStorage.getItem("token") }
        obj.pg = obj.pg - 1;

        await api(
            'customers/getfast.php', obj
        ).then((element) => {
            if (element != null) {
                setItemSize(element.Count);
                setCustomers([...element.List]);
            }
        }).catch((err) => {
            ErrorMessage(err)
        }).finally(() => {
            setIsRefreshing(false)
        })
    }


    useFocusEffect(
        useCallback(() => {
            setCustomers(null);
            let time;
            if (filter.fast == "") {
                fetchingCustomers();
            } else {
                time = setTimeout(() => {
                    fetchingFastCustomers();
                }, 400);
            }

            return () => clearTimeout(time);
        }, [filter])
    )

    const renderItem = ({ item, index }) => (
        <>
            <ListItem
                index={index + 1}
                onPress={() => {
                    navigation.navigate("customer-manage", {
                        id: item.Id
                    })
                }}
                firstText={item.Phone}
                centerText={item.Name}
                endText={item.Card}
                notIcon={true}
            />
        </>
    )

    return (
        <View style={styles.container}>
            <ListPagesHeader
                header={"Tərəf-müqabilləri"}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'fast'}
            />
            {customers == null ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={40} color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={customers}
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
                            {customers === null ? (
                                <ActivityIndicator size={30} color={theme.primary} />
                            ) : (
                                <Text style={{ color: theme.text }}>List boşdur</Text>
                            )}
                        </View>
                    )}
                    onRefresh={fetchingCustomers}
                    ListFooterComponent={
                        <MyPagination
                            itemSize={itemSize}
                            page={filter.pg}
                            setPage={(e) => {
                                setCustomers([])
                                setFilter(rel => ({ ...rel, pg: e }))
                            }}
                            pageSize={20}
                        />
                    }
                />
            )}

            <FabButton
                onPress={() => {
                    navigation.navigate("customer-manage", {
                        id: null
                    })
                }}
            />
        </View>
    )
}

export default CustomerList
