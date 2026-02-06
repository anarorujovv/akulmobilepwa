import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CashTransactionList from './CashTransactionList';
import CashTransactionManage from './CashTransactionManage';
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
            <Stack.Screen name="cash-transaction-list" component={CashTransactionList} />
            <Stack.Screen name="cash-transaction-manage" component={CashTransactionManage} />
        </Stack.Navigator>
    )
}

export default CashTransactionStack

const styles = StyleSheet.create({})