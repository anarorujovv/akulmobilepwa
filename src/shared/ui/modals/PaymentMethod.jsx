import React, { useState } from 'react';
import MyModal from './../MyModal';
import useTheme from '../../theme/useTheme';
import Line from '../Line';

const PaymentMethod = ({
    modalVisible,
    setModalVisible,
    setProduct
}) => {

    const theme = useTheme();

    const [methods, setMethods] = useState([
        {
            id: 'payment',
            Name: 'Nağd'
        },
        {
            id: "invoice",
            Name: "Köçürmə"
        }
    ]);


    const renderItem = (item, index) => {
        return (
            <div key={item.id || index} style={{ width: '100%' }}>
                <div onClick={() => {
                    setProduct(rel => ({ ...rel, ['type']: item.id }));
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

    const styles = {
        listContainer: {
            width: '100%',
            height: '100%',
            overflowY: 'auto'
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
        >
            <div style={styles.listContainer}>
                {
                    methods[0] ?
                        methods.map((item, index) => renderItem(item, index))
                        :
                        <div style={styles.loadingContainer}>
                            <div className="spinner"></div>
                        </div>
                }
            </div>
        </MyModal>
    )
}

export default PaymentMethod;