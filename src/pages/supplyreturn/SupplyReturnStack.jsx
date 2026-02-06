import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import SupplyReturnList from './SupplyReturnList';
import SupplyReturnManageProvider from './SupplyReturnManageProvider';
import Filter from '../../shared/ui/Filter';


const SupplyReturnStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation:'fade'
            }}
        >
            <Stack.Screen name="supply-return-list" component={SupplyReturnList} />
            <Stack.Screen name="supply-return-manage" component={SupplyReturnManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
            <Stack.Screen name='product-scanner' component={ProductScanner} />
        </Stack.Navigator>
    )
}

export default SupplyReturnStack

const styles = StyleSheet.create({})