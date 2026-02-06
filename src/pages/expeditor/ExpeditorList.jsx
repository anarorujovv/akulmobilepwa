import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useTheme from '../../shared/theme/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../services/formatPrice';
import getDateByIndex from '../../services/report/getDateByIndex';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import Selection from '../../shared/ui/Selection'
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';

const ExpeditorList = ({ navigation }) => {

    const theme = useTheme();

    const permissions = useGlobalStore(state => state.permissions)
    const [cashes, setCashes] = useState([]);
    const [demandSums, setDemandSums] = useState([]);
    const [paymentSums, setPaymentSums] = useState([]);
    const [debtSums, setDebtsSums] = useState([]);
    const [customerOrderAndMoveSums, setCustomerOrderAndMoves] = useState([])
    const [dateFilter, setDateFilter] = useState({
        ...getDateByIndex(0)
    })
    const [selectedTime, setSelectedTime] = useState(0);
    const [owner, setOwner] = useState(null);

    const renderCard = (title, icon, items, style = {}) => (
        <View onPress={() => {
        }} style={[styles.cardContainer, style, { backgroundColor: theme.whiteGrey }]}>
            <View style={styles.cardHeader}>
                {icon}
                <Text style={[styles.cardTitle, { color: theme.primary }]}>{title}</Text>
            </View>
            <View style={styles.cardContent}>

                {
                    items != null ?
                        items[0] ?
                            items.map((item, index) => (
                                <TouchableOpacity onPress={() => {
                                    if (item.navParams == undefined) {
                                        navigation.navigate(item.navName)
                                    } else {
                                        navigation.navigate(item.navName, { ...item.navParams });
                                    }
                                }} key={index} style={styles.cardItem}>
                                    <Text style={[styles.cardItemKey, { color: theme.primary, textDecorationLine: "underline" }]}>{item.key}</Text>
                                    <Text style={[styles.cardItemValue, { color: theme.black }]}>{item.value}</Text>
                                </TouchableOpacity>
                            ))
                            :
                            <View>
                                <ActivityIndicator size={30} color={theme.primary} />
                            </View>
                        :
                        ""
                }

            </View>
        </View>
    );


    async function fetchingCashes() {
        let obj = {
            token: await AsyncStorage.getItem('token'),
            dr: 0,
            lm: 100,
            pg: 0,
            ownerName: owner
        }
        await api('cashes/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (element.List[0]) {
                        setCashes(element.List);
                    } else {
                        setCashes(null);
                    }
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    async function fetchingDemandAmounts() {
        let obj = {
            dr: 0,
            lm: 100,
            pg: 0,
            ownerName: owner,
            token: await AsyncStorage.getItem('token'),
            ...dateFilter
        }

        let arr = [

        ]

        let demand = await api('demands/get.php', obj)
        let demandReturn = await api('demandreturns/get.php', obj);

        if (demand != null) {
            arr.push({
                key: 'Satış',
                value: formatPrice(demand.AllSum),
                navName: "demand"
            })
        } else {
            arr.push({
                key: 'Satış',
                value: 0,
                navName: "demand"
            })
        }

        if (demandReturn != null) {
            arr.push({
                key: 'İadə',
                value: formatPrice(demandReturn.AllSum),
                navName: 'demandreturns'
            })
        } else {
            arr.push({
                key: 'İadə',
                value: 0,
                navName: 'demandreturns'
            })
        }

        setDemandSums(arr);

    }

    async function fetchingPaymentAmounts() {
        let obj = {
            advance: 'hide',
            dr: 1,
            lm: 100,
            pg: 0,
            sr: 'Moment',
            ownerName: owner,
            token: await AsyncStorage.getItem('token'),
            ...dateFilter
        }

        let paydirs = [
            'i',
            'o'
        ]

        let list = [

        ]

        for (let index = 0; index < paydirs.length; index++) {
            let payType = paydirs[index];
            await api('transactions/get.php', {
                ...obj,
                paydir: paydirs[index]
            })
                .then(element => {
                    if (element != null) {
                        list.push(
                            {
                                key: payType == 'i' ? 'Mədaxil' : "Məxaric",
                                value: formatPrice(payType == 'i' ? element.InSum : element.OutSum),
                                navName: 'transactions'
                            }
                        )
                    }
                })
                .catch(err => {
                    ErrorMessage(err)
                })
        }

        setPaymentSums(list);

    }

    async function fetchingDebtAmounts() {
        let obj = {
            ar: null,
            dr: 0,
            gp: null,
            lm: 100,
            pg: 0,
            sr: 'CustomerName',
            ownerName: owner,
            ownerid: owner,
            token: await AsyncStorage.getItem('token'),
            zeors: 3,
        }

        await api('settlements/get.php', obj).then((element) => {
            if (element != null) {
                setDebtsSums([
                    {
                        key: 'Alınacaq',
                        value: formatPrice(element.AllInSum),
                        navName: "settlements"
                    },
                    {
                        key: 'Veriləcək',
                        value: formatPrice(element.AllOutSum),
                        navName: 'settlements'
                    }
                ])
            }
        })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    async function fetchingCustomerOrderAndMoveAllSum() {
        let list = [

        ]
        let result = await api('customerorders/get.php', {
            dr: 1,
            lm: 100,
            pg: 0,
            sr: 'Moment',
            ownerName: owner,
            token: await AsyncStorage.getItem('token'),
            ...dateFilter
        })

        if (result != null) {
            list.push({
                key: 'Sifariş',
                value: formatPrice(result.AllSum),
                navName: "customerorders"
            })
        }

        let move = await api('moves/get.php', {
            dr: 1,
            lm: 100,
            pg: 0,
            sr: 'Moment',
            ownerName: owner,
            token: await AsyncStorage.getItem('token'),
            ...getDateByIndex(0)
        })

        if (move != null) {
            list.push({
                key: 'Yerdəyişmə',
                value: formatPrice(move.AllSum),
                navName: "move"
            })
        }

        setCustomerOrderAndMoves(list);

    }

    async function fetchOwner() {
        await api('permissions/get.php', {
            token: await AsyncStorage.getItem('token')
        }).then(element => {
            if (element != null) {
                setOwner(element.OwnerId);
            }
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        fetchOwner();
    }, [])

    useEffect(() => {
        if (owner != null) {
            fetchingCashes();
            fetchingDebtAmounts();
        }
    }, [owner])

    useEffect(() => {
        if (owner != null) {
            if (demandSums[0]) {
                setDemandSums([]);
            }

            if (customerOrderAndMoveSums[0]) {
                setCustomerOrderAndMoves([])
            }

            if (paymentSums[0]) {
                setPaymentSums([])
            }

            fetchingDemandAmounts();
            fetchingPaymentAmounts();
            fetchingCustomerOrderAndMoveAllSum();
        }
    }, [dateFilter, owner])

    return (
        <View style={{
            flex: 1,
        }}>

            <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
                <Text style={[styles.headerText, { color: theme.primary, marginTop: 10 }]}>Distributorlar</Text>
                {
                    permission_ver(permissions, 'owner', 'R') ?
                        owner != null ?
                            <Selection
                                apiBody={{}}
                                apiName={'owners/get.php'}
                                change={(e) => {
                                    setOwner(e.Id)
                                }}
                                title={'Cavabdeh'}
                                value={owner}
                            />
                            :
                            ""
                        :
                        ""
                }
                <DocumentTimes
                    filter={dateFilter}
                    setFilter={setDateFilter}
                    selected={selectedTime}
                    setSelected={setSelectedTime}
                />
                {(
                    <View style={styles.gridContainer}>

                        {renderCard(
                            'Satışlar',
                            <Icon name="cart-outline" size={24} color={theme.orange} />,
                            [
                                ...demandSums
                            ]
                        )
                        }

                        {renderCard(
                            'Distributor',
                            <AntDesign name="isv" size={24} color={theme.primary} />,
                            [
                                ...customerOrderAndMoveSums
                            ]
                        )}




                        {renderCard(
                            'Ödənişlər',
                            <Icon name="cash-multiple" size={24} color={theme.pink} />,
                            [
                                ...paymentSums
                            ]
                        )}

                        {renderCard(
                            'Borclar',
                            <Icon name="bank" size={24} color={theme.red} />,
                            [
                                ...debtSums
                            ]
                        )}

                        {renderCard(
                            'Balans',
                            <Entypo name="wallet" size={24} color={theme.orange} />,
                            cashes == null ?
                                null :
                                cashes[0] ?
                                    cashes.map(element => ({
                                        key: element.Name, value: formatPrice(element.Balance), navName: "cashe-manage", navParams: {
                                            id: element.Id,
                                            name: element.Name,
                                            balance: formatPrice(element.Balance)
                                        }
                                    }))
                                    :
                                    [],
                            { width: '100%' }
                        )}

                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 15,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        width: '100%',
    },
    cardContainer: {
        width: '45%',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    cardContent: {
        marginTop: 10,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cardItemKey: {
        fontSize: 14,
    },
    cardItemValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    chartContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartScrollContainer: {
        paddingHorizontal: 10,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ExpeditorList;
