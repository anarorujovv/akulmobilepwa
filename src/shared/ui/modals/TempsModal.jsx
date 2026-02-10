import React, { useEffect, useState } from 'react';
import { Modal } from 'antd-mobile';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import getTemplates from '../../../services/getTemplates';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import axios from 'axios';
import { formatPrice } from '../../../services/formatPrice';
import { useNavigate } from 'react-router-dom';

const TempsModal = ({
    modalVisible,
    setModalVisible,
    name,
    document,
    navigation,
    type,
    priceList
}) => {

    const theme = useTheme();
    const navigate = useNavigate();

    let navigationName = '/print-and-share'; // Web path replacement

    const [temps, setTemps] = useState([]);

    const fetchingTemps = async () => {
        getTemplates(name).then(res => {
            if (res[0]) {
                setTemps(res);
            } else {
                setTemps(null);
            }
        }).catch(err => {
            ErrorMessage(err);
        })
    }

    const handleSelectPrint = async (item) => {
        let obj = {
            TemplateId: item.Id,
            token: await AsyncStorageWrapper.getItem("token")
        }

        if (type) {
            obj.List = [
                {
                    Price: formatPrice(document.Price),
                    ProductId: document.Id,
                    Quantity: 1,
                }
            ]

        } else if (priceList) {
            if (document.Positions[0]) {
                obj.List = document.Positions.map(rel => ({
                    Price: formatPrice(rel.Price),
                    ProductId: rel.ProductId,
                    Quantity: rel.Quantity
                }))
            } else {
                ErrorMessage('Məhsul tapılmadı');
                return;
            }
        }
        else {
            obj.Id = document.Id;
        }

        let publicMode = await AsyncStorageWrapper.getItem('publicMode');

        axios({
            method: 'POST',
            url: type || priceList ? `https://api.akul.az/1.0/${publicMode}/controllers/products/pricelist.php`
                : `https://api.akul.az/1.0/${publicMode}/controllers/${name}/print.php`,
            data: obj,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${await AsyncStorageWrapper.getItem('token')}`
            }
        }).then(res => {
            if (res.status == 200) {
                // navigation.navigate(navigationName, { html: res.data }) // Old
                navigate(navigationName, { state: { html: res.data } }); // New React Router
                setModalVisible(false);
            }
        }).catch(err => {
            ErrorMessage(err);
        })
    }

    const renderItem = (item, index) => {

        return (
            <div key={item.Id || index} style={{ width: '100%' }}>
                <div onClick={() => {
                    handleSelectPrint(item);
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
        if (modalVisible && temps != null && !temps[0]) {
            fetchingTemps();
        }

        if (!modalVisible) {
            setTemps([])
        }
    }, [modalVisible])

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
        }
    }

    return (
        <Modal
            visible={modalVisible}
            content={
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {
                        temps == null ?
                            <div style={styles.noDataContainer}>
                                <span style={{
                                    fontSize: 16,
                                    color: theme.primary
                                }}>Məlumat tapılmadı...</span>
                            </div>
                            :
                            <div style={styles.listContainer}>
                                {
                                    temps == null ?
                                        <div style={styles.noDataContainer}>
                                            <span style={{ fontWeight: 'bold', fontSize: 16 }}>Məlumat tapılmadı...</span>
                                        </div>
                                        :
                                        temps[0] ?
                                            <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                                                {temps.map((item, index) => renderItem(item, index))}
                                            </div>
                                            :
                                            <div style={styles.noDataContainer}>
                                                <div className="spinner"></div>
                                            </div>
                                }
                            </div>
                    }
                </div>
            }
            closeOnMaskClick
            onClose={() => setModalVisible(false)}
            showCloseButton
            title="Şablonlar"
        />
    )
}

export default TempsModal;