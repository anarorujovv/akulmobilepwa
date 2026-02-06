import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductTransactionsList from './ProductTransactionsList';
import ProductTransactionsManage from './ProductTransactionsManage';

const ProductTransactionsStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="product-transactions-list" component={ProductTransactionsList} />
            <Stack.Screen name="product-transactions-manage" component={ProductTransactionsManage} />
        </Stack.Navigator>
    )
}

export default ProductTransactionsStack

const styles = StyleSheet.create({})