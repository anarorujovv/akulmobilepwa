import React, { useState } from 'react';
import MyModal from './../MyModal';
import useTheme from '../../theme/useTheme';
import { List } from 'antd-mobile';

const PaymentMethod = ({
    modalVisible,
    setModalVisible,
    setProduct
}) => {
    const theme = useTheme();

    const [methods] = useState([
        {
            id: 'payment',
            Name: 'Nağd'
        },
        {
            id: "invoice",
            Name: "Köçürmə"
        }
    ]);

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
        >
            <div style={{ width: '100%' }}>
                <List header='Ödəniş növü'>
                    {methods.map((item, index) => (
                        <List.Item
                            key={item.id || index}
                            onClick={() => {
                                setProduct(rel => ({ ...rel, ['type']: item.id }));
                                setModalVisible(false);
                            }}
                            arrow={false}
                        >
                            {item.Name}
                        </List.Item>
                    ))}
                </List>
            </div>
        </MyModal>
    )
}

export default PaymentMethod;