import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '@env';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userMenu, setUserMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pangkatItems, setPangkatItems] = useState([]);

  const loadTokenFromKeychain = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      setToken(credentials.password);
    }
  };

  // Function to check if user has access to a specific route
  const hasMenuAccess = route => {
    return userMenu.some(menu => menu.nm_route === route);
  };

  // Function to get all accessible routes
  const getAccessibleRoutes = () => {
    return userMenu.map(menu => menu.nm_route);
  };

  // Function to fetch menu access from API
  const fetchMenuAccess = async (authToken = null) => {
    try {
      const tokenToUse = authToken || token;

      if (!tokenToUse) {
        console.error('No token available for fetching menu access');
        return [];
      }

      const response = await axios.get(`${API_URL}routes/access`, {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });

      if (response.data?.data) {
        // Flatten the menu structure to include nested child items
        const flattenMenu = menu => {
          return menu.reduce((acc, item) => {
            acc.push(item); // Add the current item
            if (item.child && Array.isArray(item.child)) {
              acc.push(...flattenMenu(item.child)); // Recursively add child items
            }
            return acc;
          }, []);
        };

        const flattenedMenu = flattenMenu(response.data.data);
        setUserMenu(flattenedMenu);
        console.log(flattenedMenu);
        console.log('Menu access updated successfully');
        return flattenedMenu;
      }
      return [];
    } catch (error) {
      console.error('Error fetching menu access:', error);
      // If token is expired, try to refresh and retry
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          return fetchMenuAccess(newToken); // Retry with new token
        }
      }
      return [];
    }
  };

  const fetchPangkat = async () => {
    try {
      const response = await axios.get(`${API_URL}pangkat/show`, {
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

  const login = async (userData, newToken) => {
    try {
      setLoading(true);
      setUser(userData);
      setToken(newToken);
      await Keychain.setGenericPassword('token', newToken);

      // Fetch menu access after successful login
      const menuAccess = await fetchMenuAccess(newToken);
      setUserMenu(menuAccess);
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to complete login process');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserMenu([]);
    Keychain.resetGenericPassword();
  };

  // Refresh token implementation with menu access update
  const refreshToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const refreshToken = credentials.password;

        const response = await axios.post(`${API_URL}auth/refresh`, {
          refresh_token: refreshToken,
        });

        if (response.status === 200) {
          const newToken = response.data.token;
          await Keychain.setGenericPassword('token', newToken);
          setToken(newToken);

          // Update menu access with new token
          await fetchMenuAccess(newToken);
          return newToken;
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
    return null;
  };

  useEffect(() => {
    loadTokenFromKeychain();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userMenu,
        loading,
        error,
        login,
        logout,
        refreshToken,
        fetchPangkat,
        hasMenuAccess,
        getAccessibleRoutes,
        pangkatItems,
        fetchMenuAccess,
      }}>
      {children}
    </AuthContext.Provider>
  );
};