import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../../shared/theme/useTheme'

const ProductTransactionsManage = () => {

  let theme = useTheme();

  return (
    <View style={{
      flex:1,
      backgroundColor:theme.whiteGrey
    }}>
      <Text>ProductTransactionsManage</Text>
    </View>
  )
}

export default ProductTransactionsManage

const styles = StyleSheet.create({})