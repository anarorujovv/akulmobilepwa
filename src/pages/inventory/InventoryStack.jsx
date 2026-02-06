import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentProductList from './../../shared/ui/DocumentProductList';
import InventoryList from './InventoryList';
import InventoryManageProvider from './InventoryManageProvider';
import InventoryPositionManage from '../../shared/ui/InventoryPositionManage';
import Filter from '../../shared/ui/Filter';


const SupplyStack = () => {
    

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="inventory-list" component={InventoryList} />
            <Stack.Screen name="inventory-manage" component={InventoryManageProvider} />
            <Stack.Screen name='product-position' component={InventoryPositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
        </Stack.Navigator>
    )
}



export default SupplyStack

const styles = StyleSheet.create({})