import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import BuyerCard from './manageLayouts/BuyerCard';
import ProductCard from './manageLayouts/ProductCard';
import pricingUtils from '../../services/pricingUtils';
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import { DemandReturnGlobalContext } from '../../shared/data/DemandReturnGlobalState';
import mergeProductQuantities from '../../services/mergeProductQuantities';
import Button from '../../shared/ui/Button';
import DestinationCard from '../../shared/ui/DestinationCard';
import calculateUnit from '../../services/report/calculateUnit';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ReleatedDocuments from '../../shared/ui/ReleatedDocuments';
import moment from 'moment';
// import playSound from '../../services/playSound';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import { useLocation, useNavigate } from 'react-router-dom';

const DemandReturnManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.whiteGrey,
            overflow: 'hidden'
        },
        content: {
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '10px'
        },
        loading: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }

    let { id, routeByDocument, dataUnits } = location.state || {}; // Get id from state

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
                OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
                DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
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
                token: await AsyncStorageWrapper.getItem("token")
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
                token: await AsyncStorageWrapper.getItem('token')
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
                            token: await AsyncStorageWrapper.getItem('token')

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
                    token: await AsyncStorageWrapper.getItem("token")
                }).then(element => {
                    if (element != null) {
                        info.name = element.ResponseService;
                    }
                }).catch(err => {
                    ErrorMessage(err)
                })
            }
            info.modifications = await buildModificationsPayload(info.modifications[0], 'demandreturn');
            info.token = await AsyncStorageWrapper.getItem("token")

            let answer = await api('demandreturns/put.php', info).then(async element => {
                if (element != null) {

                    SuccessMessage("Yadda saxlanıldı.");
                    fetchingDocument(element.ResponseService);
                    setHasUnsavedChanges(false);
                    // playSound('success');

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


    return (
        <div style={styles.container}>
            {
                document == null ?
                    <div style={styles.loading}>
                        <div className="spinner"></div> // Web spinner
                    </div>
                    :
                    <>
                        <ManageHeader
                            // navigation={navigation}
                            print={'demandreturns'}
                            document={document}
                            hasUnsavedChanges={hasUnsavedChanges}
                            onSubmit={handleSave}
                        />

                        <div style={styles.content}>

                            <MainCard navigation={navigate} id={id} />
                            <BuyerCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} />
                            <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} />
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
                                        // navigation={navigation}
                                        payment={'ins'}
                                        selection={[]}
                                        hasUnsavedChanged={hasUnsavedChanges}
                                        onSubmit={handleSave}
                                    />
                            }

                        </div>
                        {
                            hasUnsavedChanges ?
                                <div style={{ padding: '10px' }}>
                                    <Button
                                        onClick={handleSave}
                                        bg={theme.green}
                                        disabled={loading}
                                        isLoading={loading}
                                    >
                                        Yadda Saxla
                                    </Button>
                                </div>
                                :
                                ''
                        }
                    </>
            }
        </div>
    )
}

export default DemandReturnManage;
