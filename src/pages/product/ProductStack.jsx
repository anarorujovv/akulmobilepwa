import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductList from './ProductList';
import ProductManageProvider from './ProductManageProvider';
import ProductScanner from './ProductScanner';
import Filter from './../../shared/ui/Filter';

const ProductStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="product-list" component={ProductList} initialParams={{
                type: "product"
            }} />
            <Stack.Screen name="product-manage" component={ProductManageProvider} />
            <Stack.Screen name="product-scanner" component={ProductScanner} />
        </Stack.Navigator>
    )
}

export default ProductStack

const styles = StyleSheet.create({})