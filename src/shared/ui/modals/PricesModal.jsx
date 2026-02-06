import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';
import useGlobalStore from '../../data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';

const PricesModal = ({
    modalVisible,
    setModalVisible,
    pressable
}) => {

    const theme = useTheme();

    const permissions = useGlobalStore(state => state.permissions);

    const [prices, setPrices] = useState([]);

    const fetchingPrices = async () => {
        await api('pricetypes/get.php', {
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    if (!permission_ver(permissions, 'sub_buy_price', 'R')) {
                        setPrices([...element.List].filter(item => item.Id != 9999));
                        console.log([...element.List].filter(item => item.Id != 9999))
                    } else {
                        setPrices([...element.List]);
                    }
                } else {
                    setPrices(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                <Pressable onPress={() => {
                    pressable(item);
                    setModalVisible(false);
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
    }


    useEffect(() => {
        if (modalVisible && prices != null && !prices[0]) {
            fetchingPrices();
        }

        if (!modalVisible) {
            setPrices([])
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingPrices();
    }, [])

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
            height={"100%"}
        >
            {
                prices == null ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 16,
                            color: theme.primary
                        }}>Məlumat tapılmadı...</Text>
                    </View>
                    :
                    <View style={{
                        width: '100%',
                        height: '100%'
                    }}>
                        {
                            prices[0] ?
                                <FlatList
                                    data={prices}
                                    renderItem={renderItem}
                                />
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
            }
        </MyModal>
    )
}

export default PricesModal

const styles = StyleSheet.create({})