import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Pressable } from '@react-native-material/core'
import useTheme from '../theme/useTheme'

const IconButton = ({ size,onPress,disabled, ...props }) => {

    const theme = useTheme();

    return (
        <View style={{ borderRadius: size, width: size, height: size,overflow:'hidden'
         }}>
            <Pressable disabled={disabled} onPress={onPress} style={{
                width:size,
                height:size,
                justifyContent:'center',
                alignItems:'center'
            }}
            pressEffectColor={theme.input.grey}
            >
                {props.children}
            </Pressable>
        </View>
    )
}

export default IconButton

const styles = StyleSheet.create({
})