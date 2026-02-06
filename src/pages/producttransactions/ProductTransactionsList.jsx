import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import moment from 'moment';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import { useFocusEffect } from '@react-navigation/native';
import CardItem from '../../shared/ui/list/CardItem';

const ProductTransactionsList = ({ route, navigation }) => {
    let theme = useTheme();

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
        agrigate: 1,
        mome: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
        momb: moment(new Date()).format('YYYY-MM-DD 00:00:00')
    })
    
    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [itemSize, setItemSize] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,            // Using theme's background color
        },
        deleteButton: {
            backgroundColor: theme.red,           // Using theme's red for delete button
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: '100%',
        },
        deleteText: {
            color: theme.stable.white,            // Using theme's white for delete text
            fontWeight: 'bold',
            fontSize: 16,
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.stable.white,  // Using theme's white for section background
            borderColor: theme.grey,              // Using theme's grey for section border
            borderWidth: 1,
            marginLeft: 10,
            marginRight: 10,
        },
        sectionTitle: {
            backgroundColor: theme.primary,       // Using theme's primary color for section title background
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.bg,                      // Using theme's background color for section title text
        },
        itemsContainer: {
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        itemRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 4,
            borderBottomWidth: 1,
            borderBottomColor: theme.whiteGrey,    // Using theme's whiteGrey for row separators
        },
        itemKey: {
            fontSize: 14,
            color: theme.black,                   // Using theme's black for item key text
        },
        itemValue: {
            fontSize: 14,
            color: theme.black,                   // Using theme's black for item value text
            fontWeight: 'bold',
        },
    });

    const fetchingDocumentData = async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorage.getItem('token') }
        obj.pg = obj.pg - 1;

        try {
            const element = await api('turnovers/get.php', obj);
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

        useEffect(() => {
            setDocuments(null);
            let time = setTimeout(() => {
                fetchingDocumentData();
            }, 300);

            return () => clearTimeout(time);
            
        }, [filter])

    const renderItem = ({ item }) => (
        <CardItem
            title={item.ProductName}
            valueFormatPrice={true}
            items={[
                {
                    key: "Anbar qalığı(ilk)",
                    value: `${formatPrice(item.StartQuantity)} əd x ${formatPrice(item.StartCost)}₼`
                },
                {
                    key: 'Alınıb',
                    value: `${formatPrice(item.IncomeQuantity)} əd x ${formatPrice(item.IncomeCost)}₼`
                },
                {
                    key: 'Verilib',
                    value: `${formatPrice(item.OutcomeQuantity)} əd x ${formatPrice(item.OutcomeCost)}₼`
                },
                {
                    key: 'Anbar qalığı(Son)',
                    value: `${formatPrice(item.EndQuantity)} əd x ${formatPrice(item.EndCost)}₼`
                }
            ]}
        />
    );

    return (
        <View style={styles.container}>
            
            <ListPagesHeader
                header={"Dövriyyə"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigation.navigate('filter',{
                        filter:filter,
                        setFilter:setFilter,
                        searchParams:[
                            'groups',
                            'product',
                            'stocks',
                            'customers',
                            'owners'
                        ],
                        customFields:{
                            groups:{
                                title:"Məhsul qrupu",
                                name:'gp',
                                type:'select',
                                api:'productfolders'
                            }
                        }
                    })
                }}
            />

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
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            {documents == null ? (
                <View>
                    <ActivityIndicator size={30} color={theme.primary} />
                </View>
            ) : (
                <View style={{
                    flex: 1,
                    padding: 10
                }}>
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
                </View>
            )}
        </View>
    );
};

export default ProductTransactionsList;
