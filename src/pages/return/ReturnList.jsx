import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import { useFocusEffect } from '@react-navigation/native';
import getDateByIndex from '../../services/report/getDateByIndex';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentInfo from '../../shared/ui/DocumentInfo';

const ReturnsList = ({ route, navigation }) => {

    let theme = useTheme();
    let [filter, setFilter] = useState({
        dr: 1,
        lm: 100,
        pg: 0,
        sr: 'Moment',
        ...getDateByIndex(4)
    })


    const [returns, setReturns] = useState([]);
    const [returnsSum, setReturnsSum] = useState(null);
    const [selectedTime, setSelectedTime] = useState(4)

    const makeApiRequest = async () => {
        let obj = {
            ...filter,
            token: await AsyncStorage.getItem('token')
        }

        await api('returns/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (filter.agrigate == 1) {
                        setReturnsSum(element);
                    }
                    setReturns(element.List);
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }
    
    const renderItem = ({ item, index }) => {
        return (
            <ListItem
                centerText={item.CustomerName}
                firstText={item.SalePointName}
                endText={item.Moment}
                notIcon={true}  
                index={index + 1}
                priceText={formatPrice(item.Amount)}
                onPress={() => {
                    navigation.navigate('return-manage', {
                        id: item.Id
                    })
                }}
            />
        )
    }

    
    useFocusEffect(
        useCallback(() => {
            makeApiRequest();
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
                header={'Qaytarmalar'}
                isSearch={true}
                filterSearchKey={'docNumber'}
                isFilter={true}
                processFilterClick={() => {
                    navigation.navigate('filter',{
                        filter:filter,
                        setFilter:setFilter,
                        searchParams:[
                            'documentName',
                            'product',
                            'stocks',
                            'salePoint',
                            'customers',
                        ],
                        sortList:[
                            {
                                id:1,
                                label:'Ad',
                                value:'Name'
                            },
                            {
                                id:2,
                                label:'Satış nöqtəsi',
                                value:'SalePointName'
                            },
                            {
                                id:3,
                                label:'Tarix',
                                value:'Moment'
                            },
                            {
                                id:4,
                                label:"Tərəf-Müqabil",
                                value:'customers'
                            },
                            {
                                id:5,
                                label:'Nağd',
                                value:'Amount'
                            },
                            {
                                id:6,
                                label:'Nağdsız',
                                value:'Bank'
                            }
                        ]
                    })
                }}
            />

            <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={selectedTime}
                setSelected={setSelectedTime}
            />

            {
                returnsSum == null ?
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
                                value: formatPrice(returnsSum.AllSum),
                                title: "Nağd"
                            }
                        ]}
                    />
            }

            <FlatList
                data={returns}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 50
                    }}>
                        {returns === null ? (
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

export default ReturnsList

const styles = StyleSheet.create({})