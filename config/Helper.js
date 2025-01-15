import * as Keychain from 'react-native-keychain';

export const getAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const { token } = JSON.parse(credentials.password); // Ambil token
      return token;
    }
    console.warn('Token tidak ditemukan di Keychain.');
    return null; // Token tidak ditemukan
  } catch (error) {
    console.error('Gagal mengambil token dari Keychain:', error);
    return null;
  }
};
