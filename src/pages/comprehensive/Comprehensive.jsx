import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import useTheme from '../../shared/theme/useTheme';
import MySelection from '../../shared/ui/MySelection';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../services/formatPrice';
import Input from '../../shared/ui/Input';
import { Pressable } from '@react-native-material/core';
import CustomersModal from '../../shared/ui/modals/CustomersModal';
import moment from 'moment';
import DateRangePicker from './../../shared/ui/DateRangePicker';
import CardItem from '../../shared/ui/list/CardItem';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';

const Comprehensive = () => {
    let theme = useTheme();
    const [info, setInfo] = useState(null);
    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 100,
    });
    const [customer, setCustomer] = useState({
        CustomerId: "",
        CustomerName: ""
    });
    let [data, setData] = useState([]);
    const [selectedTime, setSelectedTime] = useState(4);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.bg,          // Using theme background color
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.whiteGrey,   // Using theme light grey for section background
            borderColor: theme.grey,            // Using theme grey for border color
            borderWidth: 1,
        },
        sectionTitle: {
            backgroundColor: theme.primary,     // Using theme primary color for section title background
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.bg,                    // Using theme bg color for text (to ensure contrast)
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
            borderBottomColor: theme.whiteGrey, // Using theme whiteGrey for row divider
        },
        itemKey: {
            fontSize: 14,
            color: theme.black,                 // Using theme black for item key text
        },
        itemValue: {
            fontSize: 14,
            color: theme.black,                 // Using theme black for item value text
            fontWeight: 'bold',
        },
    });

    let fetchingData = async () => {
        setInfo(null);

        let obj = {
            ...filter,
            token: await AsyncStorage.getItem('token')
        };

        if (customer.CustomerId !== '') {
            obj.customerids = [customer.CustomerId];
        }

        await api('comprehensive/get.php', obj)
            .then((item) => {
                if (item != null) {
                    // Veriyi bileşenle formatlayarak `data` state'ine ekle
                    let list = [
                        {
                            title: 'ANBAR QALIĞI',
                            items: [
                                { key: 'İlkin maya', value: formatPrice(item.Stocks.FirstCost) },
                                { key: 'Son maya', value: formatPrice(item.Stocks.LastCost) },
                                { key: 'İlkin Miqdar', value: item.Stocks.FirstQuantity },
                                { key: 'Son Miqdar', value: item.Stocks.LastQuantity },
                                { key: 'İlkin Çeşid', value: item.Stocks.FirstPositions },
                                { key: 'Son Çeşid', value: item.Stocks.LastPositions },
                            ]
                        },
                        {
                            title: 'Satışlar',
                            items: [
                                { key: 'Məbləğ', value: formatPrice(item.Sales.Price) },
                                { key: 'Maya', value: formatPrice(item.Sales.Cost) },
                                { key: 'Qazanc', value: formatPrice(item.Sales.Profit) },
                                { key: 'Çeşid', value: item.Sales.Positions },
                                { key: 'Miqdar', value: item.Sales.Quantity },
                                { key: 'Marja', value: `${item.Sales.Margin}%` },
                                { key: 'Əlavə', value: `${item.Sales.Markup}%` },
                            ]
                        },
                        {
                            title: 'Qaytarmalar',
                            items: [
                                { key: 'Məbləğ', value: formatPrice(item.Returns.Price) },
                                { key: 'Maya', value: formatPrice(item.Returns.Cost) },
                                { key: 'Qazanc', value: formatPrice(item.Returns.Profit) },
                                { key: 'Çeşid', value: item.Returns.Positions },
                                { key: 'Miqdar', value: item.Returns.Quantity },
                            ]
                        },
                        {
                            title: 'Alış',
                            items: [
                                { key: 'Məbləğ', value: formatPrice(item.Supplies.Price) },
                                { key: 'Çeşid', value: item.Supplies.Positions },
                                { key: 'Miqdar', value: item.Supplies.Quantity },
                            ]
                        },
                        {
                            title: 'Ödənişlər',
                            items: [
                                { key: 'Mədaxil', value: formatPrice(item.Incomes.Amount) },
                                { key: 'Məxaric', value: formatPrice(item.Outcomes.Amount) }
                            ]
                        },
                        {
                            title: 'Qalıq borc',
                            items: [
                                { key: 'İlk borc', value: formatPrice(item.Settlements.firstAmount) },
                                { key: 'Son borc', value: formatPrice(item.Settlements.endAmount) }
                            ]
                        }
                    ];
                    setData(list);
                    setInfo({ ...item });
                } else {
                    setInfo("not");
                }
            })
            .catch(err => {
                ErrorMessage(err);
            });
    };
    
    useEffect(() => {
        fetchingData();
    }, [customer]);

    useEffect(() => {
        let time = setTimeout(() => {
            fetchingData();
        }, 300);

        return () => clearTimeout(time);
    }, [filter])

    return (
        <>
            <ListPagesHeader
                header={'Təchizatçı hesabatı'}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'docNumber'}
            />
            <View style={{
                flex: 1,
                backgroundColor: theme.bg,
                padding: 10,
                gap: 10
            }}>

                <CustomersModal
                    width={'100%'}
                    document={customer}
                    setDocument={setCustomer}
                    isDisable={false}
                    isName={true}
                />

                <DocumentTimes        
                    filter={filter}
                    setFilter={setFilter}
                    selected={selectedTime}
                    setSelected={setSelectedTime}
                />

                {info == null ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={40} color={theme.primary} />
                    </View>
                ) : info == 'not' ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                        <Text style={{ textAlign: 'center', color: theme.primary, fontWeight: 'bold' }}>Məlumat tapılmadı!</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.container}>
                        {data.map((section, index) => (
                            <CardItem
                                items={section.items}
                                title={section.title}
                                valueFormatPrice={true}
                            />
                        ))}
                    </ScrollView>
                )}


            </View>
        </>
    );
};

export default Comprehensive;
