import React, { useEffect, useState } from 'react';
import Login from './security/Login';
import { ToastProvider } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainStack from './routers/stacks/MainStack';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import useTheme from './shared/theme/useTheme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [token, setToken] = useState('');
  let theme = useTheme();

  const fetchingToken = async () => {
    let token = await AsyncStorage.getItem('token');
    setToken(token);
  };

  useEffect(() => {
    fetchingToken();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 0, backgroundColor: theme.primary }}
          edges={['top']} />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.bg }}
          edges={['left', 'right', 'bottom']}>
          <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
          <ToastProvider>
            <NavigationContainer>
              {token == '' ? '' : token === null ? <Login /> : <MainStack />}
            </NavigationContainer>
          </ToastProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;