import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import useTheme from '../theme/useTheme';
import ListPagesHeader from './ListPagesHeader';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import ProductListItem from './list/ProductListItem';
import Line from './Line';
import SuccessMessage from './RepllyMessage/SuccessMessage';
import defaultUnit from './../../services/report/defaultUnit';
import { useFocusEffect } from '@react-navigation/native';
import isValidEAN from '../../services/isValidEan';
import MyPagination from './MyPagination';

const DocumentProductList = ({ route, navigation }) => {

    let { type, state, setState, units, setUnits, setHasUnsavedChanges, pricePermission } = route.params;

    const [products, setProducts] = useState([]);
    const [unitList, setUnitList] = useState(null);
    const [focusMode, setFocusMode] = useState(true);
    const [itemSize, setItemSize] = useState(0);

    const [isRefresh, setIsRefresh] = useState(false);

    const [filter, setFilter] = useState({
        dr: 0,
        pg: 1,
        gp: "",
        lm: 100,
        ar: 0,
        productname: "",
    })

    let theme = useTheme();

    const fetchingProductsSearchData = async () => {

        let data = {
            ...filter,
            pg: filter.pg - 1,
            token: await AsyncStorage.getItem('token'),
        }

        if (state.StockId) {
            if (state.StockId != '') {
                data.stockid = state.StockId,
                    data.moment = state.Moment
            }
        }


        if (state.CustomerId != undefined) {
            if (state.CustomerId != "") {
                if (state.CustomerInfo?.CustomerData?.PriceTypeId != 0) {
                    data.pricetype = state.CustomerInfo.CustomerData.PriceTypeId;
                }
            }
        }

        console.log(state.CustomerInfo?.CustomerData)
        await api('products/getfast.php', data).then(element => {
            console.log(element);
            if (element != null) {
                setProducts([...element.List]);
                setItemSize(element.Count || element.List.length);
                setUnitList({ ...element.ProductUnits });
                if (isValidEAN(data.fast)) {
                    setFilter(rel => ({ ...rel, ['fast']: "" }));
                    setFocusMode(false);
                    handleClickItem(element.List[0], element.ProductUnits);
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const handleClickItem = async (item, thisUnits) => {
        let targetProduct = item;

        let targetUnits = [...thisUnits[targetProduct.Id]];

        targetProduct.ProductId = targetProduct.Id;
        targetProduct.StockQuantity = targetProduct.StockBalance;

        let lastUnits = {
            [targetProduct.ProductId]: [
                ...targetUnits
            ]
        }

        if (units) {
            lastUnits = { ...lastUnits, ...units };
        }

        let defaultUnitIndex = await defaultUnit();

        if (defaultUnitIndex != 0) {
            let unit = lastUnits[targetProduct.Id][1];

            targetProduct.UnitId = unit.Id;
            targetProduct.UnitName = unit.Name;
            targetProduct.Price = unit.Price;
            targetProduct.BuyPrice = unit.BuyPrice;

        }

        navigation.navigate('product-position', {
            product: targetProduct,
            type: type,
            state: state,
            setState: setState,
            units: lastUnits,
            setUnits: setUnits,
            setHasUnsavedChanges: setHasUnsavedChanges,
            pricePermission: pricePermission
        });
    }

    // index'i sayfalama(pg) ve lm (limit) değerine göre hesapla
    const renderItem = ({ item, index }) => {
        // index: 0 tabanlıdır
        // filter.pg: 1 tabanlıdır
        // filter.lm: bir sayfadaki ürün sayısı
        // Örn: 2. sayfa, 100'lük sayfa, ilk ürünün index'i: (2-1)*100+1 = 101
        const realIndex = (filter.pg - 1) * filter.lm + (index + 1);
        return (
            <>
                <ProductListItem
                    isActive={state.Positions.findIndex(rel => rel.ProductId == item.Id) != -1 ? true : false}
                    iconCube={true}
                    onPress={() => handleClickItem(item, unitList)}
                    key={item.Id}
                    product={item}
                    type={type}
                    priceType={state.CustomerInfo?.CustomerData?.PriceTypeId != 0 ? state.CustomerInfo?.CustomerData?.PriceTypeId : undefined}
                    index={realIndex}
                />
                <Line width={'90%'} />
            </>
        )
    };

    const handleScanner = () => {
        navigation.navigate('product-scanner', {
            setData: (e) => {
                setFilter(rel => ({ ...rel, ['fast']: e }))
            }
        });
    };

    const reload = () => {
        fetchingProductsSearchData();
    }

    // Sayfalama bileşeni
    const FooterComponent = () => {
        return (
            <MyPagination
                pageSize={100}
                itemSize={itemSize}
                page={filter.pg}
                setPage={(e) => {
                    setFilter(rel => ({ ...rel, pg: e }));
                }}
            />
        )
    }

    useFocusEffect(
        useCallback(() => {
            setFocusMode(true);
            let time;
            if (products[0] || products == null) {
                setProducts([]);
            }
            if (filter.productname == "") {
                fetchingProductsSearchData();
            } else {
                setProducts([]);
                time = setTimeout(() => {
                    fetchingProductsSearchData();
                }, 400);
            }

            return () => clearTimeout(time);
        }, [filter])
    )

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
            <ListPagesHeader
                searchM={focusMode}
                processScannerClick={handleScanner}
                header={"Məhsullar"}
                filterSearchKey={'fast'}
                isSearch={true}
                filter={filter}
                setFilter={setFilter}
            />

            {
                products == null ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Məhsul axtarışı...</Text>
                    </View>
                    :

                    products[0] ?
                        <FlatList
                            data={products}
                            renderItem={renderItem}
                            refreshing={isRefresh}
                            onRefresh={() => {
                                setIsRefresh(true);
                                reload();
                                SuccessMessage("Yeniləndi...");
                                setIsRefresh(false);
                            }}
                            ListFooterComponent={FooterComponent}
                        />
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={theme.primary} size={40} />
                        </View>
            }
        </View>
    );
};

export default DocumentProductList;