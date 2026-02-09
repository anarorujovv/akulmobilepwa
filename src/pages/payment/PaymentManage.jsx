import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import MainCard from './manageLayouts/MainCard';
import { PaymentGlobalContext } from '../../shared/data/PaymentGlobalState';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import OppositeCard from './manageLayouts/OppositeCard';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentCard from './manageLayouts/DocumentCard';
import ManageHeader from '../../shared/ui/ManageHeader';
import { formatObjectKey } from '../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import moment from 'moment';
import Button from '../../shared/ui/Button';
import { formatPrice } from '../../services/formatPrice';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import payByRange from './../../services/report/payByRange';
import playSound from '../../services/playSound';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentManage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default params destructured with fallbacks
    const {
        id = null,
        type = "payment",
        direct = "ins",
        cost = false,
        routeByDocument = null
    } = location.state || {};

    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const permissions = useGlobalStore(state => state.permissions);

    const {
        document,
        setDocument,
        types,
        setTypes
    } = useContext(PaymentGlobalContext);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            backgroundColor: theme.whiteGrey,
            overflow: 'hidden'
        },
        scrollView: {
            flex: 1,
            overflowY: 'auto'
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        footer: {
            padding: 10,
            backgroundColor: theme.whiteGrey
        }
    };

    const fetchDefaultSelectedValues = async (obj) => {
        let data = { ...obj };

        data.CustomerId = routeByDocument.CustomerId;
        data.CustomerName = routeByDocument.CustomerName;

        await api('spenditems/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    data.SpendItem = element.List[0].Id;
                }
            }
        }).catch(err => {
            ErrorMessage(err);
        });

        await api('cashes/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    data.CashId = element.List[0].Id;
                }
            }
        }).catch(err => {
            ErrorMessage(err);
        });

        return { ...data };
    };

    const fetchingPaymentData = async (type, direct, id) => {
        try {
            let obj = {};
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
                    OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
                    DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
                    Description: ""
                };

                if (!permission_ver(permissions, 'payment_status', 'R')) {
                    obj.Status = false;
                }

                if (direct !== 'outs') {
                    obj.SpendItem = '2232d344-142b-44f3-b2b8-ea4c5add0b31';
                }

                await api(type + direct + '/newname.php', {
                    n: "", token: await AsyncStorageWrapper.getItem('token')
                }).then(element => {
                    if (element != null) {
                        obj.Name = element.ResponseService;
                    }
                }).catch(err => {
                    ErrorMessage(err);
                });
            } else {
                let url = `${type + direct}/get.php`;
                let documentData = await api(url, {
                    id: id,
                    token: await AsyncStorageWrapper.getItem('token')
                });

                if (documentData != null && documentData.List && documentData.List[0]) {
                    obj = { ...documentData.List[0] };
                    obj.Amount = formatObjectKey(obj.Amount);
                } else {
                    setDocument(null);
                    return;
                }
            }

            let spendItems = [];
            await api('spenditems/get.php', {
                token: await AsyncStorageWrapper.getItem('token')
            }).then(element => {
                if (element != null) {
                    spendItems = [...element.List];
                }
            }).catch(err => {
                ErrorMessage(err);
            });

            if (cost) {
                obj.CustomerId = "00000000-0000-0000-0000-000000000000";
                obj.CustomerName = "Şirkətim";
            }

            if (direct == "ins") {
                if (spendItems[0]) {
                    obj.SpendItemName = spendItems[0].Name;
                    obj.SpendItemId = spendItems[0].Id;
                }
            }

            if (!obj.Modifications || !obj.Modifications[0]) {
                obj.Modifications = [{}];
            }

            obj.Amount = formatPrice(obj.Amount);
            if (routeByDocument) {
                obj = await fetchDefaultSelectedValues(obj);
            }
            setDocument(obj);

        } catch (err) {
            ErrorMessage(err);
        }

        setHasUnsavedChanges(false);
    };

    const handleSave = async () => {
        setLoading(true);
        let data = { ...document };
        let keyLowerFormatData = formatObjectKey(data);

        if (keyLowerFormatData.customerid == "" || keyLowerFormatData.cashid == "" || keyLowerFormatData.spenditem == "") {
            ErrorMessage("Vacib xanaları doldurun!");
            setLoading(false);
            return null;
        } else {
            keyLowerFormatData.token = await AsyncStorageWrapper.getItem('token');
            if (routeByDocument != undefined) {
                keyLowerFormatData.link = routeByDocument.Id;
            }
            keyLowerFormatData.modifications = await buildModificationsPayload(keyLowerFormatData.modifications[0], `${(types.type + types.direct).slice(0, -1)}`);

            let payAmount = formatPrice(keyLowerFormatData.amount);
            let obj = {};
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
                    token: await AsyncStorageWrapper.getItem('token'),
                    value: paydir
                };
            }

            if (paydir == 4) {
                ErrorMessage("Ödənilmiş məbləğ müqavilənin ödənilmə məbləğindən çoxdur");
            }

            await api(types.type + types.direct + '/newname.php', {
                n: "", token: await AsyncStorageWrapper.getItem('token')
            }).then(element => {
                if (element != null) {
                    keyLowerFormatData.name = element.ResponseService;
                }
            }).catch(err => {
                ErrorMessage(err);
            });

            let answer = await api(`${types.type + types.direct}/put.php`, keyLowerFormatData).then(async element => {
                if (element != null) {
                    SuccessMessage("Yadda Saxlanıldı");
                    playSound('success');
                    if (routeByDocument != undefined) {
                        await api(`${routeByDocument.target}/bash.php`, obj);
                    }

                    fetchingPaymentData(types.type, types.direct, element.ResponseService);

                    return element.ResponseService;
                }
            }).catch(err => {
                ErrorMessage(err);
            });
            setLoading(false);
            return answer;
        }
    };

    const fetchNewName = async () => {
        await api(types.type + types.direct + '/newname.php', {
            n: "", token: await AsyncStorageWrapper.getItem('token')
        }).then(element => {
            if (element != null) {
                let data = { ...document };
                data.Name = element.ResponseService;
                setDocument(data);
            }
        }).catch(err => {
            ErrorMessage(err);
        });
    };

    const hasUnsavedChangesFunction = () => {
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    };

    const handleChangeInput = (key, value) => {
        setDocument(rel => ({ ...rel, [key]: value }));
        hasUnsavedChangesFunction();
    };

    const handleChangeSelection = (key, value) => {
        setDocument(rel => ({ ...rel, [key]: value }));
        hasUnsavedChangesFunction();
    };

    useEffect(() => {
        setTypes(rel => ({ ...rel, ['type']: type }));
        setTypes(rel => ({ ...rel, ['direct']: direct }));
        fetchingPaymentData(type, direct, id);
    }, []);

    useEffect(() => {
        if (types.type != "" && document !== null) {
            if (document && (document.CashId !== "" || document.CashName !== "")) {
                setDocument(rel => ({ ...rel, ['CashName']: "", 'CashId': "" }));
                fetchNewName();
            }
        }
    }, [types.type]);

    return (
        <div style={styles.container}>
            {!routeByDocument && (
                <ManageHeader
                    navigation={navigate}
                    type={type + direct}
                    document={document}
                    onSubmit={handleSave}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
            )}

            {document !== null ? (
                <>
                    <div style={styles.scrollView}>
                        <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} type={type} direct={direct} navigation={navigate} id={id} />
                        <div style={{ margin: 10 }} />
                        <OppositeCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} cost={cost} />
                        <div style={{ margin: 10 }} />
                        <DocumentCard changeInput={handleChangeInput} cost={cost} />
                        <div style={{ margin: 10 }} />
                        <ModificationsCard
                            hasUnsavedChanged={setHasUnsavedChanges}
                            setState={setDocument}
                            state={document}
                            target={`${(types.type + types.direct).slice(0, -1)}`}
                        />
                    </div>
                    {hasUnsavedChanges && (
                        <div style={styles.footer}>
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
            ) : (
                <div style={styles.loadingContainer}>
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default PaymentManage;
