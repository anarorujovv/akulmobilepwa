import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from '../../../shared/ui/Button';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import { DemandGlobalContext } from '../../../shared/data/DemandGlobalState';
import pricingUtils from '../../../services/pricingUtils';
import prompt from '../../../services/prompt';
import ListItem from '../../../shared/ui/list/ListItem';
import { Pressable } from '@react-native-material/core';
import AmountCalculated from '../../../shared/ui/AmountCalculated';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import MyModal from '../../../shared/ui/MyModal';
import AllChangeProductPriceType from '../../../shared/ui/AllChangeProductPriceType';

const ProductCard = ({ navigation, setHasUnsavedChanges }) => {

    const { document, setDocument, units, setUnits } = useContext(DemandGlobalContext);
    const permissions = useGlobalStore(state => state.permissions);
    const local = useGlobalStore(state => state.local);

    const [amountEditModal, setAmountEditModal] = useState(false);
    const [productLastPrice, setProductLastPrice] = useState(0);
    const [productLastPriceModal, setProductLastPriceModal] = useState(false);

    const theme = useTheme();

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center'
        }
    })

    const handleClickProductLastPrice = async (item) => {
        let obj = {
            customerid: document.CustomerId,
            moment: document.Moment,
            productid: item.ProductId,
            token: await AsyncStorage.getItem('token')
        }

        await api('lastdemandprice/get.php', obj).then(element => {
            setProductLastPrice(formatPrice(element.DocPrice))
            setProductLastPriceModal(true);
        }).catch(err => console.log(err));
    }

    return (
        <ManageCard>
            <View style={styles.header}>
                <Ionicons size={23} color={theme.grey} name='basket' />
                <Text style={{
                    color: theme.grey
                }}>Məhsul</Text>
            </View>
            
            <View style={{ width: '100%', alignItems: 'center', gap: 5 }}>

            <AllChangeProductPriceType document={document} setDocument={setDocument} 
            setHasUnsavedChanges={setHasUnsavedChanges}
            />

                {
                    document.Positions.map((item, index) => (
                        <ListItem
                            indexIsButtonIconPress={() => {
                                handleClickProductLastPrice(item);
                            }}
                            indexIsButtonIcon={<Ionicons name='information-circle-outline' size={30} color={theme.primary} />}
                            index={index + 1}
                            onLongPress={() => {
                                prompt('Məhsulu silməyə əminsiniz?', () => {
                                    let data = { ...document };
                                    data.Positions.splice(index, 1);
                                    setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                })
                                setHasUnsavedChanges(true);
                            }}
                            onPress={() => {
                                navigation.navigate('product-position', { product: item, state: document, setState: setDocument, type: 0, units: units, setUnits: setUnits, setHasUnsavedChanges: setHasUnsavedChanges, pricePermission: local.demands.demand.positionModalPrice })
                            }} firstText={item.Name} centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`} endText={formatPrice(item.StockQuantity)} priceText={local.demands.demandReturn.positionPrice ? formatPrice(item.Quantity * item.Price) : ""} />
                    ))

                }
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'center',
                    marginBottom: 30,
                    marginTop: 10
                }}>
                    <Button
                        onClick={() => {
                            navigation.navigate("product-list", {
                                state: document,
                                setState: setDocument,
                                type: 0,
                                units: units,
                                setUnits: setUnits,
                                setHasUnsavedChanges: setHasUnsavedChanges,
                                pricePermission: local.demands.demand.positionModalPrice
                            });
                        }}
                        width={'70%'}
                    >
                        Məhsul əlavə et
                    </Button>
                </View>

                {
                    local.demands.demand.sum ?
                        <>
                            {
                                permission_ver(permissions, 'mobilediscount', 'C') ? (
                                    <>
                                        <View style={{
                                            width: '70%',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ fontSize: 14, color: theme.grey }}>Ümumi alış məbləği</Text>
                                            <Text style={{ fontSize: 14, color: theme.grey }}>{formatPrice(document.BasicAmount)} ₼</Text>
                                        </View>
                                        <View style={{
                                            width: '70%',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ fontSize: 14, color: theme.grey }}>Endirim</Text>
                                            <Text style={{ fontSize: 14, color: theme.grey }}>{formatPrice(document.Discount)}%</Text>
                                        </View>
                                    </>
                                )
                                    :
                                    ""
                            }

                            <Pressable
                                onPress={() => {
                                    setAmountEditModal(true);
                                }}
                                style={{
                                    width: '70%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                <Text style={{ fontSize: 16, color: theme.black }}>Yekun məbləğ</Text>
                                <Text style={{ fontSize: 16, color: theme.black }}>{formatPrice(document.Amount)} ₼</Text>
                            </Pressable>
                        </>
                        :
                        ""
                }
            </View>
            <AmountCalculated
                modalVisible={amountEditModal}
                setModalVisible={setAmountEditModal}
                document={document}
                setDocument={setDocument}
                setHasUnsavedChanges={setHasUnsavedChanges}
            />

            <MyModal center={true} height={100} modalVisible={productLastPriceModal} setModalVisible={setProductLastPriceModal} width={250}>
                <View style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 25,
                        color: theme.primary,
                        marginBottom: 10
                    }}>SON SATIŞ QİYMƏTİ</Text>
                    <Text style={{
                        fontSize: 20,
                        color: theme.black,
                        fontWeight: 'bold'
                    }}>{productLastPrice} AZN</Text>
                </View>
            </MyModal>
        </ManageCard>
    )
}

export default ProductCard
