import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ExpeditorList from './ExpeditorList';
import ExpeditorManage from './ExpeditorManage';
import CasheManage from './../cashe/CasheManage';


const ExpeditorStack = () => {
    

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade'
            }}
        >
            <Stack.Screen name="expeditor-list" component={ExpeditorList} />
            <Stack.Screen name="expeditor-manage" component={ExpeditorManage} />
            <Stack.Screen name='cashe-manage' component={CasheManage}/>
        </Stack.Navigator>
    )
}



export default ExpeditorStack

const styles = StyleSheet.create({})