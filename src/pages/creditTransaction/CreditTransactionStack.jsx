import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreditTransactionList from './CreditTransactionList';
import Filter from '../../shared/ui/Filter';


const CashTransactionStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation:'fade'
            }}            
        >
            <Stack.Screen name="credit-transaction-list" component={CreditTransactionList} />
        </Stack.Navigator>
    )
}

export default CashTransactionStack

const styles = StyleSheet.create({})