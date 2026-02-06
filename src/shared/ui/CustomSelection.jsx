import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import MyModal from './MyModal';
import Input from './Input';
import useTheme from '../theme/useTheme';
import Line from './Line';
import { Pressable } from '@react-native-material/core';

const CustomSelection = ({ options, value, onChange, title, placeholder, disabled }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const theme = useTheme();
    
    const styles = StyleSheet.create({
        inputWrapper: {
            width: '100%',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            color:theme.primary
        },
        option: {
            padding: 15,
        },
        optionText: {
            fontSize: 16,
            color: '#000',
        },
    });

    const renderItem = ({ item }) => (
        <>
            <Pressable
                style={styles.option}
                onPress={() => {
                    onChange(item.key);
                    setModalVisible(false);
                }}
                disabled={disabled}
            >
                <Text style={styles.optionText}>{item.value}</Text>
            </Pressable>
            <Line width={'95%'}/>
        </>
    );

    const selectedValue = options.find((option) => option.key === value)?.value || '';

    return (
        <View style={{ width: '100%' }}>
            <Pressable
                style={styles.inputWrapper}
                onPress={() => !disabled && setModalVisible(true)}
            >
                <Input
                    value={selectedValue}
                    width="100%"
                    placeholder={placeholder || title}
                    disabled={true}
                />
            </Pressable>

            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width="90%"
                height="50%"
                center
            >
                <Text style={styles.modalTitle}>{title}</Text>
                <FlatList
                    data={options}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.key}
                />
            </MyModal>
        </View>
    );
};



export default CustomSelection;
