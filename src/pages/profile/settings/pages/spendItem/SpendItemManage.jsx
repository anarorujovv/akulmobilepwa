import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../../../../../shared/theme/useTheme'

const SpendItemManage = () => {

  let theme = useTheme();

  const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:theme.bg
    },
  })

  return (
    <View style={styles.container}>

    </View>
  )
}

export default SpendItemManage

