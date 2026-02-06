import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from '@react-native-material/core';
import IconButton from './IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTheme from '../theme/useTheme';
import prompt from '../../services/prompt';

const PositionManageHeader = ({ navigation, handleSave, loading, id, createText, updateText,hasUnsavedChanges}) => {

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    top: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10
    },
    text: {
      fontSize: 18,
      color: theme.stable.white
    }
  })

  const handleBack = () => {
    if (hasUnsavedChanges) {
      prompt('Çıxmağa əminsiniz ?', () => {
        navigation.goBack();
      })
    } else {
      navigation.goBack();
    }
  }


  return (
    <View style={styles.top}>
      <IconButton onPress={handleBack} size={40}>
        <Ionicons name='arrow-back' size={25} color={theme.stable.white} />
      </IconButton>

      <Pressable onPress={handleSave} style={{
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}
        disabled={loading}
      >
        {
          loading ?
            <ActivityIndicator color={theme.bg} />
            :
            <Text style={styles.text}>
              {
                id == null ?
                  createText
                  :
                  updateText
              }
            </Text>
        }
      </Pressable>
    </View>
  )
}

export default PositionManageHeader;