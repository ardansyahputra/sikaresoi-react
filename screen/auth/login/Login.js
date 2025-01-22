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
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../AuthContext';
import axios from 'axios';
import useApiClient from '../../../src/api/apiClient';

const LoginScreen = ({navigation}) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const {login, token, refreshToken} = useAuth();
  const apiClient = useApiClient();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const storedToken = credentials.password;

          // Verifikasi token dengan endpoint user
          const userData = await fetchUser(storedToken);
          if (userData) {
            login(userData, storedToken);
            navigation.replace('AppTabs');
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Axios interceptor untuk menambahkan header Authorization
    const requestInterceptor = axios.interceptors.request.use(
      async config => {
        if (!config.headers.Authorization && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        // Jika token expired, refresh token
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(error.config); // Retry request dengan token baru
          } else {
            navigation.replace('Login'); // Logout jika refresh gagal
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refreshToken]);

  const loginHandler = async () => {
    console.log('Login handler triggered.');
  
    if (!nip || !password) {
      console.warn('Validation failed: Missing nip or password.');
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Log baseURL dan endpoint lengkap
    const baseURL = apiClient.defaults.baseURL || 'Base URL not set';
    const endpoint = '/auth/login';
    const fullURL = `${baseURL}${endpoint}`;
    console.log('Full API URL:', fullURL); // Log endpoint lengkap
  
    console.log('Attempting login with:', { nip, password });
  
    try {
      const response = await apiClient.post(endpoint, {
        nip,
        password,
      });
  
      console.log('Login response:', response);
  
      if (response.status === 200 && response.headers.authorization) {
        const token = response.headers.authorization;
        console.log('Token received:', token);
        await Keychain.setGenericPassword('token', token);
  
        console.log('Fetching user data with token.');
        const userData = await fetchUser(token);
        console.log('User data fetched:', userData);
  
        if (userData) {
          console.log('Login successful. Navigating to Home.');
          login(userData, token);
          navigation.replace('AppTabs');
        }
      } else {
        console.warn('Response does not contain a token:', response);
        Alert.alert('Error', 'Token not found in response.');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error(
        'Detailed error response:',
        error.response?.data || 'No response data.',
      );
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An error occurred during login.',
      );
    }
  };
  

  const fetchUser = async token => {
    try {
      const response = await apiClient.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data.data;
      } else {
        Alert.alert('Error', 'Failed to fetch user data.');
        return null;
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      Alert.alert('Error', 'An error occurred while fetching user data.');
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../admin/assets/images/poltekpol-barombong-bg.jpg')}
        style={styles.background}
      />
      <View style={styles.formContainer}>
        <Image
          source={require('../../admin/assets/images/logo-default.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Masuk</Text>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#7f8c8d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="NIP"
            placeholderTextColor="#BCC7CA"
            value={nip}
            onChangeText={setNip}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#7f8c8d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#BCC7CA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={loginHandler}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '70%',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#34495e',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#f2f3f5',
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#34495e',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  icon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#34495e',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;