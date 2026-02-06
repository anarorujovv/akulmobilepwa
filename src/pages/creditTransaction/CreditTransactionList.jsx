import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import getDateByIndex from '../../services/report/getDateByIndex';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import DocumentInfo from '../../shared/ui/DocumentInfo';

const CreditTransactionList = ({navigation}) => {

    let theme = useTheme();

    const [filter, setFilter] = useState({
        dr: 1,
        lm: 100,
        pg: 0,
        sr: 'Moment',
        ...getDateByIndex(4)
    })

    const [list, setList] = useState([]);
    const [sum, setSum] = useState(null);
    const [dateByIndex, setDateByIndex] = useState(4)

    const makeApiRequest = async () => {
        let obj = {
            ...filter,
            token: await AsyncStorage.getItem('token')
        }
        await api('credittransactions/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (filter.agrigate == 1) {
                        setSum(element);
                    }
                    setList(element.List);
                }
            })
            .catch(err => {
                ErrorMessage(err);
            })

    }
    
    useEffect(() => {
        makeApiRequest();
    }, [filter])

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.bg
        }}>
            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'docNumber'}
                header={'Ödənişlər'}
                isFilter={true}
                processFilterClick={() => {
                    navigation.navigate('filter',{
                        filter:filter,
                        setFilter:setFilter,
                        searchParams:[
                            'documentName',
                            'spendItems',
                            'customers',
                        ],
                        sortList:[
                            {
                                id:1,
                                label:'Satış nöqtəsi',
                                value:'SalePoint'
                            },
                            {
                                id:2,
                                label:'Tarix',
                                value:'Moment'
                            },
                            {
                                id:3,
                                label:'Tərəf-Müqabil',
                                value:'CustomerName'
                            },
                        ]
                    })
                }}
            />
            <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={dateByIndex}
                setSelected={setDateByIndex}
            />

            {
                sum == null ?
                    <View style={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size={30} color={theme.primary} />
                    </View>
                    :
                    <DocumentInfo
                        data={[
                            {
                                title: "Mədaxil",
                                value: sum.InSum
                            },
                            {
                                title: "Məxaric",
                                value: sum.OutSum
                            }
                        ]}
                    />
            }

            <FlatList
                data={list}
                renderItem={({ item, index }) => {
                    return (
                        <ListItem
                            centerText={item.CustomerName}
                            endText={item.Moment}
                            firstText={<Text style={{
                                color: theme.primary
                            }}>{item.SalePoint}</Text>}
                            notIcon={true}
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

export default CreditTransactionList

const styles = StyleSheet.create({})