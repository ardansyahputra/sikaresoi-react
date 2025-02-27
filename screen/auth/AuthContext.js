import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '@env';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children, navigation}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userMenu, setUserMenu] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [pangkatItems, setPangkatItems] = useState([]);

  const loadTokenFromKeychain = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      setToken(credentials.password); // Set token from Keychain if it exists
    }
  };

  const setMenuAccess = menu => {
    setUserMenu(menu);
  };

  // Fungsi untuk fetch data pangkat
  const fetchPangkat = async () => {
    try {
      const response = await axios.get(`${API_URL}/pangkat/show`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pangkatList = response.data?.data;

      if (Array.isArray(pangkatList)) {
        const formattedItems = pangkatList.map(item => ({
          label: `${item.nm_pangkat} (${item.golongan}/${item.ruang || '-'})`,
          value: item.id,
        }));
        setPangkatItems(formattedItems);
      } else {
        console.error('Pangkat list is not an array:', pangkatList);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          await fetchPangkat(); // Coba ulang setelah token diperbarui
        } else {
          logout();
        }
      } else {
        console.error('Error fetching pangkat:', error);
      }
    }
  };

  useEffect(() => {
    const loadTokenFromKeychain = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setToken(credentials.password);
      }
    };
    loadTokenFromKeychain();
  }, []);

  useEffect(() => {
    if (token) {
      fetchPangkat(); // Fetch pangkat items when token is available
    }
  }, [token]);

  const login = async (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    await Keychain.setGenericPassword('token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserMenu([]);
    Keychain.resetGenericPassword();
  };

  // Fungsi untuk refresh token
  const refreshToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username === 'authToken') {
        const refreshToken = credentials.password;

        const response = await axios.get(`${API_URL}auth/refresh`, {
          headers: {Authorization: `Bearer ${refreshToken}`},
        });

        if (response.status === 200) {
          const newToken = response.headers.authorization; // Ambil dari header
          await Keychain.setGenericPassword('authToken', newToken);
          setToken(newToken);
          return newToken;
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userMenu,
        setUserMenu: setMenuAccess,
        login,
        logout,
        fetchPangkat,
        pangkatItems,
        refreshToken,
        loading,
        error,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
