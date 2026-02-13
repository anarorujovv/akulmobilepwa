import React, { useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper'
import BuyerCard from './manageLayouts/BuyerCard'
import ProductCard from './manageLayouts/ProductCard'
import pricingUtils from '../../services/pricingUtils'
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import { SupplyReturnGlobalContext } from '../../shared/data/SupplyReturnGlobalState';
import mergeProductQuantities from './../../services/mergeProductQuantities';
import moment from 'moment';
import { Button, SpinLoading } from 'antd-mobile'; // Updated import
import DestinationCard from './../../shared/ui/DestinationCard';
import calculateUnit from '../../services/report/calculateUnit';
import playSound from '../../services/playSound';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const SupplyReturnManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.whiteGrey, // Updated theme color
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

    // React Router URL params
    let { id } = useParams();

    // Handle case where id might be 'null' string from URL or undefined
    if (id === 'null' || id === 'undefined') id = null;

    // Fallback to location.state if navigated via state (legacy support or internal nav)
    if (!id && location.state?.id) {
        id = location.state.id;
    }

    // Support for routeByDocument from SupplyManage link
    let { routeByDocument, dataUnits } = location.state || {};


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
                OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
                DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
                Description: ""
            }

            if (routeByDocument) {
                obj = routeByDocument;
                setUnits(dataUnits);
                setHasUnsavedChanges(true)
            }


            await api('supplyreturns/newname.php', {
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
                            token: await AsyncStorageWrapper.getItem('token')

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
                    token: await AsyncStorageWrapper.getItem("token")
                }).then(element => {
                    if (element != null) {
                        info.name = element.ResponseService;
                    }
                }).catch(err => {
                    ErrorMessage(err)
                })
            }
            info.token = await AsyncStorageWrapper.getItem("token")
            let answer = await api('supplyreturns/put.php', info).then(element => {
                if (element != null) {
                    SuccessMessage("Yadda saxlanıldı.");
                    fetchingDocument(element.ResponseService);
                    setHasUnsavedChanges(false);
                    // playSound('success');
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
    }, [id]) // Re-fetch on ID change


    return (
        <div style={styles.container}>
            {
                document == null ?
                    <div style={styles.loading}>
                        <SpinLoading />
                    </div>
                    :
                    <>
                        <ManageHeader
                            // navigation={navigation}
                            hasUnsavedChanges={hasUnsavedChanges}
                            onSubmit={handleSave} // Added submit button to header if supported
                        />

                        <div style={styles.content}>

                            <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
                            <BuyerCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} />
                            <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} />

                            <DestinationCard
                                document={document}
                                setDocument={setDocument}
                                changeInput={handleChangeInput}
                                changeSelection={handleChangeSelection}
                            />

                        </div>

                        {
                            hasUnsavedChanges ?
                                <div style={{ padding: '10px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
                                    <Button
                                        block
                                        color='success'
                                        onClick={handleSave}
                                        disabled={loading}
                                        loading={loading}
                                    >Yadda Saxla</Button>
                                </div>
                                :
                                ""
                        }

                    </>
            }
        </div>
    )
}

export default SupplyReturnManage;
