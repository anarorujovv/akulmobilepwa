import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable, Swipeable } from 'react-native-gesture-handler';
import useTheme from '../theme/useTheme';

const MySwipeable = ({ onPress, ...props }) => {

    let theme = useTheme();

    const styles = StyleSheet.create({
        deleteButton: {
            backgroundColor: theme.red,
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: '100%',
        },
        deleteText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
        }
    })

    const renderRightActions = () => {
        return (
            <Pressable
                style={styles.deleteButton}
                onPress={onPress}
            >
                <Text style={styles.deleteText}>Sil</Text>
            </Pressable>
        )
    }

    return (
        <Swipeable
            renderRightActions={() => renderRightActions()}
        >
            {props.children}
        </Swipeable>
    )
}

export default MySwipeable
