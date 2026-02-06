import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MyModal from './../MyModal';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';

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


    const renderItem = ({ item, index }) => {
        return (
            <>
                <Pressable onPress={() => {
                    setProduct(rel => ({ ...rel, ['type']: item.id }));
                    setModalVisible(false);
                }} pressEffectColor={theme.input.grey} style={{
                    width: '100%',
                    height: 55,
                    paddingLeft: 20,
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: theme.black,
                        fontSize: 13
                    }}>{item.Name}</Text>
                </Pressable>
                <Line width={'90%'} />
            </>
        )
    }


    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
            height={"100%"}
        >
            <View style={{
                width: '100%',
                height: '100%'
            }}>
                {
                    methods[0] ?
                        <FlatList
                            data={methods}
                            renderItem={renderItem}
                        />
                        :
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator size={40} color={theme.primary} />
                        </View>
                }
            </View>
        </MyModal>
    )
}

export default PaymentMethod

const styles = StyleSheet.create({})