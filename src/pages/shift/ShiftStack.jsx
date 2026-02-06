import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ShiftManage from './ShiftManage';
import ShiftList from './ShiftList';

const ShiftStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator

            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="shift-list" component={ShiftList} />
            <Stack.Screen name="shift-manage" component={ShiftManage} />
        </Stack.Navigator>
    )
}

export default ShiftStack

const styles = StyleSheet.create({})