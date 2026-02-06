import { ActivityIndicator, View, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import { formatPrice } from '../../services/formatPrice';
import { Picker } from '@react-native-picker/picker';
import Line from '../../shared/ui/Line';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import ListItem from '../../shared/ui/list/ListItem';
import { useFocusEffect } from '@react-navigation/native';

const StockBalanceList = ({ route, navigation }) => {
    let selectionData = [
        {
            label: "Hamısı",
            value: "all"
        },
        {
            label: "Müsbətlər",
            value: "1"
        },
        {
            label: "Mənfilər",
            value: "2"
        },
        {
            label: "0 olmayanlar",
            value: "3"
        },
        {
            label: "0 olanlar",
            value: "4"
        }
    ]

    const [stocks, setStocks] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [itemSize, setItemSize] = useState(0);
    const [stockInfo, setStockInfo] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    let [filter, setFilter] = useState({
        pg: 1,
        lm: 100,
        dr: 0,
        sr: "ProductName",
        zeros: 3,
        ar: 0,
        showc: true,
        showh: false,
        quick: "",
        agrigate: 1
    })

    let theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg
        }
    })

    const fetchingStockBalance = useCallback(async () => {
        setIsRefreshing(true);
        let obj = { ...filter };
        obj.pg = obj.pg - 1;
        obj.token = await AsyncStorage.getItem("token");

        if (obj.zeros == "all") {
            obj.zeros = ""
        }

        console.log(obj);
        try {
            const element = await api('stockbalance/get.php', obj);
            console.log(obj);
            console.log(element);
            if (element != null) {
                setItemSize(element.Count);
                if (filter.agrigate == 1) {
                    setStockInfo(element);
                }
                setStocks([...element.List]);
            }
        } catch (err) {
            ErrorMessage(err);
        } finally {
            setIsRefreshing(false);
        }
    }, [filter]);

    useFocusEffect(
        useCallback(() => {
            setStocks(null);
            let time = setTimeout(() => {
                fetchingStockBalance();
            }, 300);

            return () => clearTimeout(time);
        }, [filter])
    )


    const RenderFooter = () => {
        return (
            stocks.length == 100 || filter.pg != 0 ?
                <MyPagination
                    itemSize={itemSize}
                    page={filter.pg + 1}
                    setPage={(e) => {
                        let filterData = { ...filter };
                        filterData.agrigate = 0;
                        filterData.pg = e - 1;
                        setFilter(filterData);
                    }}
                    pageSize={21000}
                />
                : ""
        )
    }

    const renderItem = ({ item, index }) => (
        <>
            <ListItem
                key={item.ProductId}
                onPress={() => {
                    navigation.navigate("stock-manage", {
                        id: item.ProductId,
                        name: item.ProductName
                    })
                }}
                firstText={item.GroupName}
                centerText={item.ProductName}
                endText={formatPrice(item.Quantity)}
                priceText={formatPrice(item.Price)}
                index={index + 1}
            />
        </>
    );

    const handleScanner = () => {
        navigation.navigate('product-scanner', {
            setData: (e) => {
                setFilter(rel => ({ ...rel, quick: e }));
            }
        });
    };

    return (
        <View style={styles.container}>
            <ListPagesHeader
                processScannerClick={handleScanner}
                header={"Anbar qalığı"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'quick'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigation.navigate('filter', {
                        filter: filter,
                        setFilter: setFilter,
                        searchParams: [
                            'product',
                            'groups',
                            'stocks',
                            'customers',
                        ],
                        customFields: {
                            groups: {
                                title: "Qrup",
                                name: 'gp',
                                type: 'select',
                                api: 'productfolders'
                            },
                            product: {
                                title: "Məhsul",
                                name: 'nmId',
                                type: 'select',
                                api: "products",
                                searchApi: 'products/getfast.php',
                                searchKey: 'fast'
                            }
                        },
                        sortList: [
                            {
                                id: 1,
                                label: "Məhsulun adı",
                                value: 'ProductName'
                            },
                            {
                                id: 2,
                                label: 'Barkod',
                                value: 'BarCode',
                            },
                            {
                                id: 3,
                                label: 'Ümumi qalığ',
                                value: "Quantity"
                            },
                            {
                                id: 4,
                                label: 'Alış qiyməti',
                                value: 'BuyPrice'
                            },
                            {
                                id: 5,
                                label: 'Satış qiyməti',
                                value: 'Price'
                            },
                            {
                                id: 6,
                                label: 'Cəm satış',
                                value: 'SumSalePrice'
                            }
                        ]
                    })
                }}
            />



            <Picker
                mode='dialog'
                selectedValue={filter.zeros}
                onValueChange={(e) => {
                    let filterData = { ...filter };
                    filterData.zeros = e;
                    filterData.pg = 1;
                    filterData.agrigate = 1;
                    setFilter(filterData);
                }}
            >
                {
                    selectionData.map(element => {
                        return (
                            <Picker.Item key={element.value} color={theme.black} label={element.label} value={element.value} />
                        )
                    })
                }
            </Picker>

            <Line width={'100%'} />

            {stockInfo != null ? (
                <DocumentInfo
                    data={[
                        {
                            title: "Ümumi qalıq",
                            value: formatPrice(stockInfo.QuantitySum)
                        },
                        {
                            title: "Maya",
                            value: formatPrice(stockInfo.CostSum)
                        },
                        {
                            title: "Cəm Satış",
                            value: formatPrice(stockInfo.SaleSum)
                        }
                    ]}
                />
            ) : (
                <View style={{
                    width: '100%',
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator size={15} color={theme.primary} />
                    <Line width={'100%'} />
                </View>
            )}

            <>
                {
                    stocks == null ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={30} color={theme.primary} />
                        </View>
                        :
                        <FlatList
                            data={stocks}
                            renderItem={renderItem}
                            keyExtractor={item => item.ProductId.toString()}
                            refreshing={isRefreshing}
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
        </View>
    )
}

export default StockBalanceList
