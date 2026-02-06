import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SaleReportList from './SaleReportList';
import SaleReportManage from './SaleReportManage';

const SaleReportStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="sale-report-list" component={SaleReportList} initialParams={{
                type: "product"
            }} />
            <Stack.Screen name="sale-report-manage" component={SaleReportManage} />
        </Stack.Navigator>
    )
}

export default SaleReportStack

const styles = StyleSheet.create({})