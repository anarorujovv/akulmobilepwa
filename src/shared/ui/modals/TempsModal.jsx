import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';
import getTemplates from '../../../services/getTemplates';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { formatPrice } from '../../../services/formatPrice';

const TempsModal = ({
    modalVisible,
    setModalVisible,
    name,
    document,
    navigation,
    type,
    priceList
}) => {

    const theme = useTheme();

    let navigationName = 'print-and-share'

    const [temps, setTemps] = useState([]);

    const fetchingTemps = async () => {
        getTemplates(name).then(res => {
            if (res[0]) {
                setTemps(res);
            } else {
                setTemps(null);
            }
        }).catch(err => {
            ErrorMessage(err);
        })
    }

    const handleSelectPrint = async (item) => {
        let obj = {
            TemplateId: item.Id,
            token: await AsyncStorage.getItem("token")
        }

        if (type) {
            obj.List = [
                {
                    Price: formatPrice(document.Price),
                    ProductId: document.Id,
                    Quantity: 1,
                }
            ]

        } else if (priceList) {
            if (document.Positions[0]) {
                obj.List = document.Positions.map(rel => ({
                    Price: formatPrice(rel.Price),
                    ProductId: rel.ProductId,
                    Quantity: rel.Quantity
                }))
            } else {
                ErrorMessage('Məhsul tapılmadı');
                return;
            }
        }
        else {
            obj.Id = document.Id;
        }

        let publicMode = await AsyncStorage.getItem('publicMode');

        axios({
            method: 'POST',
            url: type || priceList ? `https://api.akul.az/1.0/${publicMode}/controllers/products/pricelist.php
` : `https://api.akul.az/1.0/${publicMode}/controllers/${name}/print.php`,
            data: obj,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
            }
        }).then(res => {
            if (res.status == 200) {
                navigation.navigate(navigationName, { html: res.data })
                setModalVisible(false);
            }
        }).catch(err => {
            ErrorMessage(err);
        })
    }

    const renderItem = ({ item, index }) => {

        return (

            <>
                <Pressable onPress={() => {
                    handleSelectPrint(item);
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
        if (modalVisible && temps != null && !temps[0]) {
            fetchingTemps();
        }

        if (!modalVisible) {
            setTemps([])
        }
    }, [modalVisible])

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
            height={"100%"}
        >
            {
                temps == null ?
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
                            temps == null ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Məlumat tapılmadı...</Text>
                                </View>
                                :
                                temps[0] ?
                                    <FlatList
                                        data={temps}
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

export default TempsModal

const styles = StyleSheet.create({})