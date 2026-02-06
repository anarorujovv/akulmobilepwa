import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';

const CustomerGroupsModal = ({
    modalVisible,
    setModalVisible,
    setProduct,
}) => {

    const theme = useTheme();

    const [customerGroups, setCustomerGroups] = useState([]);

    const fetchingCustomerGroups = async () => {
        await api('customergroups/get.php', {
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCustomerGroups([...element.List]);
                } else {
                    setCustomerGroups(null)
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
                    setProduct(rel => ({ ...rel, ['GroupName']: item.Name }))
                    setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
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
        if (modalVisible && customerGroups != null && !customerGroups
        [0]) {
            fetchingCustomerGroups();
        }

        if (!modalVisible) {
            setCustomerGroups([])
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingCustomerGroups();
    }, [])

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
            height={"100%"}
        >
            {
                customerGroups == null ?
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
                            customerGroups[0] ?
                                <FlatList
                                    data={customerGroups}
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

export default CustomerGroupsModal

const styles = StyleSheet.create({})