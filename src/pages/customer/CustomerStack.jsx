import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomerManageProvider from './CustomerManageProvider';
import CustomerList from './CustomerList';

const CustomerStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation:'fade'
            }}
        >
            <Stack.Screen name="customer-list" component={CustomerList} initialParams={{
                type: "product"
            }} />
            <Stack.Screen name="customer-manage" component={CustomerManageProvider} />
        </Stack.Navigator>
    )
}

export default CustomerStack

const styles = StyleSheet.create({})