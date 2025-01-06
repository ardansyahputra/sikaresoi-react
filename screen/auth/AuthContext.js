import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children, navigation}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling

  const loadTokenFromKeychain = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      setToken(credentials.password); // Set token from Keychain if it exists
    }
  };

  useEffect(() => {
    loadTokenFromKeychain(); // Load token when app starts
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    Keychain.setGenericPassword('token', token); // Store token securely
  };

  const logout = navigation => {
    setUser(null);
    setToken(null);
    Keychain.resetGenericPassword(); // Remove token from Keychain
    if (navigation) {
      navigation.replace('Login');
    }
  };

  // Fungsi untuk refresh token
  const refreshToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const refreshToken = credentials.password;

        const response = await axios.post(
          'http://192.168.60.85:8000/api/v1/auth/refresh',
          {refresh_token: refreshToken},
        );

        if (response.status === 200) {
          const newToken = response.data.token;
          await Keychain.setGenericPassword('token', newToken);
          setToken(newToken);
          return newToken;
        } else {
          logout(navigation);
        }
      }
    } catch (error) {
      logout(navigation);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{user, token, login, logout, refreshToken, loading, error}}>
      {children}
    </AuthContext.Provider>
  );
};
