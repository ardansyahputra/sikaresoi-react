import axios from 'axios';
import {API_URL} from '@env';
import {useAuth} from '../../screen/auth/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {useMemo} from 'react';

const useApiClient = () => {
  const {token, refreshToken, setToken, logout} = useAuth(); // Tambahkan setToken dari AuthContext
  const navigation = useNavigation();

  // Use useMemo to cache the axios instance
  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      // Add default headers and optimizations
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        : {},
      timeout: 10000, // Set reasonable timeout
      // Additional axios configs for performance
      validateStatus: status => status >= 200 && status < 300, // Only resolve for success status
      maxRedirects: 5,
      transitional: {
        clarifyTimeoutError: true,
      },
    });

    // Simplified request interceptor
    instance.interceptors.request.use(
      config => {
        // Only modify headers if they need to be updated
        if (
          token &&
          (!config.headers.Authorization ||
            !config.headers.Authorization.includes(token))
        ) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Optimized response interceptor
    instance.interceptors.response.use(
      response => response, // Return successful response
      async error => {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshToken();
            if (newToken) {
              // Update token in AuthContext
              setToken(newToken);

              // Update Authorization header
              error.config.headers.Authorization = `Bearer ${newToken}`;

              // Retry the original request with updated headers
              return instance(error.config);
            }
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);

            // Ensure token is cleared from context or storage
            logout(); // This will handle navigating to 'Login'
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [token, refreshToken, setToken, logout, navigation]); // Tambahkan setToken ke dependency useMemo

  return apiClient;
};

export default useApiClient;