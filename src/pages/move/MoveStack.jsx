import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentProductList from './../../shared/ui/DocumentProductList';
import MoveList from './MoveList';
import MoveManageProvider from './MoveManageProvider';
import PositionManage from './../../shared/ui/PositionManage';


const MoveStack = () => {


    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="move-list" component={MoveList} />
            <Stack.Screen name="move-manage" component={MoveManageProvider} />
            <Stack.Screen name='product-position' component={PositionManage} />
            <Stack.Screen name='product-list' component={DocumentProductList} />
        </Stack.Navigator>
    )
}



export default MoveStack

const styles = StyleSheet.create({})