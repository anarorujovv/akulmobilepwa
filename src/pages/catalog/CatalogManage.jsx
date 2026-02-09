import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ProductCard from './manageLayouts/ProductCard';
import pricingUtils from '../../services/pricingUtils';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import { CatalogGlobalContext } from '../../shared/data/CatalogGlobalState';
import Button from '../../shared/ui/Button';
import DestinationCard from './../../shared/ui/DestinationCard';
import moment from 'moment';
import calculateUnit from './../../services/report/calculateUnit';
import fetchPaydirByDocument from './../../services/report/fetchPaydirByDocument';
// import playSound from './../../services/playSound'; // Skipping sound
import { useLocation, useNavigate } from 'react-router-dom';

const CatalogManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.whiteGrey,
            overflowY: 'auto'
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: 10
        }
    };

    let { id } = location.state || {}; // Get ID from state

    const { document, setDocument, units, setUnits } = useContext(CatalogGlobalContext);
    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const fetchingDocument = async (id) => {

        if (id == null) {
            let obj = {
                Name: "",
                Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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

            await api('catalogs/newname.php', {
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
            await api('catalogs/get.php', obj)
                .then(async element => {
                    if (element != null) {

                        let documentData = { ...element.List[0] };
                        documentData.BasicAmount = 0;

                        let positions = calculateUnit(element.PositionUnits, documentData.Positions, "GET")

                        setUnits(element.PositionUnits);
                        setDocument({ ...documentData, ...(pricingUtils(positions)) });
                    }
                })
                .catch(err => {
                    ErrorMessage(err)
                })
        }
    }

    const handleSave = async () => {
        setLoading(true)
        let data = { ...document }
        let info = { ...formatObjectKey(data) };

        info.positions = calculateUnit(units, info.positions, 'POST')

        if (info.name == "") {
            await api('catalogs/newname.php', {
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
        let documentId = await api('catalogs/put.php', info).then(async element => {
            if (element != null) {
                if (!info.id) {
                    await fetchPaydirByDocument(element.ResponseService);
                }
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
        return documentId || null;

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
                    <div style={styles.loadingContainer}>
                        <div className="spinner"></div>
                    </div>
                    :
                    <>
                        <ManageHeader
                            // navigation={navigation} // ManageHeader might need update to use react-router navigate
                            document={document}
                            print={'catalogs'}
                            isSubmitVisible={hasUnsavedChanges}
                            onSubmit={handleSave}
                            isPriceList={true}
                        />

                        <div style={styles.content}>
                            <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
                            <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} />
                            <DestinationCard
                                document={document}
                                setDocument={setDocument}
                                changeInput={handleChangeInput}
                                changeSelection={handleChangeSelection}
                            />
                        </div>

                        {hasUnsavedChanges && (
                            <div style={{ padding: 10, paddingBottom: 20 }}>
                                <Button
                                    bg={theme.green}
                                    disabled={loading}
                                    isLoading={loading}
                                    onClick={handleSave}
                                >
                                    Yadda Saxla
                                </Button>
                            </div>
                        )}
                    </>
            }
        </div>
    )
}

export default CatalogManage;
