import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StockBalanceList from './StockBalanceList';
import StockBalanceManage from './StockBalanceManage';
import Filter from '../../shared/ui/Filter';
import ProductScanner from '../product/ProductScanner';

const StockBalanceStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}>
            <Stack.Screen name="stock-list" component={StockBalanceList} initialParams={{
                type: "product"
            }} />

            <Stack.Screen name="stock-manage" component={StockBalanceManage} />
            <Stack.Screen name='check' component={ProductScanner} />
        </Stack.Navigator>
    )
}

export default StockBalanceStack

const styles = StyleSheet.create({})