import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Button from './Button'
import PricesModal from './modals/PricesModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../services/api'
import { formatPrice } from '../../services/formatPrice'
import ErrorMessage from './RepllyMessage/ErrorMessage'


const AllChangeProductPriceType = ({ document, setDocument, setHasUnsavedChanges }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleChangePriceType = async (item) => {
        let data = { ...document };
        let obj = {
            pricetype: item.Id,
            products: data.Positions.map(item => item.ProductId),
            token: await AsyncStorage.getItem('token')
        }

        await api('products/getproductsrate.php', obj).then(res => {
            if (res != null) {
                let doc = { ...data };
                doc.Positions.forEach(position => {
                    let foundElement = res.List.find(element => element.ProductId === position.ProductId);
                    if (foundElement) {
                        position.Price = formatPrice(foundElement.Price);
                        position.BasicPrice = formatPrice(foundElement.Price);
                        position.Discount = formatPrice(0);
                    } else {
                        position.Price = formatPrice(0);
                        position.BasicPrice = formatPrice(0);
                        position.Discount = formatPrice(0);
                    }
                });
                setDocument(doc);
                setHasUnsavedChanges(true);
            }

        }).catch(err => {
            ErrorMessage(err)
        })
    }
    return (
        <>
            <Button
                onClick={() => {
                    setModalVisible(true);
                }}
                width={'50%'}
            >
                Qiymət növlərini dəyişdir
            </Button>

            <PricesModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                pressable={handleChangePriceType}
            />
        </>
    )
}

export default AllChangeProductPriceType

const styles = StyleSheet.create({})