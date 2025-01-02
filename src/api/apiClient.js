import axios from 'axios';
import {API_URL} from '@env';
// import config from '../config/config';
import {useAuth} from '../../screen/auth/AuthContext';
import {useNavigation} from '@react-navigation/native';

const useApiClient = () => {
  const {token, refreshToken, logout} = useAuth(); // Logout bisa digunakan jika token expired
  const navigation = useNavigation();

  // Buat instance Axios
  const apiClient = axios.create({
    baseURL: API_URL,
  });

  // Interceptor untuk request: Tambahkan Authorization Header
  apiClient.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  // Interceptor untuk response: Tangani error dan refresh token jika perlu
  apiClient.interceptors.response.use(
    response => response, // Jika berhasil, langsung kembalikan response
    async error => {
      const {status} = error.response || {};

      if (status === 401) {
        // Token expired atau tidak valid
        console.error('Unauthorized: Token invalid or expired');
        const newToken = await refreshToken(); // Coba untuk refresh token
        if (newToken) {
          // Jika refresh token berhasil, ulangi permintaan yang gagal dengan token baru
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(error.config); // Ulangi permintaan yang gagal
        } else {
          logout(); // Jika refresh token gagal, logout
          navigation.replace('Login'); // Navigasi ke halaman login
        }
      } else if (status === 403) {
        // Forbidden: Pengguna tidak memiliki akses
        console.error(
          'Forbidden: You do not have permission to access this resource.',
        );
      } else if (status === 404) {
        // Not Found: Resource tidak ditemukan
        console.error('Error 404: Resource not found.');
      } else if (status >= 500) {
        // Server error
        console.error(
          'Server Error:',
          error.response?.data?.message ||
            'Something went wrong on the server.',
        );
      } else {
        console.error(
          `Error ${status}:`,
          error.response?.data?.message || 'Unexpected error occurred.',
        );
      }

      // Tetap kembalikan error agar dapat ditangani lebih lanjut di komponen
      return Promise.reject(error);
    },
  );

  return apiClient;
};

export default useApiClient;
