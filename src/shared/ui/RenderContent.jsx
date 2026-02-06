import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'



const RenderContent = ({ data, ...props }) => {
    let theme = useTheme();
    return (
        typeof data == 'string' ?
            data == "loading" ?
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ActivityIndicator size={40} color={theme.primary} />
                </View>
                :
                data == "empty" ?
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color:theme.primary
                        }}>Məlumat tapılmadı!</Text>
                    </View>
                    :
                    data == 'error' ?
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color:theme.red
                            }}>Problem var!</Text>
                        </View>
                        :
                        ''
            :
            { ...props.children }
    )
}

export default RenderContent
