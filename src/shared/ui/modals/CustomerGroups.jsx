import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';

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


    const renderItem = (item, index) => {
        return (
            <div key={item.Id || index} style={{ width: '100%' }}>
                <div onClick={() => {
                    setProduct(rel => ({ ...rel, ['GroupName']: item.Name }))
                    setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
                    setModalVisible(false);
                }}
                    style={{
                        width: '100%',
                        height: 55,
                        paddingLeft: 20,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.input.grey}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{
                        color: theme.black,
                        fontSize: 13
                    }}>{item.Name}</span>
                </div>
                <Line width={'90%'} />
            </div>
        )
    }

    useEffect(() => {
        if (modalVisible && customerGroups != null && !customerGroups
        [0]) {
            fetchingCustomerGroups();
        }

        if (!modalVisible) {
            setCustomerGroups([])
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingCustomerGroups();
    }, [])

    const styles = {
        noDataContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        listContainer: {
            width: '100%',
            height: '100%',
            overflowY: 'auto'
        }
    };

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
            height={"100%"}
        >
            {
                customerGroups == null ?
                    <div style={styles.noDataContainer}>
                        <span style={{
                            fontSize: 16,
                            color: theme.primary
                        }}>Məlumat tapılmadı...</span>
                    </div>
                    :
                    <div style={styles.listContainer}>

                        {
                            customerGroups[0] ?
                                customerGroups.map((item, index) => renderItem(item, index))
                                :
                                <div style={styles.noDataContainer}>
                                    <div className="spinner"></div>
                                </div>
                        }

                    </div>
            }
        </MyModal>
    )
}

export default CustomerGroupsModal;