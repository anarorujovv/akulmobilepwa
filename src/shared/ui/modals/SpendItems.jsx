import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import contains from '../../../services/contains';
import { List, Input, SpinLoading, AutoCenter } from 'antd-mobile';

const SpendItemsModal = ({
    modalVisible,
    setModalVisible,
    document,
    setDocument,
    target,
    types
}) => {
    const theme = useTheme();
    const [spendItems, setSpendItems] = useState([]);

    const fetchingSpendItems = async () => {
        await api('spenditems/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setSpendItems([...element.List]);
                } else {
                    setSpendItems(null);
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    useEffect(() => {
        if (modalVisible && spendItems != null && !spendItems[0]) {
            fetchingSpendItems();
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingSpendItems();
    }, [])

    return (
        <>
            <div
                onClick={() => {
                    if (types.direct === 'outs') {
                        setModalVisible(true);
                    }
                }}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: types.direct === 'outs' ? 'pointer' : 'default'
                }}
            >
                {!spendItems.length ? (
                    <div style={{ padding: 10 }}>
                        <SpinLoading style={{ '--size': '20px' }} />
                    </div>
                ) : (
                    <div style={{
                        width: '70%',
                        border: '1px solid #e5e5e5',
                        borderRadius: 4,
                        padding: '6px 12px',
                        backgroundColor: types.direct === 'outs' ? '#fff' : '#f5f5f5'
                    }}>
                        <Input
                            readOnly
                            value={contains(spendItems, document.SpendItem)?.Name || ''}
                            placeholder="Xərc maddəsi"
                            style={{ '--font-size': '14px' }}
                        />
                    </div>
                )}
            </div>

            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={"100%"}
            >
                <div style={{ height: '300px', overflowY: 'auto' }}>
                    {spendItems === null ? (
                        <AutoCenter style={{ padding: 20, color: theme.primary }}>
                            Məlumat tapılmadı...
                        </AutoCenter>
                    ) : !spendItems.length ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <SpinLoading color='primary' />
                        </div>
                    ) : (
                        <List header='Xərc maddələri'>
                            {spendItems.map((item, index) => (
                                <List.Item
                                    key={item.Id || index}
                                    onClick={() => {
                                        setDocument(rel => ({ ...rel, ['SpendItem']: item.Id }));
                                        setModalVisible(false);
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

export default SpendItemsModal;