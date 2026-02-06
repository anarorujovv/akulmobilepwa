import { FlatList, StyleSheet, Text, View } from 'react-native'
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
import { formatPrice } from '../../../services/formatPrice';

const CashToModal = ({
    document,
    setDocument,
}) => {

    const theme = useTheme();

    const [cashs, setCashs] = useState([]);
    const [cashModal, setCashModal] = useState(false);

    const fetchingCashes = async () => {
        await api('cashes/get.php', {
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCashs([...element.List]);
                } else {
                    setCashs(null)
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
                    setDocument(rel => ({ ...rel, ['CashToName']: item.Name }))
                    setDocument(rel => ({ ...rel, ['CashToId']: item.Id }));
                    setCashModal(false);
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
        if (cashModal && cashs != null && !cashs[0]) {
            fetchingCashes();
        }
    }, [cashModal])

    
    useEffect(() => {
        fetchingCashes();
    }, [])

    return (
        <>
            {
                cashs[0] ?
                    <Pressable
                        style={{
                            width: "100%",
                            alignItems: "center"
                        }}
                        onPress={() => {
                            setCashModal(true);
                        }}
                    >
                        <Input
                            isRequired={true}
                            width={'70%'}
                            disabled={true}
                            value={document.CashToName}
                            placeholder={'Hesaba'}
                        />
                        {
                            contains(cashs, document.CashToId) == null ? "" :
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '70%'
                                    }}
                                >
                                    <Text style={{ fontSize: 12, color: theme.red }}>Balans</Text>
                                    <Text style={{ fontSize: 12, color: theme.red }}>{formatPrice(contains(cashs, document.CashToId).Balance)} ₼</Text>
                                </View>

                        }
                    </Pressable>

                    :
                    <View style={{
                        width: '100%',
                        height: 55,
                        justifyContent: 'center',
                    }}>
                        <ActivityIndicator size={30} color={theme.primary} />
                    </View>
            }
            <MyModal
                modalVisible={cashModal}
                setModalVisible={setCashModal}
                width={'100%'}
                height={"100%"}
            >
                {
                    cashs == null ?
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
                                cashs[0] ?
                                    <FlatList
                                        data={cashs}
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
        </>
    )
}

export default CashToModal

const styles = StyleSheet.create({})