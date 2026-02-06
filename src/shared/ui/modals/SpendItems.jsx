import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';
import Input from '../Input';
import contains from '../../../services/contains';

const SpendItemsModal = ({
    modalVisible,
    setModalVisible,
    document,
    setDocument,
    target,
    types
}) => {

    const theme = useTheme();
    const [spendItems, setSpendItems] = useState([]);

    const fetchingSpendItems = async () => {
        await api('spenditems/get.php', {
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setSpendItems([...element.List]);
                } else {
                    setSpendItems(null);
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const renderItem = (item, index) => {
        return (
            <>
                <Pressable onPress={() => {
                    setDocument(rel => ({ ...rel, ['SpendItem']: item.Id }));
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
        if (modalVisible && spendItems != null && !spendItems[0]) {
            fetchingSpendItems();
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingSpendItems();
    }, [])

    return (
        <>
            {
                spendItems[0] ?
                    <Pressable
                        style={{
                            width: '100%',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            if (types.direct == 'outs') {
                                setModalVisible(true);
                            }
                        }}
                    >
                        <Input
                            isRequired={true}
                            width={'70%'}
                            disabled={true}
                            value={contains(spendItems, document.SpendItem) == null ? "" : contains(spendItems, document.SpendItem).Name}
                            placeholder={"Xərc maddəsi"}
                        />

                    </Pressable>
                    :
                    <View style={{
                        width: '100%',
                        height: 55,
                        justifyContent: 'center'
                    }}>
                        <ActivityIndicator size={30} color={theme.primary} />
                    </View>
            }
            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={"100%"}
            >
                {
                    spendItems == null ?

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
                            <ScrollView>
                                {
                                    spendItems[0] ?
                                        spendItems.map((item, index) => (
                                            renderItem(item, index)
                                        ))
                                        :
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <ActivityIndicator size={40} color={theme.primary} />
                                        </View>
                                }
                            </ScrollView>
                        </View>
                }
            </MyModal>
        </>
    )
}

export default SpendItemsModal

const styles = StyleSheet.create({})