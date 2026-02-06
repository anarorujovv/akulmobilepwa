import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PaymentGlobalProvider } from '../../shared/data/PaymentGlobalState'
import PaymentManage from './PaymentManage'

const PaymentManageProvider = ({route,navigation}) => {

  return (
    <PaymentGlobalProvider>
      <PaymentManage route={route} navigation={navigation}/>
    </PaymentGlobalProvider>
  )

}

export default PaymentManageProvider

const styles = StyleSheet.create({})