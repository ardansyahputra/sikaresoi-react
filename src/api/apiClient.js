import axios from 'axios';
//import {API_URL} from '@env';
import config from '../config/config';
import {useAuth} from '../../screen/auth/AuthContext';

const useApiClient = () => {
  const {token, logout} = useAuth(); // Logout bisa digunakan jika token expired

  // Buat instance Axios
  const apiClient = axios.create({
    baseURL: config.API_URL,
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

  // Interceptor untuk response: Tambahkan error handling global
  apiClient.interceptors.response.use(
    response => response, // Jika berhasil, langsung kembalikan response
    error => {
      // Tangani error global berdasarkan status HTTP
      if (error.response) {
        const {status, data} = error.response;

        if (status === 401) {
          // Unauthorized: Token tidak valid atau kadaluarsa
          console.error('Unauthorized: Token invalid or expired');
          if (logout) logout(); // Logout pengguna jika diperlukan
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
            data?.message || 'Something went wrong on the server.',
          );
        } else {
          // Tangani error lainnya
          console.error(
            `Error ${status}:`,
            data?.message || 'Unexpected error occurred.',
          );
        }
      } else if (error.request) {
        // Tidak ada respons dari server
        console.error('Network error: No response received from the server.');
      } else {
        // Kesalahan saat mengatur request
        console.error('Error in request setup:', error.message);
      }

      // Tetap kembalikan error agar dapat ditangani lebih lanjut di komponen
      return Promise.reject(error);
    },
  );

  return apiClient;
};

export default useApiClient;
