import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import useTheme from '../../shared/theme/useTheme';
import MySelection from '../../shared/ui/MySelection';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { Pressable } from '@react-native-material/core';
import Line from '../../shared/ui/Line';
import CardItem from './../../shared/ui/list/CardItem';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';

const DailyProfits = () => {

    let theme = useTheme();
    const [selectionData, setSelectionData] = useState([]);
    const [info, setInfo] = useState(null);
    const [filter, setFilter] = useState({
        salepointid: 'not'
    });

    let [data, setData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.bg,            // Using theme background color
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.whiteGrey,     // Using theme's whiteGrey for section background
            borderColor: theme.grey,              // Using theme grey for border color
            borderWidth: 1,
        },
        sectionTitle: {
            backgroundColor: theme.primary,       // Using theme primary color for title background
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.bg,                      // Using theme bg color for text to ensure contrast
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
            borderBottomColor: theme.whiteGrey,   // Using theme whiteGrey for row divider
        },
        itemKey: {
            fontSize: 14,
            color: theme.black,                   // Using theme black for item key text
        },
        itemValue: {
            fontSize: 14,
            color: theme.black,                   // Using theme black for item value text
            fontWeight: 'bold',
        },
    });


    let fetchingData = async () => {

        setInfo(null);

        if (!selectionData[0]) {
            await api('salepoints/get.php', {
                token: await AsyncStorage.getItem('token')
            })
                .then((element) => {
                    if (element != null) {
                        setSelectionData([...element.List]);
                    }
                }).catch(err => {
                    ErrorMessage(err)
                })
        }
        
        if (filter.salepointid !== 'not') {
            let obj = {
                ...filter,
                token: await AsyncStorage.getItem('token')
            }

            await api('dailyreports/salepoints.php', obj)
                .then((item) => {
                    if (item != null) {
                        let list = [

                            {
                                title: 'SATIŞLAR (MƏHSUL)',
                                items: [
                                    { key: 'Məbləğ', value: item.sales_amount || '-' },
                                    { key: 'Nağd', value: item.sales_cash || '-' },
                                    { key: 'Nağdsız', value: item.sales_noncash || '-' },
                                    { key: 'Miqdar', value: item.sales_count || '0' },
                                    { key: 'Bonus', value: item.sales_bonus || '0' },
                                    { key: 'Borca', value: item.sales_credit || '0' }
                                ]
                            },
                            {
                                title: 'QAYTARMALAR',
                                items: [
                                    { key: 'Məbləğ', value: item.returns_amount || '0' },
                                    { key: 'Nağd', value: item.returns_cash || '0' },
                                    { key: 'Nağdsız', value: item.returns_noncash || '0' },
                                    { key: 'Miqdar', value: item.returns_count || '0' },
                                    { key: 'Bonusdan', value: item.returns_bonus || '0' },
                                    { key: 'Borcdan', value: item.returns_credit || '0' }
                                ]
                            },
                            {
                                title: 'ALIŞLAR',
                                items: [
                                    { key: 'Məbləğ', value: item.supplies_amount || '0' },
                                    { key: 'Çeşid', value: item.supplies_product_position_count || '0' }
                                ]
                            },
                            {
                                title: 'MƏDAXİL (SATIŞ NÖQTƏSİNƏ BAĞLI HESAB)',
                                items: [
                                    { key: 'Nağd', value: item.transaction_payment_in || '0' },
                                    { key: 'Köçürmə', value: item.transaction_invoice_in || '0' }
                                ]
                            },
                            {
                                title: 'LİDER MƏHSULLAR',
                                items: [
                                    { key: 'Satışda ən çox təkrarlanan məhsullar', value: item.top_bestseller_products_per_check || '-' },
                                    { key: 'Qaytarmada ən çox təkrarlanan məhsullar', value: item.top_bestreturn_products_per_check || '-' },
                                    { key: 'Ən çox qazanc gətirən məhsullar', value: item.top_profitable_products || '-' }
                                ]
                            },
                            {
                                title: 'ANBAR QALIĞI',
                                items: [
                                    { key: 'Maya', value: item.stock_cost_price || '-' },

                                    { key: 'Cəm satış qiyməti', value: item.stock_sale_price || '-' },
                                    { key: 'Cəm alış qiyməti', value: item.stock_buy_price || '-' },
                                    { key: 'Miqdar', value: item.stock_quantity || '-' },
                                    { key: 'Çeşid', value: item.stock_position_count || '0' }
                                ]
                            },
                        ];
                        setData(list);
                        setInfo({ ...item });
                    } else {
                        setInfo("not");
                    }
                })
                .catch(err => {
                    ErrorMessage(err)
                })
        }

    }

    const changeFilter = (e) => {
        setFilter(rel => ({ ...rel, ['salepointid']: e }))
    }

    useEffect(() => {
        fetchingData();
    }, [filter])

    return (
        <>
            <ListPagesHeader
                header={'Gündəlik hesabat'}
            />

            {
                filter.salepointid == 'not' ?
                    <View style={{ flex: 1, backgroundColor: theme.bg }}>
                        {
                            selectionData[0] ?
                                selectionData.map((item) => {
                                    return (
                                        <>
                                            <Pressable onPress={() => {
                                                changeFilter(item.Id)
                                            }} pressEffectColor={theme.input.grey} style={{
                                                width: '100%',
                                                height: 55,
                                                paddingLeft: 20,
                                                justifyContent: 'center',
                                            }}>
                                                <Text style={{
                                                    color: theme.black,
                                                    fontSize: 13
                                                }}>{item.Name}</Text>
                                            </Pressable>
                                            <Line width={'90%'} />
                                        </>
                                    )
                                })
                                :
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <ActivityIndicator size={40} color={theme.primary} />
                                </View>
                        }
                    </View>
                    :
                    <View style={{
                        flex: 1,
                        backgroundColor: theme.bg,
                        padding: 10,
                        gap: 10
                    }}>

                        {selectionData[0] ?
                            <MySelection
                                list={selectionData}
                                labelName={'Name'}
                                valueName={'Id'}
                                width={'100%'}
                                value={filter.salepointid}
                                onValueChange={(e) => changeFilter(e)}
                                label={'Satış şöbəsi'}
                            />
                            : ""}



                        <>
                            <DocumentTimes
                                filter={filter}
                                setFilter={setFilter}
                                selected={selectedIndex}
                                setSelected={setSelectedIndex}
                            />
                            {info == null ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size={40} color={theme.primary} />
                                </View>
                                : info == 'not' ?
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                                        <Text style={{ textAlign: 'center', color: theme.primary, fontWeight: 'bold' }}>Məlumat tapılmadı!</Text>
                                    </View>
                                    :
                                    <ScrollView style={styles.container}>
                                        {data.map((section, index) => (
                                            <CardItem
                                                key={index + 1}
                                                title={section.title}
                                                items={section.items}
                                                valueFormatPrice={true}
                                            />

                                        ))}
                                    </ScrollView>
                            }
                        </>
                    </View>
            }
        </>
    );
};

export default DailyProfits;
