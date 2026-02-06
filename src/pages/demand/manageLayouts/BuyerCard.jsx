import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTheme from '../../../shared/theme/useTheme'
import api from '../../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage'
import { formatPrice } from '../../../services/formatPrice'
import applyDiscount from '../../../services/report/applyDiscount'
import pricingUtils from '../../../services/pricingUtils'
import { DemandGlobalContext } from '../../../shared/data/DemandGlobalState'
import Selection from './../../../shared/ui/Selection';
import mergeProductQuantities from '../../../services/mergeProductQuantities'
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore'

const BuyerCard = ({ changeSelection }) => {

    const { document, setDocument } = useContext(DemandGlobalContext)
    const local = useGlobalStore(state => state.local);
    const theme = useTheme();

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            flexDirection: 'row'
        }
    })

    const fetchingCustomerData = async (item) => {
        let info = { ...document };

        let obj = {
            id: item.Id,
            token: await AsyncStorage.getItem("token")
        }
        await api("customers/getdata.php", obj)
            .then(async element => {
                if (element != null) {

                    let customer = { ...element }

                    customer.CustomerData.Discount = formatPrice(customer.CustomerData.Discount);
                    info.CustomerInfo = customer;
                    info.CustomerId = item.Id;

                    if (customer.CustomerData.PriceTypeId != 0 && info.Positions[0]) {
                        let positions = [...info.Positions];
                        let obj = {
                            pricetype: customer.CustomerData.PriceTypeId,
                            products: positions.map(item => item.ProductId),
                            token: await AsyncStorage.getItem('token')
                        }
                        await api('/products/getproductsrate.php', obj).then(element => {
                            if (element != null) {
                                let list = element.List;
                                for (let index = 0; index < list.length; index++) {
                                    let productIndex = positions.findIndex(item => item.ProductId == list[index].ProductId);
                                    if (productIndex != -1) {
                                        positions[productIndex].Price = formatPrice(list[index].Price);
                                        positions[productIndex].BasicPrice = formatPrice(list[index].Price);
                                    }
                                }
                            }
                        })

                        info.Positions = positions;
                    }


                    if (info.Positions[0]) {

                        let positions = [...info.Positions];
                        for (let index = 0; index < positions.length; index++) {
                            positions[index].Price = applyDiscount(positions[index].BasicPrice, customer.CustomerData.Discount)
                            positions[index].Discount = customer.CustomerData.Discount
                        }
                        info.Positions = positions;
                    }

                }

                changeSelection();
                setDocument({ ...info, ...(pricingUtils(info.Positions)) });

            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    const fetchingStockData = async (item) => {
        let result = await mergeProductQuantities(document, item.Id);
        changeSelection();
        setDocument(result);
    }

    return (
        <>
            <ManageCard>
                <View style={styles.header}>
                    <Ionicons size={20} color={theme.grey} name='person' />
                    <Text style={{
                        color: theme.grey
                    }}>Qarşı-Tərəf</Text>
                </View>

                <View style={{
                    gap: 15,
                    alignItems: 'center'

                }}>

                    <Selection
                        isRequired={true}
                        apiBody={{}}
                        apiName={'customers/getfast.php'}
                        searchApi={'customers/getfast.php'}
                        change={fetchingCustomerData}
                        searchKey={'fast'}
                        title={'Qarşı-Tərəf'}
                        value={document.CustomerId}
                        defaultValue={document.CustomerName}
                        bottomText={local.demands.demand.customerDebt ? document.CustomerInfo != undefined ? formatPrice(document.CustomerInfo.Debt) : '0' : ""}
                        bottomTitle={'Qarşı-tərəf'}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '70%',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text style={{ fontSize: 12, color: theme.orange }}>{'Müştəri endirimi'}</Text>
                        <Text style={{ fontSize: 12, color: theme.black }}>{document.CustomerInfo != undefined ? formatPrice(document.CustomerInfo.CustomerData.Discount) : '0'} %</Text>
                    </View>

                    <Selection
                        isRequired={true}
                        apiBody={{}}
                        apiName={'stocks/get.php'}
                        change={fetchingStockData}
                        title={"Anbar"}
                        value={document.StockId}
                        defaultValue={document.StockName}
                    />

                </View>
            </ManageCard >
        </>
    )
}

export default BuyerCard
