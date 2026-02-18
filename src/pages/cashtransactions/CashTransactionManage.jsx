import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import moment from 'moment';
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from '../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Form, Input, Button, SpinLoading, DatePicker, TextArea } from 'antd-mobile';
import CashFromModal from '../../shared/ui/modals/CashFromModal';
import CashToModal from '../../shared/ui/modals/CashToModal';
import OwnersModal from '../../shared/ui/modals/OwnersModal';
import DepartmentModal from '../../shared/ui/modals/Departments';

const CashTransactionManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [c_transaction, set_c_transaction] = useState(null);
    const [dateModal, setDateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const fetchingData = async (id) => {
        if (id) {
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
                    SuccessMessage('Yadda Saxlanıldı!');
                    setHasUnsavedChanges(false);
                    navigate(-1);
                }
            })
            .catch(err => {
                ErrorMessage(err);
            })

        setIsLoading(false);
    }

    const handleStateChange = (action) => {
        set_c_transaction(prev => {
            const next = typeof action === 'function' ? action(prev) : action;
            setHasUnsavedChanges(true);
            return next;
        });
    }

    const handleChangeInput = (key, value) => {
        set_c_transaction(rel => ({ ...rel, [key]: value }))
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }

    useEffect(() => {
        fetchingData(id);
    }, [id])

    if (!c_transaction) {
        return (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme.bg }}>
                <SpinLoading color='primary' />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: theme.bg }}>
            <NavBar onBack={() => navigate(-1)} style={{ background: '#fff' }}>
                Transfer
            </NavBar>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                <Form layout='horizontal' style={{ backgroundColor: '#fff', borderRadius: 8 }}>
                    <Form.Item label="Ad">
                        <Input
                            value={c_transaction.Name}
                            onChange={(val) => handleChangeInput('Name', val)}
                            placeholder='Ad'
                        />
                    </Form.Item>
                    <Form.Item label="Tarix" onClick={() => setDateModal(true)}>
                        <Input
                            readOnly
                            value={c_transaction.Moment}
                            placeholder='Tarix'
                        />
                    </Form.Item>
                    <Form.Item label="Məbləğ">
                        <Input
                            type='number'
                            value={c_transaction.Amount}
                            onChange={(val) => handleChangeInput('Amount', val)}
                            placeholder='Məbləğ'
                        />
                    </Form.Item>
                    <Form.Item label="Hesabdan">
                        <CashFromModal document={c_transaction} setDocument={handleStateChange} />
                    </Form.Item>
                    <Form.Item label="Hesaba">
                        <CashToModal document={c_transaction} setDocument={handleStateChange} />
                    </Form.Item>
                    <Form.Item label="Cavabdeh">
                        <OwnersModal state={c_transaction} setState={handleStateChange} />
                    </Form.Item>
                    <Form.Item label="Şöbə">
                        <DepartmentModal state={c_transaction} setState={handleStateChange} />
                    </Form.Item>
                    <Form.Item label="Qeyd">
                        <TextArea
                            value={c_transaction.Description}
                            onChange={(val) => handleChangeInput('Description', val)}
                            placeholder='Qeyd'
                            autoSize={{ minRows: 2, maxRows: 5 }}
                        />
                    </Form.Item>
                </Form>

                <div style={{ marginTop: 20 }}>
                    <Button
                        block
                        color='primary'
                        onClick={handleSave}
                        loading={isLoading}
                        disabled={!hasUnsavedChanges || isLoading}
                    >
                        Yadda Saxla
                    </Button>
                </div>
            </div>

            <DatePicker
                visible={dateModal}
                onClose={() => setDateModal(false)}
                defaultValue={moment(c_transaction.Moment).toDate()}
                onConfirm={(val) => {
                    handleChangeInput('Moment', moment(val).format('YYYY-MM-DD HH:mm:ss'));
                }}
            />
        </div>
    )
}

export default CashTransactionManage;