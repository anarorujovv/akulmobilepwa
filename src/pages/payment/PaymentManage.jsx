import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import MainCard from '../payment/manageLayouts/MainCard';
import { PaymentGlobalContext } from '../../shared/data/PaymentGlobalState';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OppositeCard from './manageLayouts/OppositeCard';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentCard from './manageLayouts/DocumentCard';
import ManageHeader from '../../shared/ui/ManageHeader';
import { formatObjectKey } from '../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import moment from 'moment';
import Button from '../../shared/ui/Button';
import { formatPrice } from '../../services/formatPrice';
import prompt from '../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import payByRange from './../../services/report/payByRange';
import playSound from '../../services/playSound';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';

const PaymentManage = ({ route, navigation }) => {

    let { id, type, direct, cost, routeByDocument } = route.params;

    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const permissions = useGlobalStore(state => state.permissions)

    const {
        document,
        setDocument,
        types,
        setTypes
    } = useContext(PaymentGlobalContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: theme.whiteGrey
        }
    })

    const fetchDefaultSelectedValues = async (obj) => {
        let data = { ...obj };

        data.CustomerId = routeByDocument.CustomerId;
        data.CustomerName = routeByDocument.CustomerName;

        await api('spenditems/get.php', {
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    data.SpendItem = element.List[0].Id;
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })

        await api('cashes/get.php', {
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    data.CashId = element.List[0].Id;
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })

        return { ...data };

    }

    const fetchingPaymentData = async (type, direct, id) => {

        try {
            let obj = {}
            if (id == null) {
                obj = {
                    Amount: "0",
                    Name: "",
                    Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    CustomerId: "",
                    CustomerName: "",
                    CashId: "",
                    CashName: "",
                    SpendItem: "",
                    Modifications: [{}],
                    Status: true,
                    OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
                    DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
                    Description: ""
                }

                if (!permission_ver(permissions, 'payment_status', 'R')) {
                    obj.Status = false;
                }

                if (direct !== 'outs') {
                    obj.SpendItem = '2232d344-142b-44f3-b2b8-ea4c5add0b31'
                }

                await api(type + direct + '/newname.php', {
                    n: "", token: await AsyncStorage.getItem('token')
                }).then(element => {
                    if (element != null) {
                        obj.Name = element.ResponseService;
                    }
                }).catch(err => {
                    ErrorMessage(err)
                })
            } else {
                let url = `${type + direct}/get.php`
                let documentData = await api(url, {
                    id: id,
                    token: await AsyncStorage.getItem('token')
                })


                obj = { ...documentData.List[0] };
                obj.Amount = formatObjectKey(obj.Amount);
            }

            let spendItems = [];
            await api('spenditems/get.php', {
                token: await AsyncStorage.getItem('token')
            }).then(element => {
                if (element != null) {

                    spendItems = [...element.List];
                }
            }).catch(err => {
                ErrorMessage(err)
            })

            if (cost) {
                obj.CustomerId = "00000000-0000-0000-0000-000000000000";
                obj.CustomerName = "Şirkətim"
            }

            if (direct == "ins") {
                obj.SpendItemName = spendItems[0].Name;
                obj.SpendItemId = spendItems[0].Id;
            }

            if (!obj.Modifications[0]) {
                obj.Modifications = [{}]
            }

            obj.Amount = formatPrice(obj.Amount);
            if (routeByDocument) {
                obj = await fetchDefaultSelectedValues(obj);
            }
            setDocument(obj);

        } catch (err) {
            ErrorMessage(err)
        }

        setHasUnsavedChanges(false);
    }


    const handleSave = async () => {

        setLoading(true)
        let data = { ...document };
        let keyLowerFormatData = formatObjectKey(data);

        if (keyLowerFormatData.customerid == "" || keyLowerFormatData.cashid == "" || keyLowerFormatData.spenditem == "") {
            ErrorMessage("Vacib xanaları doldurun!");
            setLoading(false);
            return null;
        } else {
            keyLowerFormatData.token = await AsyncStorage.getItem('token');
            if (routeByDocument != undefined) {
                keyLowerFormatData.link = routeByDocument.Id;
            }
            keyLowerFormatData.modifications = await buildModificationsPayload(keyLowerFormatData.modifications[0], `${(types.type + types.direct).slice(0, -1)}`)

            let payAmount = formatPrice(keyLowerFormatData.amount);
            let obj = {}
            let documentAmount = 0;
            let paydir = 0;
            if (routeByDocument) {
                documentAmount = formatPrice(routeByDocument.Amount);
                paydir = await payByRange(routeByDocument, payAmount, documentAmount);

                obj = {
                    action: 'payed',
                    list: [
                        routeByDocument.Id,
                    ],
                    token: await AsyncStorage.getItem('token'),
                    value: paydir
                }
            }

            if (paydir == 4) {
                ErrorMessage("Ödənilmiş məbləğ müqavilənin ödənilmə məbləğindən çoxdur")
            }

            await api(types.type + types.direct + '/newname.php', {
                n: "", token: await AsyncStorage.getItem('token')
            }).then(element => {
                if (element != null) {
                    console.log(element);
                    keyLowerFormatData.name = element.ResponseService;
                }
            }).catch(err => {
                ErrorMessage(err)
            })

            let answer = await api(`${types.type + types.direct}/put.php`, keyLowerFormatData).then(async element => {
                if (element != null) {

                    SuccessMessage("Yadda Saxlanıldı")
                    fetchingPaymentData(types.type, types.direct, element.ResponseService);
                    playSound('success');

                    if (routeByDocument != undefined) {
                        await api(`${routeByDocument.target}/bash.php`, obj);
                    }

                    return element.ResponseService
                }
            }).catch(err => {
                ErrorMessage(err)
            })
            setLoading(false)
            return answer;
        }
    }

    const fetchNewName = async () => {
        await api(types.type + types.direct + '/newname.php', {
            n: "", token: await AsyncStorage.getItem('token')
        }).then(element => {
            if (element != null) {
                let data = { ...document };
                data.Name = element.ResponseService;
                console.log(element.ResponseService);
                setDocument(data);
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const hasUnsavedChangesFunction = () => {
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }

    const handleChangeInput = (key, value) => {
        setDocument(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    const handleChangeSelection = (key, value) => {
        setDocument(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    useEffect(() => {
        setTypes(rel => ({ ...rel, ['type']: type }))
        setTypes(rel => ({ ...rel, ['direct']: direct }))
        fetchingPaymentData(type, direct, id);
    }, [])

    useEffect(() => {
        if (types.type != "" && document !== null) {
            setDocument(rel => ({ ...rel, ['CashName']: "" }));
            setDocument(rel => ({ ...rel, ['CashId']: "" }));
            fetchNewName();
        }
    }, [types.type])

    useFocusEffect(

        useCallback(() => {
            const onBackPress = async () => {
                navigation.setParams({ shouldGoToSpecificPage: false });
                hasUnsavedChanges ? prompt('Çıxmağa əminsiniz ?', () => navigation.goBack()) : (navigation.goBack());
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [hasUnsavedChanges]))

    return (
        <View style={styles.container}>

            {
                !routeByDocument &&
                <ManageHeader
                    navigation={navigation}
                    print={type + direct}
                    document={document}
                    onSubmit={handleSave}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
            }

            {
                document !== null ?
                    <>
                        <ScrollView>
                            <>
                                <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} type={type} direct={direct} navigation={navigation} id={id} />
                                <View style={{ margin: 10 }} />
                                <OppositeCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} cost={cost} />
                                <View style={{ margin: 10 }} />
                                <DocumentCard changeInput={handleChangeInput} cost={cost} />
                                <View style={{ margin: 10 }} />
                                <ModificationsCard
                                    hasUnsavedChanged={setHasUnsavedChanges}
                                    setState={setDocument}
                                    state={document}
                                    target={`${(types.type + types.direct).slice(0, -1)}`}
                                />
                            </>
                        </ScrollView>
                        {
                            hasUnsavedChanges ?
                                <Button
                                    bg={theme.green}
                                    disabled={loading}
                                    isLoading={loading}
                                    onClick={handleSave}
                                >
                                    Yadda Saxla
                                </Button>
                                :
                                ""
                        }
                    </>
                    :
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '40%'
                    }}>
                        <ActivityIndicator size={40} color={theme.primary} />
                    </View>
            }

        </View>

    )
}

export default PaymentManage
