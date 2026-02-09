import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import ManageCard from '../../shared/ui/ManageCard';
import { FaUser } from 'react-icons/fa';
import Input from '../../shared/ui/Input';
import api from '../../services/api';
import { formatObjectKey } from '../../services/formatObjectKey';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import MySelection from './../../shared/ui/MySelection';
import Button from '../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '../../shared/ui/DestinationCard';

const CasheCreate = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [document, setDocument] = useState({
        Name: "",
        Description: "",
        CashType: "",
        DepartmentId: "",
        OwnerId: "",
    });

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            padding: 15,
            alignItems: 'center',
            width: '100%'
        },
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 10,
            overflowY: 'auto'
        },
        cardHeader: {
            width: '100%',
            padding: 15,
        },
        cardTitle: {
            fontSize: 20,
            color: theme.primary,
            fontWeight: 'bold'
        },
        formGroup: {
            gap: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        labelIcon: {
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            padding: 15
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);
        let obj = { ...document };
        let json = formatObjectKey(obj);
        json.token = await AsyncStorageWrapper.getItem('token');
        await api('cashes/put.php', json).then(element => {
            if (element !== null) {
                SuccessMessage("Yadda Saxlanıldı");
                navigate(-1);
            }
        }).catch(err => {
            ErrorMessage(err);
        });
        setIsLoading(false);
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

    const fetchingData = async () => {
        let info = {
            ...document,
            OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
            DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
            Description: ""
        };
        setDocument(info);
    };

    useEffect(() => {
        // Web'de BackHandler yok, tarayıcı geri butonu için window.onbeforeunload kullanılabilir
        // ama React Router ile prompt logic daha kompleks. Şimdilik basit tutuyoruz.
        fetchingData();
    }, []);

    return (
        <div style={styles.container}>
            <ManageHeader
                navigation={navigate} // Pass navigate function
                hasUnsavedChanges={hasUnsavedChanges}
            />

            <div style={styles.content}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <ManageCard>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardTitle}>Hesablar</span>
                        </div>

                        <div style={styles.labelIcon}>
                            <FaUser color={theme.grey} size={20} />
                            <span style={{ color: theme.grey }}>Hesab</span>
                        </div>

                        <div style={styles.formGroup}>
                            <Input
                                isRequired={true}
                                placeholder={'Name'}
                                value={document.Name}
                                type={'string'}
                                onChange={(e) => {
                                    handleChangeInput('Name', e);
                                }}
                                width={'90%'}
                            />

                            <MySelection
                                value={document.CashType}
                                label={'Hesab'}
                                labelName={'label'}
                                valueName={'value'}
                                width={'90%'}
                                list={[
                                    {
                                        label: "Nağd",
                                        value: "cash"
                                    },
                                    {
                                        label: "Nağdsız",
                                        value: "noncash"
                                    }
                                ]}
                                onValueChange={(e) => {
                                    handleChangeInput('CashType', e);
                                }}
                            />
                        </div>
                    </ManageCard>

                    <DestinationCard
                        changeInput={handleChangeInput}
                        changeSelection={handleChangeSelection}
                        document={document}
                        setDocument={setDocument}
                    />
                </div>

                <div style={{ marginTop: 20 }}>
                    <Button
                        onClick={handleCreate}
                        bg={theme.green}
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        Yadda Saxla
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CasheCreate;
