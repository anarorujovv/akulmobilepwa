import React, { useEffect, useState } from 'react';
import { Popup, List, SpinLoading } from 'antd-mobile';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import useGlobalStore from '../../data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';

const PricesModal = ({
    modalVisible,
    setModalVisible,
    pressable
}) => {

    const theme = useTheme();

    const permissions = useGlobalStore(state => state.permissions);

    const [prices, setPrices] = useState([]);

    const fetchingPrices = async () => {
        await api('pricetypes/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    if (!permission_ver(permissions, 'sub_buy_price', 'R')) {
                        setPrices([...element.List].filter(item => item.Id != 9999));
                    } else {
                        setPrices([...element.List]);
                    }
                } else {
                    setPrices(null)
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
                    pressable(item);
                    setModalVisible(false);
                }}
                    style={{
                        width: '100%',
                        height: 55,
                        paddingLeft: 20,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        backgroundColor: 'transparent'
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
        if (modalVisible && prices != null && !prices[0]) {
            fetchingPrices();
        }

        if (!modalVisible) {
            setPrices([])
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingPrices();
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
    }

    return (
        <Popup
            visible={modalVisible}
            onMaskClick={() => {
                setModalVisible(false)
            }}
            bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                minHeight: '40vh',
                maxHeight: '60vh',
            }}
        >
            <div style={{ padding: '16px 16px 0 16px' }}>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Qiymət növü seçin</span>
            </div>
            {
                prices == null ?
                    <div style={styles.noDataContainer}>
                        <span style={{ fontSize: 16, color: theme.primary }}>Məlumat tapılmadı...</span>
                    </div>
                    :
                    !prices[0] ?
                        <div style={styles.noDataContainer}>
                            <SpinLoading color='primary' />
                        </div>
                        :
                        <div style={{ overflowY: 'auto', flex: 1, maxHeight: '50vh' }}>
                            <List>
                                {prices.map((item, index) => (
                                    <List.Item
                                        key={item.Id || index}
                                        onClick={() => {
                                            pressable(item);
                                            setModalVisible(false);
                                        }}
                                        clickable
                                    >
                                        {item.Name}
                                    </List.Item>
                                ))}
                            </List>
                        </div>
            }
        </Popup>
    )
}

export default PricesModal;