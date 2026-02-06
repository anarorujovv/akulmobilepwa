import { StyleSheet, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTheme from './../theme/useTheme';
import { Pressable } from '@react-native-material/core';

const FabButton = ({ onPress }) => {

    let theme = useTheme();

    const styles = StyleSheet.create({
        addButtonContainer: {
            width: 60,
            height: 60,
            borderRadius: 70,
            backgroundColor: theme.pink,
            position: 'absolute',
            bottom: 30,
            right: 20,
            elevation: 10,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          },
          addButton: {
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center'
          },
    })
    return (
        <View style={styles.addButtonContainer}>
            <Pressable
                style={styles.addButton}
                onPress={onPress}
            >
                <Ionicons name='add-outline' size={25} color={theme.bg} />
            </Pressable>
        </View>
    )
}

export default FabButton
