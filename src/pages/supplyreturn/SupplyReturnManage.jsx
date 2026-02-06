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
import { SupplyReturnGlobalContext } from '../../shared/data/SupplyReturnGlobalState';
import mergeProductQuantities from './../../services/mergeProductQuantities';
import moment from 'moment';
import Button from '../../shared/ui/Button';
import prompt from '../../services/prompt';
import DestinationCard from './../../shared/ui/DestinationCard';
import { useFocusEffect } from '@react-navigation/native';
import calculateUnit from '../../services/report/calculateUnit';
import playSound from '../../services/playSound';

const SupplyReturnManage = ({ route, navigation }) => {

    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg
        }
    })

    let { id, routeByDocument, dataUnits } = route.params;

    const { document, setDocument, setUnits } = useContext(SupplyReturnGlobalContext);
    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const fetchingDocument = async (id) => {

        if (id == null) {
            let obj = {
                Name: "",
                CustomerId: "",
                CustomerName: "",
                Moment: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                StockId: "",
                StockName: "",
                Modifications: [{}],
                Positions: [],
                Consumption: 0,
                Status: true,
                Amount: 0,
                Discount: 0,
                BasicAmount: 0,
                OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
                DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
                Description: ""
            }

            if(routeByDocument){
                obj = routeByDocument;
                setUnits(dataUnits);
                setHasUnsavedChanges(true)
            }


            await api('supplyreturns/newname.php', {
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

            await api('supplyreturns/get.php', obj)
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
        let documentData = { ...document }
        let info = formatObjectKey(documentData);
        if (info.customerid == "" || info.stockid == "") {
            ErrorMessage('Vacib xanaları doldurun!');
            setLoading(false);
            return null;
        } else {
            if (info.name == "") {
                await api('supplyreturns/newname.php', {
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
            info.token = await AsyncStorage.getItem("token")
            let answer = await api('supplyreturns/put.php', info).then(element => {
                if (element != null) {
                    SuccessMessage("Yadda saxlanıldı.");
                    fetchingDocument(element.ResponseService);
                    setHasUnsavedChanges(false);
                    playSound('success');
                    return element.ResponseService
                }
            }).catch(err => {
                ErrorMessage(err)
            })

            setLoading(false);
            return answer || null
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
                            hasUnsavedChanges={hasUnsavedChanges}
                        />

                        <ScrollView>

                            <View style={{
                                gap: 20
                            }}>
                                <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
                                <BuyerCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} />
                                <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} navigation={navigation} />
                                
                                <DestinationCard
                                    document={document}
                                    setDocument={setDocument}
                                    changeInput={handleChangeInput}
                                    changeSelection={handleChangeSelection}
                                />

                            </View>
                        </ScrollView>

                        {
                            hasUnsavedChanges ?
                                <Button onClick={handleSave} disabled={loading} bg={theme.green} isLoading={loading} >Yadda Saxla</Button>
                                :
                                ""
                        }

                    </>
            }
        </View>
    )
}

export default SupplyReturnManage
