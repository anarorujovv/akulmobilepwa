import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'

const Line = ({width}) => {

    const theme = useTheme();

  return (
    <View style={{
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    }}>
        <View style={{
            width,
            height:0.8,
            backgroundColor:theme.whiteGrey
        }}/>
    </View>
  )
}

export default Line

const styles = StyleSheet.create({})