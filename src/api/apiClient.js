import axios from 'axios';
import {API_URL} from '@env';
import {useAuth} from '../../screen/auth/AuthContext';

const useApiClient = () => {
  const {token, refreshToken} = useAuth();

  const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000, // Timeout request untuk menghindari freeze
  });

  apiClient.interceptors.request.use(
    async config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'application/json';
      config.headers['X-requested-with'] = 'XMLHttpRequest';
      return config;
    },
    error => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    response => response,
    async error => {
      if (!error.response) {
        console.error('Network error, retrying request...');
        // Mengulang request jika tidak ada response
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            axios(error.config).then(resolve).catch(reject);
          }, 2000); // Retry after 3 seconds
        });
      }

      // Tangani status code 401 untuk refresh token
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios(error.config);
        }
      }

      return Promise.reject(error);
    },
  );

  return apiClient;
};

export default useApiClient;
