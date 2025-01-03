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
import useApiClient from '../../../src/api/apiClient';

const LoginScreen = ({navigation}) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth(); // Gunakan fungsi login dari context
  const apiClient = useApiClient(); // Gunakan API client

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials.password;
          const userData = await fetchUser(token); // Ambil data user
          if (userData) {
            login(userData, token); // Simpan data ke context
            navigation.replace('Home'); // Navigasi ke Home
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, []);

  const loginHandler = async () => {
    if (!nip || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const loginResponse = await apiClient.post('/auth/login', {
        nip,
        password,
      });

      if (loginResponse.status === 200 && loginResponse.data.status === true) {
        Alert.alert('Success', 'Login successful!');
        const token = loginResponse.headers['authorization'];
        if (token) {
          await saveTokenToKeychain(token);
          const userData = await fetchUser(token);
          if (userData) {
            login(userData, token); // Simpan data ke context
            navigation.replace('Home'); // Navigasi ke Home
          }
        } else {
          Alert.alert('Error', 'Token not found in response.');
        }
      } else {
        Alert.alert(
          'Error',
          loginResponse.data.message || 'Invalid credentials',
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An error occurred during login.',
      );
    }
  };

  const fetchUser = async token => {
    try {
      const userResponse = await apiClient.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.status === 200) {
        return userResponse.data.data; // Kembalikan data user
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

  const saveTokenToKeychain = async token => {
    try {
      await Keychain.setGenericPassword('token', token);
    } catch (error) {
      console.error('Failed to save token to Keychain:', error);
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
