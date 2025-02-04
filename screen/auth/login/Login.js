import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../AuthContext';
import axios from 'axios';
import useApiClient from '../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';

const {height} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({nip: '', password: ''});
  const {login, token, refreshToken} = useAuth();
  const apiClient = useApiClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(true); // Menambahkan state isMounted
  const isValid = nip.length >= 8 && password.length >= 8;

  useEffect(() => {
    setIsMounted(true); // Menandai komponen sebagai terpasang
    return () => setIsMounted(false); // Menandai komponen sebagai tidak terpasang saat komponen dibersihkan
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Mengambil token dari Keychain
        const credentials = await Keychain.getGenericPassword();
        if (credentials && credentials.password) {
          // Jika token ditemukan, lakukan login otomatis
          const storedToken = credentials.password;
          const token = credentials.password;
          const userData = await fetchUser(storedToken);
          login(userData, token); // login dengan token saja, tidak perlu user data
          navigation.replace('AppTabs'); // Langsung ke AppTabs jika sudah login
        } else {
          // Jika token tidak ada, tetap di layar login
          console.log('No token found, please login.');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (!error.response) {
          console.error('Network error, please check your connection.');
          return Promise.reject(error);
        }

        if (error.response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(error.config);
          } else {
            logout();
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refreshToken, isMounted]);

  const loginHandler = async () => {
    if (!isValid) return;

    setIsLoading(true);
    setError({nip: '', password: ''});

    try {
      const response = await apiClient.post('/auth/login', {nip, password});

      // Memeriksa apakah status berhasil
      if (response.status === 200 && response.headers['authorization']) {
        const token = response.headers['authorization']; // Token dari header 'Authorization'
        await Keychain.setGenericPassword('token', token); // Menyimpan token di Keychain

        // Menyertakan token di header untuk permintaan berikutnya
        const userData = await fetchUser(token); // Menyertakan token untuk mengambil data user

        if (userData) {
          login(userData, token);
          navigation.replace('AppTabs');
        } else {
          setError({
            nip: 'Invalid NIP or password',
            password: 'Invalid NIP or password',
          });
        }
      } else {
        setError({
          nip: 'Invalid NIP or password',
          password: 'Invalid NIP or password',
        });
      }
    } catch (error) {
      setError({
        nip: 'Invalid NIP or password',
        password: 'Invalid NIP or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async token => {
    try {
      const response = await apiClient.get('/auth/user', {
        headers: {Authorization: `Bearer ${token}`}, // Pastikan token dikirim dalam header Authorization
      });
      console.log('Fetched user data:', response.data);
      return response.data?.data || null;
    } catch (error) {
      console.error('Fetch user error:', error);
      return null;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../admin/assets/images/poltekpol-barombong-bg.jpg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.formContainer}>
        <Image
          source={require('../../admin/assets/images/logo-default.png')}
          style={styles.logo}
        />
        <View style={[styles.inputContainer, error.nip && styles.inputError]}>
          <Ionicons
            name={'person'}
            color="#7f8c8d"
            size={15}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="NIP"
            placeholderTextColor="#BCC7CA"
            value={nip}
            onChangeText={setNip}
          />
          {error.nip && <Text style={styles.errorText}>{error.nip}</Text>}
        </View>
        <View
          style={[styles.inputContainer, error.password && styles.inputError]}>
          <Ionicons
            name={'lock-closed'}
            color="#7f8c8d"
            size={15}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#BCC7CA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          {error.password && (
            <Text style={styles.errorText}>{error.password}</Text>
          )}
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="#7f8c8d"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={loginHandler}
          disabled={!isValid || isLoading}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <BarIndicator color="black" size={24} count={5} />
            <Text style={styles.loadingText}>Memuat...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    width: '100%',
    height: height * 0.8,
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Efek overlay jika ingin ditambahkan
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 10,
    zIndex: 5,
  },
  logo: {
    width: 180,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#f2f3f5',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginRight: 10,
  },
  icon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 15,
    fontSize: 12,
    color: '#34495e',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(54, 54, 54, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingBox: {
    width: '70%',
    maxWidth: 200,
    height: 120,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 12,
  },

  eyeIcon: {
    paddingRight: 10,
  },
});

export default LoginScreen;
