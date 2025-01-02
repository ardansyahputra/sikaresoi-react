import React, {createContext, useState, useContext} from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Keychain.resetGenericPassword();
    navigation.replace('Login');
  };

  // Fungsi untuk refresh token
  const refreshToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const refreshToken = credentials.password; // Dapatkan refresh token dari Keychain

        const response = await axios.post(
          'http://192.168.60.85:8000/api/v1/auth/refresh', // Endpoint untuk refresh token
          {refresh_token: refreshToken}, // Kirim refresh token ke server
        );

        if (response.status === 200) {
          const newToken = response.data.token;
          await Keychain.setGenericPassword('token', newToken); // Simpan token baru
          setToken(newToken); // Update token di context
          return newToken;
        } else {
          logout(); // Jika refresh gagal, logout
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{user, token, login, logout, refreshToken}}>
      {children}
    </AuthContext.Provider>
  );
};
