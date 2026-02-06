import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import CatalogList from './CatalogList';
import CatalogManageProvider from './CatalogManageProvider';


const CatalogStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="catalog-list" component={CatalogList} />
            <Stack.Screen name="catalog-manage" component={CatalogManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
            <Stack.Screen name='product-scanner' component={ProductScanner} />
        </Stack.Navigator>
    )
}

export default CatalogStack

const styles = StyleSheet.create({})