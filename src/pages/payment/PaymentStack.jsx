import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PaymentList from './PaymentList';
import PaymentManageProvider from './PaymentManageProvider';


const DemandStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation:'fade'
            }}
        >
            <Stack.Screen name="payment-list" component={PaymentList} />
            <Stack.Screen name="payment-manage" component={PaymentManageProvider} />
        </Stack.Navigator>
    )
}

export default DemandStack

const styles = StyleSheet.create({})