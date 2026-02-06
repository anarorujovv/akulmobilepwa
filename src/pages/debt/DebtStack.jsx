import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DebtList from './DebtList';
import DebtManageProvider from './DebtManageProvider';
import Filter from '../../shared/ui/Filter';

const DemandStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="debt-list" component={DebtList} />
            <Stack.Screen name="debt-manage" component={DebtManageProvider} />
        </Stack.Navigator>
    )
}

export default DemandStack

const styles = StyleSheet.create({})