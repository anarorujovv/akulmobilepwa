import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CustomerGlobalProvider } from '../../shared/data/CustomerGlobalState'
import CustomerManage from './CustomerManage'

const CustomerManageProvider = ({route,navigation}) => {

    return (
        <CustomerGlobalProvider>
            <CustomerManage route={route} navigation={navigation}/>
        </CustomerGlobalProvider>
    )
}

export default CustomerManageProvider

const styles = StyleSheet.create({})