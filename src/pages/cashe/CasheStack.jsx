import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CasheList from './CasheList';
import CasheManage from './CasheManage';
import CasheCreate from './CasheCreate';


const DemandStack = () => {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade'
      }}
    >
      <Stack.Screen name="cashe-list" component={CasheList} />
      <Stack.Screen name="cashe-manage" component={CasheManage} />
      <Stack.Screen name="cashe-create" component={CasheCreate} />
    </Stack.Navigator>
  )
}

export default DemandStack

const styles = StyleSheet.create({})