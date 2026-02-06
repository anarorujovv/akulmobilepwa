import { StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'

const MySwitch = ({
    value,
    onChange,
    text,
    width,
    disabled
}) => {

    let theme = useTheme();

    return (
        <View style={{
            width,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <Text style={{
                color:theme.grey
            }}>{text}</Text>
            <Switch
            disabled={disabled}
                trackColor={{ false: theme.input.greyWhite, true: theme.button.disabled }}
                thumbColor={value ? theme.primary : theme.input.grey}
                onValueChange={onChange}
                value={value}
            />
        </View>
    )
}

export default MySwitch