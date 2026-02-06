import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SupplyManageProvider from './SupplyManageProvider';
import SupplyList from './SupplyList';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import PaymentManageProvider from './../payment/PaymentManageProvider';
import SupplyReturnManageProvider from './../supplyreturn/SupplyReturnManageProvider';


const SupplyStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation:'fade'
            }}
        >
            <Stack.Screen name="supply-list" component={SupplyList} />
            <Stack.Screen name="supply-manage" component={SupplyManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList}/>
            <Stack.Screen name='product-scanner' component={ProductScanner}/>
            <Stack.Screen name='payment' component={PaymentManageProvider}/>
            <Stack.Screen name='return' component={SupplyReturnManageProvider}/>
        </Stack.Navigator>
    )
}

export default SupplyStack

const styles = StyleSheet.create({})