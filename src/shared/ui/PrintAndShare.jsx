import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import ViewShot from 'react-native-view-shot';
import WebView from 'react-native-webview';
import Entypo from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share'
import RNPrint from 'react-native-print';
import useTheme from '../theme/useTheme';
import ErrorMessage from './RepllyMessage/ErrorMessage';

const PrintAndShare = ({ navigation, route }) => {

    const { html } = route.params;
    let theme = useTheme();

    const ref = useRef();

    const getShare = () => {
        try {
            ref.current.capture().then(async (uri) => {

                const shareOptions = {
                    title: "Share PNG",
                    url: `file://${uri}`,
                    type: 'application/png',
                }

                Share.open(shareOptions).catch(err => {
                    throw err;
                })

            })
        } catch (err) {
            ErrorMessage(err);
        }
    }

    const getPrint = async () => {
        try{
            await RNPrint.print({
                html: html,
                fileName: 'PrintDocument',
            });
        }catch(err){
            ErrorMessage(err);
        }
    }

    const styles = StyleSheet.create({
        button: {
            position: 'absolute',
            bottom: 40,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            elevation: 10
        },
        buttonPrint: {
            position: 'absolute',
            bottom: 40,
            left: 20,
            width: 60,
            height: 60,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            elevation: 10
        }
    })

    return (
        <View style={{ flex: 1, }}>
            <ViewShot style={{ flex: 1 }} ref={ref} options={{ fileName: 'screen', format: 'png', quality: 0.9 }}>
                <WebView source={{ html }} style={{ flex: 1 }} />
            </ViewShot>
            <TouchableOpacity onPress={getShare} style={styles.button}>
                <Entypo name='share' size={25} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={getPrint} style={styles.buttonPrint}>
                <Entypo name='print' size={25} color={'white'} />
            </TouchableOpacity>

        </View>
    )
}

export default PrintAndShare
