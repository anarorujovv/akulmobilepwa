import { StyleSheet } from 'react-native'
import React from 'react'
import { DebtGlobalProvider } from '../../shared/data/DebtGlobalState';
import DebtManage from './DebtManage';

const DebtManageProvider = ({route,navigation}) => {
    return (
        <DebtGlobalProvider>
            <DebtManage route={route} navigation={navigation}/>
        </DebtGlobalProvider>
    )
}

export default DebtManageProvider

const styles = StyleSheet.create({})