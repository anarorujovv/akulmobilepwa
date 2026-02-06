import { ActivityIndicator, FlatList, StyleSheet, View, Text } from 'react-native'
import React, { useState, useCallback } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import prompt from '../../services/prompt';
import ListItem from '../../shared/ui/list/ListItem';
import Line from '../../shared/ui/Line';
import { useFocusEffect } from '@react-navigation/native';
import translatePayed from './../../services/report/translatePayed';

const DemandList = ({ navigation }) => {
    let theme = useTheme();

    let permissions = useGlobalStore(state => state.permissions);
    let local = useGlobalStore(state => state.local);

    const [selectedTime, setSelectedTime] = useState(null);

    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 20,
        agrigate: 1
    })

    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [itemSize, setItemSize] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,
        },
        deleteButton: {
            backgroundColor: theme.red,
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: '100%',
        },
        deleteText: {
            color: theme.stable.white,
            fontWeight: 'bold',
            fontSize: 16,
        },
    });

    const fetchingDocumentData = useCallback(async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorage.getItem('token') }
        obj.pg = obj.pg - 1;

        try {
            const element = await api('demands/get.php', obj);
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
        if (permission_ver(permissions, 'demand', 'D')) {
            await api('demands/del.php?id=' + id, {
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
                    itemSize={itemSize}
                    page={filter.pg}
                    setPage={(e) => {
                        let filterData = { ...filter };
                        filterData.agrigate = 0;
                        filterData.pg = e;
                        setFilter(filterData);
                    }}
                    pageSize={20}
                />
                :
                ""
        )
    }

    const renderItem = ({ item, index }) => (
        <>
            <ListItem
                index={index + 1}
                onLongPress={() => {
                    prompt('Satışı silməyə əminsiniz?', () => {
                        handleDelete(item.Id);
                    })
                }}
                {...translatePayed(item.Payed)}
                centerText={item.CustomerName}
                firstText={item.Name}
                endText={item.Moment}
                notIcon={true}
                markId={item.Mark}
                priceText={local.demands.demand.listPrice ? formatPrice(item.Amount) : ""}
                onPress={() => {
                    if (permission_ver(permissions, 'demand', 'R')) {
                        navigation.navigate('demand-manage', {
                            id: item.Id
                        })
                    } else {
                        ErrorMessage('İcazəniz yoxdur!')
                    }
                }}
            />
        </>
    );


    useFocusEffect(
        useCallback(() => {
            setDocuments(null);

            let time = setTimeout(() => {
                fetchingDocumentData();
            }, 300);

            return () => clearTimeout(time);

        }, [filter])
    )

    return (
        <View style={styles.container}>

            <ListPagesHeader
                isSearch={true}
                header={'Satışlar'}
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
                            'customers',
                            'stocks',
                            'owners',
                            'documentName'
                        ],
                        sortList: [
                            {
                                id: '1',
                                label: 'Tarix',
                                value: "Moment"
                            },
                            {
                                id: '2',
                                label: 'Anbar',
                                value: 'StockName'
                            },
                            {
                                id: '3',
                                label: "Məbləğə görə",
                                value: 'Amount'
                            },
                            {
                                id: '4',
                                label: 'Status',
                                value: "Mark"
                            }
                        ],
                        customFields: {
                            product: {
                                title: "Məhsul",
                                api: 'products',
                                name: "productName",
                                type: 'select',
                                searchApi: 'products/getfast.php',
                                searchKey: 'fast'
                            },
                            customers: {
                                title: 'Qarşı-Tərəf',
                                api: 'customers',
                                name: "customerName",
                                type: 'select',
                                searchApi: 'customers/getfast.php',
                                searchKey: 'fast'
                            },
                        }
                    });
                }}
            />

            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            {
                local.demands.demand.allSum ?
                    documentsInfo != null ? (
                        <DocumentInfo data={[
                            {
                                title: "Məbləğ",
                                value: formatPrice(documentsInfo.AllSum)
                            },
                            {
                                title: 'Maya',
                                value: formatPrice(documentsInfo.AllCostPrice)
                            },
                            {
                                title: "Qazanc",
                                value: formatPrice(documentsInfo.AllProfit)
                            }
                        ]} />
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
                    )

                    :
                    ""
            }

            <>
                {
                    documents == null ?
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator size={30} color={theme.primary} />
                        </View>
                        :
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
                                if (selectedTime != null) {
                                    setSelectedTime(null);
                                    let filterData = { ...filter };
                                    delete filterData.momb;
                                    delete filterData.mome;
                                    filterData.agrigate = 1;
                                    setFilter(filterData);
                                }
                            }}
                            ListFooterComponent={RenderFooter}
                        />
                }
            </>

            <FabButton
                onPress={() => {
                    if (permission_ver(permissions, 'demand', 'C')) {
                        navigation.navigate('demand-manage', {
                            id: null
                        })
                    }
                }}
            />
        </View>
    )
}

export default DemandList
