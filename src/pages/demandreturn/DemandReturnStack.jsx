import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import DemandReturnList from './DemandReturnList';
import DemandReturnManageProvider from './DemandReturnManageProvider';
import Filter from '../../shared/ui/Filter';
import PaymentManageProvider from './../payment/PaymentManageProvider';


const DemandReturnStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation:'fade'
            }}
        >
            <Stack.Screen name="demand-return-list" component={DemandReturnList} />
            <Stack.Screen name="demand-return-manage" component={DemandReturnManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
            <Stack.Screen name='product-scanner' component={ProductScanner} />
            <Stack.Screen name='payment' component={PaymentManageProvider}/>
        </Stack.Navigator>
    )
}

export default DemandReturnStack

const styles = StyleSheet.create({})