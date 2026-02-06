import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomerOrderList from './CustomerOrderList';
import CustomerOrderManageProvider from './CustomerOrderManageProvider';
import PositionManage from '../../shared/ui/PositionManage';
import DocumentProductList from '../../shared/ui/DocumentProductList';
import Filter from '../../shared/ui/Filter';
import PaymentManageProvider from '../payment/PaymentManageProvider';
import ProductScanner from '../product/ProductScanner';

const CustomerOrderStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="customer-order-list" component={CustomerOrderList} initialParams={{
                type: "product"
            }} />
            <Stack.Screen name="customer-order-manage" component={CustomerOrderManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
            <Stack.Screen name='product-scanner' component={ProductScanner} />
            <Stack.Screen name='payment' component={PaymentManageProvider} />
        </Stack.Navigator>
    )
}

export default CustomerOrderStack

const styles = StyleSheet.create({})