import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import contains from '../../../services/contains';
import { formatPrice } from '../../../services/formatPrice';
import { List, Input, SpinLoading, AutoCenter } from 'antd-mobile';

const CashToModal = ({
    document,
    setDocument,
}) => {
    const theme = useTheme();
    const [cashs, setCashs] = useState([]);
    const [cashModal, setCashModal] = useState(false);

    const fetchingCashes = async () => {
        await api('cashes/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCashs([...element.List]);
                } else {
                    setCashs(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    useEffect(() => {
        if (cashModal && cashs != null && !cashs[0]) {
            fetchingCashes();
        }
    }, [cashModal])

    useEffect(() => {
        fetchingCashes();
    }, [])

    const selectedCash = contains(cashs, document.CashToId);

    return (
        <>
            <div
                onClick={() => setCashModal(true)}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    cursor: 'pointer'
                }}
            >
                {!cashs.length ? (
                    <div style={{ padding: 10 }}>
                        <SpinLoading style={{ '--size': '20px' }} />
                    </div>
                ) : (
                    <>
                        <div style={{
                            width: '70%',
                            border: '1px solid #e5e5e5',
                            borderRadius: 4,
                            padding: '6px 12px',
                            backgroundColor: '#fff'
                        }}>
                            <Input
                                readOnly
                                value={document.CashToName || ''}
                                placeholder={'Hesaba'}
                                style={{ '--font-size': '14px' }}
                            />
                        </div>
                        {selectedCash && (
                            <div style={{ width: '70%', display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                <span style={{ fontSize: 12, color: theme.red }}>Balans</span>
                                <span style={{ fontSize: 12, color: theme.red }}>{formatPrice(selectedCash.Balance)} ₼</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <MyModal
                modalVisible={cashModal}
                setModalVisible={setCashModal}
                width={'100%'}
                height={"100%"}
            >
                <div style={{ height: '300px', overflowY: 'auto' }}>
                    {cashs === null ? (
                        <AutoCenter style={{ padding: 20, color: theme.primary }}>
                            Məlumat tapılmadı...
                        </AutoCenter>
                    ) : !cashs.length ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <SpinLoading color='primary' />
                        </div>
                    ) : (
                        <List header='Hesablar'>
                            {cashs.map((item, index) => (
                                <List.Item
                                    key={item.Id || index}
                                    onClick={() => {
                                        setDocument(rel => ({ ...rel, ['CashToName']: item.Name }))
                                        setDocument(rel => ({ ...rel, ['CashToId']: item.Id }));
                                        setCashModal(false);
                                    }}
                                    arrow={false}
                                >
                                    {item.Name}
                                </List.Item>
                            ))}
                        </List>
                    )}
                </div>
            </MyModal>
        </>
    )
}

export default CashToModal;