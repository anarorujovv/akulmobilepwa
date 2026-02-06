import { ActivityIndicator, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import useTheme from '../theme/useTheme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'

const Button = ({ width, onClick, icon, isLoading,disabled,bg, ...props }) => {

  const theme = useTheme();

  const gap = useSharedValue(0);
  const size = useSharedValue(0)

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      height: 50,
      backgroundColor: bg ? bg : theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      color: theme.stable.white,
      gap: gap
    },
    text: {
      fontSize: 16,
      color: theme.stable.white
    },
    buttonIcon:
    {
      color: theme.stable.white,
    }
  })

  useEffect(() => {
    if (isLoading) {
      gap.value = withSpring(10)
      size.value = withSpring(1)
    } else {
      gap.value = withSpring(0)
      size.value = withSpring(0)
    }
  }, [isLoading])

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={isLoading || disabled}
      onPress={onClick}
      style={{
        width,
        height: 50,
      }}
    >
      <Animated.View
        style={styles.button}>
        {
          isLoading ?
            <Animated.View style={{
              opacity: size
            }}>
              <ActivityIndicator size={20} color={theme.stable.white} />
            </Animated.View>
            :
            ""
        }
        {
          icon && !isLoading &&
          <Text style={[styles.buttonIcon, { marginRight: props.children ? 10 : 0 }]}>{icon}</Text>
        }
        {
          props.children &&
          <Text
            style={styles.text}
          >{props.children}</Text>
        }
      </Animated.View>
    </TouchableOpacity>
  )
}

export default Button
