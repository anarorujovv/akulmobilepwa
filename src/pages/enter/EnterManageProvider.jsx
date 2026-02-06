import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { EnterGlobalProvider } from '../../shared/data/EnterGlobalState';
import EnterManage from './EnterManage';

const EnterManageProvider = ({route,navigation}) => {
  return (
    <EnterGlobalProvider>
        <EnterManage route={route} navigation={navigation}/>
    </EnterGlobalProvider>
  )
}

export default EnterManageProvider

const styles = StyleSheet.create({})