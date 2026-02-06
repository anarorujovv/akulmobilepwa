import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentProductList from './../../shared/ui/DocumentProductList';
import PositionManage from './../../shared/ui/PositionManage';
import EnterList from './EnterList';
import EnterManageProvider from './EnterManageProvider';
import ProductScanner from '../product/ProductScanner';


const EnterStack = () => {


    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="enter-list" component={EnterList} />
            <Stack.Screen name="enter-manage" component={EnterManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
            <Stack.Screen name='product-scanner' component={ProductScanner} />
        </Stack.Navigator>
    )
}



export default EnterStack

const styles = StyleSheet.create({})