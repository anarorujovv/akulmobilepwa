import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from '../../../shared/ui/Button';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import { SupplyReturnGlobalContext } from '../../../shared/data/SupplyReturnGlobalState';
import pricingUtils from '../../../services/pricingUtils';
import prompt from './../../../services/prompt';
import ListItem from '../../../shared/ui/list/ListItem';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import AmountCalculated from '../../../shared/ui/AmountCalculated';
import { Pressable } from '@react-native-material/core';
import permission_ver from '../../../services/permissionVerification';

const ProductCard = ({ navigation, setHasUnsavedChanges }) => {

    const { document, setDocument, units, setUnits } = useContext(SupplyReturnGlobalContext)
    const [modal, setModal] = useState(false);
    const permissions = useGlobalStore(state => state.permissions);

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

    return (
        <ManageCard>
            <View style={styles.header}>
                <Ionicons size={23} color={theme.grey} name='basket' />
                <Text style={{
                    color: theme.grey
                }}>Məhsul</Text>
            </View>
            <View style={{ width: '100%', alignItems: 'center', gap: 5 }}>

                {
                    document.Positions.map((item, index) => {
                        return (
                            <ListItem index={index + 1} onLongPress={() => {
                                prompt('Məhsulu silməyə əminsiniz?', () => {
                                    let data = { ...document };
                                    data.Positions.splice(index, 1);
                                    setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                }
                                );
                            }} onPress={() => {
                                navigation.navigate('product-position', { product: item, state: document, setState: setDocument, type: 1, units: units, setUnits: setUnits, setHasUnsavedChanges: setHasUnsavedChanges })
                            }} firstText={item.Name} centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`} endText={formatPrice(item.StockQuantity)} priceText={formatPrice(item.Quantity * item.Price)} />
                        )
                    })
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
                                type: 1,
                                units: units,
                                setUnits: setUnits,
                                setHasUnsavedChanges: setHasUnsavedChanges
                            });
                        }}
                        width={'70%'}
                    >
                        Məhsul əlavə et
                    </Button>
                </View>
                <>
                    {
                        permission_ver(permissions ,'mobilediscount', 'C') && (
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
                    }
                    <Pressable
                        onPress={() => {
                            setModal(true);
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
            </View>
            <AmountCalculated
                setHasUnsavedChanges={setHasUnsavedChanges}
                document={document}
                setDocument={setDocument}
                modalVisible={modal}
                setModalVisible={setModal}
            />
        </ManageCard>
    )
}

export default ProductCard
