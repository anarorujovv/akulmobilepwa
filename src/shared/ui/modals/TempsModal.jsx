import React, { useEffect, useState } from 'react';
import { Modal, List, SpinLoading, AutoCenter } from 'antd-mobile';
import useTheme from '../../theme/useTheme';
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

    let navigationName = '/print-and-share';

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
                navigate(navigationName, { state: { html: res.data } });
                setModalVisible(false);
            }
        }).catch(err => {
            ErrorMessage(err);
        })
    }

    useEffect(() => {
        if (modalVisible && temps != null && !temps[0]) {
            fetchingTemps();
        }

        if (!modalVisible) {
            setTemps([])
        }
    }, [modalVisible])

    const content = (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {temps === null ? (
                <AutoCenter style={{ padding: 20, color: theme.primary }}>
                    Məlumat tapılmadı...
                </AutoCenter>
            ) : !temps.length ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                    <SpinLoading color='primary' />
                </div>
            ) : (
                <List>
                    {temps.map((item, index) => (
                        <List.Item
                            key={item.Id || index}
                            onClick={() => handleSelectPrint(item)}
                            arrow={false}
                        >
                            {item.Name}
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    )

    return (
        <Modal
            visible={modalVisible}
            content={content}
            closeOnMaskClick
            onClose={() => setModalVisible(false)}
            showCloseButton
            title="Şablonlar"
        />
    )
}

export default TempsModal;