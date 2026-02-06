import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import SearchHeader from './../SearchHeader';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';
import Input from '../Input';
import { formatPrice } from '../../../services/formatPrice';

const CustomersModal = ({
    document,
    setDocument,
    isDisable,
    isName,
    width,
    returnChanged,
    isDebtPermission = true
}) => {

    const theme = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [customerDebt, setCustomerDebt] = useState(null);

    const fetchingCustomers = async () => {
        await api('customers/get.php', {
            token: await AsyncStorage.getItem('token'),
            sr: "Name",
            lm: 40
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCustomers([...element.List]);
                } else {
                    setCustomers(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })

        if (document.CustomerName != '') {
            fetchingCustomerDebt(document.CustomerId);
        }
    }

    const fetchingCustomerDebt = async (id) => {
        await api('customers/getdata.php', {
            id: id,
            token: await AsyncStorage.getItem('token')
        })
            .then(element => {
                if (element != null) {
                    setCustomerDebt(formatPrice(element.Debt));
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    const fetchingFastCustomers = async () => {
        await api("customers/getfast.php", {
            fast: search,
            token: await AsyncStorage.getItem("token")
        }).then(async element => {
            if (element != null) {
                if (element.List[0]) {
                    setCustomers([...element.List]);
                } else {
                    setCustomers(null);
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })

    }

    const handleSelectCustomer = async (item) => {
        await fetchingCustomerDebt(item.Id);
        setDocument(rel => ({ ...rel, ['CustomerName']: item.Name }))
        setDocument(rel => ({ ...rel, ['CustomerId']: item.Id }));
        setModalVisible(false);
    }

    const renderItem = ({ item, index }) => {

        return (
            <>
                <Pressable onPress={() => {
                    handleSelectCustomer(item);
                    if (returnChanged) {
                        returnChanged();
                    }
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
        if (!modalVisible) {
            setSearch(null);
        }
    }, [modalVisible])

    useEffect(() => {
        let time;
        if (search != null) {
            setCustomers([])
            if (search != "") {
                time = setTimeout(() => {
                    fetchingFastCustomers();
                }, 400);
            } else {
                fetchingCustomers();
            }
        }
        return () => clearTimeout(time);
    }, [search])

    return (
        <>
            <Pressable
                style={{
                    width: '100%',
                    alignItems: 'center'
                }}
                disabled={isDisable}
                onPress={() => {
                    if (!isDisable) {
                        setModalVisible(true);
                    }
                }}
            >
                <Input
                    isRequired={true}
                    width={width}
                    disabled={true}
                    value={document.CustomerName == null ? "" : document.CustomerName}
                    placeholder={!isName ? 'Qarşı-tərəf' : "Təchizatçı"}
                />
                {
                    isDebtPermission ?
                        customerDebt != null ?
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: width,
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text style={{ fontSize: 12, color: theme.orange }}>Qalıq borc</Text>
                                <Text style={{ fontSize: 12, color: customerDebt >= 0 ? theme.black : theme.orange }}>{customerDebt} ₼</Text>
                            </View>
                            :
                            ""
                        :
                        ""
                }
            </Pressable>
            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={"100%"}
            >
                <SearchHeader
                    placeholder={'Müştəri axtarışı...'}
                    value={search}
                    onChange={(e) => {
                        setSearch(e)
                    }}
                    onPress={() => {
                        setModalVisible(false)
                    }}
                />

                {
                    customers == null ?
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
                                customers[0] ?
                                    <FlatList
                                        data={customers}
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

export default CustomersModal

const styles = StyleSheet.create({})