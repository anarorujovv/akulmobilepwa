import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'

const NoData = () => {

  const theme = useTheme();

  const styles = StyleSheet.create({
    image:{
      width:200,
      height:200
    },  
    text:{
      fontSize:15,
      color:theme.black,
      fontWeight:'bold',
      marginTop:10,
    }
  })

  return (
    <View style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:theme.bg
    }}>
      <Text style={styles.text}>Məlumat tapılmadı!</Text>
    </View>
  )
}

export default NoData
