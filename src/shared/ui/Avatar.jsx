import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'

const Avatar = ({ size, txt, imageUrl }) => {
  let theme = useTheme();

  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: 3,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{
          fontSize: 16,
          color: 'white'
        }}>{txt ? txt[0] : ""}</Text>
      )}
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({})