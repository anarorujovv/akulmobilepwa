import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'

const DocumentPayment = () => {

    let theme = useTheme();

  return (
    <View style={{
        flex:1,
        backgroundColor:theme.primary
    }}>

    </View>
  )
}

export default DocumentPayment

const styles = StyleSheet.create({})