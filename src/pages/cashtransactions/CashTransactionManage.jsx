import React, { useCallback, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageCard from '../../shared/ui/ManageCard';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import moment from 'moment';
import Input from '../../shared/ui/Input';
import { formatPrice } from '../../services/formatPrice';
import Button from '../../shared/ui/Button';
import { formatObjectKey } from '../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import Selection from '../../shared/ui/Selection';
import SelectionDate from '../../shared/ui/SelectionDate';
import DestinationCard from '../../shared/ui/DestinationCard';
// import playSound from '../../services/playSound'; // Sounds might not work same way on web, skip or mock
import { useLocation, useNavigate } from 'react-router-dom';

const CashTransactionManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let theme = useTheme();

    let { id } = location.state || {}; // Get ID from state

    const [c_transaction, set_c_transaction] = useState(null);
    const [dateModal, setDateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 10
        },
        headerText: {
            fontSize: 20,
            color: theme.primary,
            padding: 15
        },
        formGroup: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20
        }
    };

    const fetchingData = async (id) => {
        if (id != null) {
            await api('cashtransactions/get.php', {
                id: id,
                token: await AsyncStorageWrapper.getItem('token')
            })
                .then(element => {
                    if (element != null) {
                        let data = { ...element.List[0] };
                        data.Amount = formatPrice(data.Amount)
                        set_c_transaction(data);
                    }
                })
                .catch(err => {
                    ErrorMessage(err)
                })
        } else {
            let obj = {
                Status: true,
                Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                Name: "",
                Amount: "",
                CashFromId: "",
                CashFromName: "",
                CashToId: "",
                CashToName: "",
                OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
                DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
                Description: ""
            }

            await api('cashtransactions/newname.php', {
                n: "",
                token: await AsyncStorageWrapper.getItem('token')
            })
                .then(element => {
                    if (element != null) {
                        obj.Name = element.ResponseService
                    }
                })
                .catch(err => {
                    ErrorMessage(err);
                })

            set_c_transaction(obj)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        let data = { ...c_transaction };
        let info = { ...formatObjectKey(data) };
        info.token = await AsyncStorageWrapper.getItem('token')

        await api('cashtransactions/put.php', info)
            .then(item => {
                if (item != null) {
                    // Update ID to continue editing if needed, or navigate back? 
                    // Original code re-fetches with new ID if saved.
                    // But usually on web we might want to stay or go back.
                    // Assuming staying on page for now.
                    // fetchingData(item.ResponseService); 
                    SuccessMessage('Yadda Saxlanıldı!');
                    setHasUnsavedChanges(false);
                    // playSound('success')
                    navigate(-1); // Navigate back on success
                }
            })
            .catch(err => {
                ErrorMessage(err);
            })

        setIsLoading(false);
    }

    const hasUnsavedChangesFunction = () => {
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }

    const handleChangeInput = (key, value) => {
        set_c_transaction(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    const handleChangeSelection = (key, value) => {
        set_c_transaction(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    // Web navigation blocking logic is complex (window.onbeforeunload), 
    // for now we trust user or add simple check. React Router v6 unstable_useBlocker is experimental.

    useEffect(() => {
        fetchingData(id);
    }, [id])

    return (
        <div style={styles.container}>
            {c_transaction == null ? (
                <div style={styles.loadingContainer}>
                    <div className="spinner"></div> // Global spinner
                </div>
            ) : (
                <div style={styles.content}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <ManageCard>
                            <div style={{
                                width: '100%',
                            }}>
                                <span style={styles.headerText}>Transfer</span>
                            </div>

                            <div style={styles.formGroup}>
                                <Input
                                    value={c_transaction.Name}
                                    onChange={(e) => {
                                        handleChangeInput('Name', e)
                                    }}
                                    placeholder={'Ad'}
                                    type={'text'}
                                    width={'90%'}
                                />

                                <SelectionDate
                                    document={c_transaction}
                                    setDocument={set_c_transaction}
                                    change={handleChangeSelection}
                                    modalVisible={dateModal}
                                    setModalVisible={setDateModal}
                                />

                                <Input
                                    value={c_transaction.Amount}
                                    width={'90%'}
                                    type={'number'}
                                    placeholder={'Məbləğ'}
                                    onChange={(e) => {
                                        handleChangeInput('Amount', e)
                                    }}
                                />

                                <Selection
                                    isRequired={true}
                                    apiBody={{}}
                                    apiName={'cashes/get.php'}
                                    change={(e) => {
                                        handleChangeInput('CashFromId', e.Id);
                                    }}
                                    defaultValue={c_transaction.CashFromName}
                                    title={'Hesabdan'}
                                    value={c_transaction.CashFromId}
                                />

                                <Selection
                                    isRequired={true}
                                    apiBody={{}}
                                    apiName={'cashes/get.php'}
                                    change={(e) => {
                                        handleChangeInput('CashToId', e.Id);
                                    }}
                                    defaultValue={c_transaction.CashToName}
                                    title={'Hesaba'}
                                    value={c_transaction.CashToId}
                                />
                            </div>
                        </ManageCard>

                        <DestinationCard
                            changeInput={handleChangeInput}
                            changeSelection={handleChangeSelection}
                            document={c_transaction}
                            setDocument={set_c_transaction}
                        />
                    </div>

                    {hasUnsavedChanges && (
                        <div style={{ marginTop: 20 }}>
                            <Button
                                onClick={handleSave}
                                isLoading={isLoading}
                                bg={theme.green}
                                disabled={isLoading}
                            >
                                Yadda Saxla
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CashTransactionManage;