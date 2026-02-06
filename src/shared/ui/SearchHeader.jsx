import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconButton from './IconButton'

const SearchHeader = ({onPress,value,onChange,placeholder}) => {

  const theme = useTheme();

  return (
    <View style={{
      backgroundColor: theme.bg,
      height: 55,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      borderBottomWidth:1,
      borderColor:theme.input.greyWhite
    }}>
      <View style={{
        width: '15%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <IconButton onPress={onPress} size={40}>
          <Ionicons name='arrow-back' size={25} color={theme.grey} />
        </IconButton>
      </View>
      <View
        style={{
          width: '75%',
          height: '100%',
          alignItems: 'cente'
        }}
      >
        <TextInput
          style={{
            fontSize: 16,
            width: '100%',
            color:theme.black,
            height:55
          }}
          value={value}
          onChangeText={(e) => {
            onChange(e);
          }}
          cursorColor={theme.primary}
          placeholder={placeholder}
        />
      </View>
    </View>
  )
}

export default SearchHeader

const styles = StyleSheet.create({})