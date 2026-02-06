import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BuyerCard from './manageLayouts/BuyerCard'
import ProductCard from './manageLayouts/ProductCard'
import pricingUtils from '../../services/pricingUtils'
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import { DemandReturnGlobalContext } from '../../shared/data/DemandReturnGlobalState';
import mergeProductQuantities from '../../services/mergeProductQuantities';
import Button from '../../shared/ui/Button';
import prompt from '../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import DestinationCard from '../../shared/ui/DestinationCard';
import calculateUnit from '../../services/report/calculateUnit';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ReleatedDocuments from '../../shared/ui/ReleatedDocuments';
import moment from 'moment';
import playSound from '../../services/playSound';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
const DemandReturnManage = ({ route, navigation }) => {

    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.whiteGrey
        }
    })

    let { id, routeByDocument, dataUnits } = route.params;
    const { document, setDocument, units, setUnits } = useContext(DemandReturnGlobalContext);
    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const permissions = useGlobalStore(state => state.permissions);

    const fetchingDocument = async (id) => {

        if (id == null) {
            let obj = {
                Name: "",
                CustomerId: "",
                CustomerName: "",
                Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                StockId: "",
                StockName: "",
                Modifications: [{}],
                Positions: [],
                Consumption: 0,
                Status: false,
                Amount: 0,
                Discount: 0,
                BasicAmount: 0,
                OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
                DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
                Description: ""
            }

            if (permission_ver(permissions, 'demandreturnactivate', 'R')) {
                obj.Status = true;
            }

            if (routeByDocument) {
                obj = { ...routeByDocument };
                setUnits(dataUnits);
                setHasUnsavedChanges(true);
            }

            await api('demandreturns/newname.php', {
                n: "",
                token: await AsyncStorage.getItem("token")
            }).then(element => {
                if (element != null) {
                    obj.Name = element.ResponseService;
                }
            }).catch(err => {
                ErrorMessage(err)
            })

            setDocument(obj);
        } else {
            let obj = {
                id: id,
                token: await AsyncStorage.getItem('token')
            }
            await api('demandreturns/get.php', obj)
                .then(async element => {

                    let documentData = { ...element.List[0] };
                    documentData.BasicAmount = 0;

                    if (documentData.Positions[0]) {

                        for (let index = 0; index < documentData.Positions.length; index++) {
                            documentData.Positions[index].BasicPrice = formatPrice(documentData.Positions[index].SalePrice)
                        }

                    }
                    
                    if (documentData != null) {
                        await api('customers/getdata.php', {
                            id: documentData.CustomerId,
                            token: await AsyncStorage.getItem('token')

                        }).then(async item => {

                            if (item != null) {

                                documentData.CustomerInfo = item;
                                documentData.CustomerInfo.CustomerData.Id = documentData.CustomerId
                                documentData.CustomerInfo.CustomerData.Discount = formatPrice(documentData.CustomerInfo.CustomerData.Discount)

                                let result = await mergeProductQuantities(documentData, documentData.StockId);
                                let positions = calculateUnit(element.PositionUnits, result.Positions, "GET");

                                setUnits(element.PositionUnits);
                                if (!result.Modifications[0]) {
                                    result.Modifications = [{}];
                                }
                                setDocument({ ...result, ...(pricingUtils(positions)) });
                            }

                        }).catch(err => {
                            ErrorMessage(err)
                        })
                    }
                })
                .catch(err => {
                    ErrorMessage(err)
                })
        }
    }

    const handleSave = async () => {

        setLoading(true)

        let demandInfo = { ...document }
        let info = { ...formatObjectKey(demandInfo) };

        info.positions = calculateUnit(units, info.positions, "POST");

        if (info.customerid == "" || info.stockid == "") {
            ErrorMessage("Vacib xanaları doldurun!");
            setLoading(false);
            return null;
        } else {
            if (info.name == "") {
                await api('demandreturns/newname.php', {
                    n: "",
                    token: await AsyncStorage.getItem("token")
                }).then(element => {
                    if (element != null) {
                        info.name = element.ResponseService;
                    }
                }).catch(err => {
                    ErrorMessage(err)
                })
            }
            info.modifications = await buildModificationsPayload(info.modifications[0], 'demandreturn');
            info.token = await AsyncStorage.getItem("token")

            let answer = await api('demandreturns/put.php', info).then(async element => {
                if (element != null) {

                    SuccessMessage("Yadda saxlanıldı.");
                    fetchingDocument(element.ResponseService);
                    setHasUnsavedChanges(false);
                    playSound('success');
                    
                    return element.ResponseService;

                }
            }).catch(err => {
                ErrorMessage(err)
            })

            setLoading(false);
            return answer || null;
        }


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
        fetchingDocument(id);
    }, [])

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
                document == null ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={40} color={theme.primary} />
                    </View>
                    :
                    <>
                        <ManageHeader
                            navigation={navigation}
                            print={'demandreturns'}
                            document={document}
                            hasUnsavedChanges={hasUnsavedChanges}
                            onSubmit={handleSave}
                        />

                        <ScrollView>
                            <View style={{
                                gap: 20
                            }}>
                                <MainCard navigation={navigation} id={id} />
                                <BuyerCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} />
                                <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} navigation={navigation} />
                                <DestinationCard
                                    changeInput={handleChangeInput}
                                    changeSelection={handleChangeSelection}
                                    document={document}
                                    setDocument={setDocument}
                                />
                                <ModificationsCard
                                    target={'demandreturn'}
                                    setState={setDocument}
                                    state={document}
                                    hasUnsavedChanged={setHasUnsavedChanges}
                                />

                                {
                                    routeByDocument ?
                                        ""
                                        :
                                        <ReleatedDocuments
                                            shouldDisable={true}
                                            document={{ ...document, target: 'demandreturns' }}
                                            navigation={navigation}
                                            payment={'ins'}
                                            selection={[]}
                                            hasUnsavedChanged={hasUnsavedChanges}
                                            onSubmit={handleSave}
                                        />
                                }

                            </View>
                        </ScrollView>
                        {
                            hasUnsavedChanges ?
                                <Button
                                    onClick={handleSave}
                                    bg={theme.green}
                                    disabled={loading}
                                    isLoading={loading}
                                >
                                    Yadda Saxla
                                </Button>
                                :
                                ''
                        }
                    </>
            }
        </View>
    )
}

export default DemandReturnManage
