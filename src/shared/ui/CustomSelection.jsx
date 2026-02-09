import React, { useState } from 'react';
import MyModal from './MyModal';
import Input from './Input';
import useTheme from '../theme/useTheme';
import Line from './Line';

const CustomSelection = ({ options, value, onChange, title, placeholder, disabled }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const theme = useTheme();

    const styles = {
        inputWrapper: {
            width: '100%',
            cursor: !disabled ? 'pointer' : 'default'
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            color: theme.primary
        },
        option: {
            padding: 15,
            cursor: 'pointer',
            backgroundColor: theme.stable.white,
            transition: 'background-color 0.2s'
        },
        optionText: {
            fontSize: 16,
            color: '#000',
        },
        container: {
            width: '100%',
            height: '100%',
            overflowY: 'auto'
        }
    };

    const renderItem = (item) => (
        <div key={item.key}>
            <div
                style={styles.option}
                onClick={() => {
                    onChange(item.key);
                    setModalVisible(false);
                }}
            >
                <span style={styles.optionText}>{item.value}</span>
            </div>
            <Line width={'95%'} />
        </div>
    );

    const selectedValue = options.find((option) => option.key === value)?.value || '';

    return (
        <div style={{ width: '100%' }}>
            <div
                style={styles.inputWrapper}
                onClick={() => !disabled && setModalVisible(true)}
            >
                <Input
                    value={selectedValue}
                    width="100%"
                    placeholder={placeholder || title}
                    disabled={true}
                />
            </div>

            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width="90%"
                height="50%"
                center
            >
                <div style={styles.modalTitle}>{title}</div>
                <div style={styles.container}>
                    {options.map(renderItem)}
                </div>
            </MyModal>
        </div>
    );
};

export default CustomSelection;
