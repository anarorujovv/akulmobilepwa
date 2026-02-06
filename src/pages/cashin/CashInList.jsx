import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../services/api'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import getDateByIndex from '../../services/report/getDateByIndex'
import ListPagesHeader from '../../shared/ui/ListPagesHeader'
import DocumentTimes from '../../shared/ui/DocumentTimes'
import ListItem from '../../shared/ui/list/ListItem'
import { formatPrice } from '../../services/formatPrice'
import useTheme from '../../shared/theme/useTheme'
import { useFocusEffect } from '@react-navigation/native'

const CashInList = ({ navigation }) => {

    const [filter, setFilter] = useState({
        dr: 1,
        lm: 100,
        pg: 0,
        sr: 'Moment',
        ...getDateByIndex(4)
    })

    let theme = useTheme();

    const [dateByIndex, setDateByIndex] = useState(4)
    const [list, setList] = useState([]);
    const [sum, setSum] = useState(null);

    const makeApiRequestCashInList = async () => {
        let obj = {
            ...filter,
            token: await AsyncStorage.getItem('token')
        }

        await api('cashins/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (filter.agrigate == 1) {
                        setSum(element)
                    }

                    setList(element.List);
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    useFocusEffect(
        useCallback(() => {
            setList([]);

            let time = setTimeout(() => {
                makeApiRequestCashInList();
            }, 300);

            return () => clearTimeout(time);

        }, [filter])
    )

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.bg
        }}>

            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                header={'Kassa Mədaxil'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigation.navigate('filter', {
                        filter: filter,
                        setFilter: setFilter,
                        searchParams: [
                            'salePoint',
                            'departments',
                            'owners',
                        ],
                        sortList: [
                            {
                                id: 1,
                                label: 'Satış nöqtəsi',
                                value: 'SalePointName'
                            },
                            {
                                id: 2,
                                label: "Tarix",
                                value: 'Moment'
                            },
                            {
                                id: 3,
                                label: "Məbləğ",
                                value: 'Amount'
                            }
                        ],
                        customFields: {
                            departments: {
                                title: "Şöbə",
                                api: 'departments',
                                name: "departmentName",
                                type: 'select',
                            },
                        }
                    })
                }}
            />

            <DocumentTimes
                selected={dateByIndex}
                setSelected={setDateByIndex}
                filter={filter}
                setFilter={setFilter}
            />

            <FlatList
                data={list}
                renderItem={({ item, index }) => {
                    return (
                        <ListItem
                            firstText={item.SalePointName}
                            centerText={item.Moment}
                            priceText={formatPrice(item.Amount)}
                            index={index + 1}
                        />
                    );
                }}
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

export default CashInList

const styles = StyleSheet.create({})