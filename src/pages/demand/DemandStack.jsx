import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import DemandList from './DemandList';
import DemandManageProvider from './DemandManageProvider';
import PaymentManageProvider from './../payment/PaymentManageProvider';
import DemandReturnManageProvider from './../demandreturn/DemandReturnManageProvider';
import Check from './Check';


const DemandStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="demand-list" component={DemandList} />
            <Stack.Screen name="demand-manage" component={DemandManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
            <Stack.Screen name='product-scanner' component={ProductScanner} />
            <Stack.Screen name='payment' component={PaymentManageProvider} />
            <Stack.Screen name='return' component={DemandReturnManageProvider} />
            <Stack.Screen name='check' component={Check} />

        </Stack.Navigator>
    )
}

export default DemandStack