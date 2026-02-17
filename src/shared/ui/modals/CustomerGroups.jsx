import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import { List, SpinLoading, AutoCenter } from 'antd-mobile';

const CustomerGroupsModal = ({
    modalVisible,
    setModalVisible,
    setProduct,
}) => {
    const theme = useTheme();
    const [customerGroups, setCustomerGroups] = useState([]);

    const fetchingCustomerGroups = async () => {
        await api('customergroups/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCustomerGroups([...element.List]);
                } else {
                    setCustomerGroups(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    useEffect(() => {
        if (modalVisible && customerGroups != null && !customerGroups[0]) {
            fetchingCustomerGroups();
        }

        if (!modalVisible) {
            setCustomerGroups([])
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingCustomerGroups();
    }, [])

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
        >
            <div style={{ height: '300px', overflowY: 'auto' }}>
                {customerGroups === null ? (
                    <AutoCenter style={{ padding: 20, color: theme.primary }}>
                        Məlumat tapılmadı...
                    </AutoCenter>
                ) : !customerGroups.length ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                        <SpinLoading color='primary' />
                    </div>
                ) : (
                    <List header='Müştəri qrupları'>
                        {customerGroups.map((item, index) => (
                            <List.Item
                                key={item.Id || index}
                                onClick={() => {
                                    setProduct(rel => ({ ...rel, ['GroupName']: item.Name }));
                                    setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
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
    )
}

export default CustomerGroupsModal;