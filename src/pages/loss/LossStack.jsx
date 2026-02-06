import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentProductList from './../../shared/ui/DocumentProductList';
import PositionManage from './../../shared/ui/PositionManage';
import LossList from './LossList';
import LossManageProvider from './LossManageProvider';


const LossStack = () => {


    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="loss-list" component={LossList} />
            <Stack.Screen name="loss-manage" component={LossManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
        </Stack.Navigator>
    )
}



export default LossStack

const styles = StyleSheet.create({})