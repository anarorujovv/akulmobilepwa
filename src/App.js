import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './security/Login';
import AsyncStorage from './services/AsyncStorageWrapper';
import MainStack from './routers/stacks/MainStack';
import useTheme from './shared/theme/useTheme';
import InstallPWAModal from './shared/ui/InstallPWAModal';

const App = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  let theme = useTheme();

  const fetchingToken = async () => {
    let storedToken = await AsyncStorage.getItem('token');
    setToken(storedToken);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchingToken();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.bg
      }}>
        <div className="spinner" style={{
          width: 40,
          height: 40,
          border: `3px solid ${theme.input.grey}`,
          borderTop: `3px solid ${theme.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: theme.bg
    }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <InstallPWAModal />
      <BrowserRouter>
        {token === null ? (
          <Login />
        ) : token === '' ? (
          <Login />
        ) : (
          <MainStack />
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;