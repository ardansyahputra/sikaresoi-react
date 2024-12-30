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
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../AuthContext'; // Import useAuth untuk konteks autentikasi

const LoginScreen = ({navigation}) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth(); // Ambil fungsi login dari context

  // Periksa status login di awal aplikasi
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials.password;
          await fetchUser(token); // Ambil data user dengan token
          navigation.replace('Home'); // Langsung masuk ke Home jika token valid
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
      const loginResponse = await axios.post(
        'http://192.168.60.85:8000/api/v1/auth/login',
        {nip, password},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (loginResponse.status === 200 && loginResponse.data.status === true) {
        Alert.alert('Success', 'Login successful!');
        const token = loginResponse.headers['authorization'];
        if (token) {
          await saveTokenToKeychain(token);
          await fetchUser(token);
          navigation.replace('Home');
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
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An error occurred during login.',
      );
    }
  };

  const fetchUser = async token => {
    try {
      const userResponse = await axios.get(
        'http://192.168.60.85:8000/api/v1/auth/user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      if (userResponse.status === 200) {
        const userData = userResponse.data.data;
        login(userData, token); // Menyimpan user dan token ke context
      } else {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching user data.');
    }
  };

  const saveTokenToKeychain = async token => {
    try {
      await Keychain.setGenericPassword('token', token);
    } catch (error) {
      console.error('Failed to save token to Keychain:', error);
    }
  };

  const getTokenFromKeychain = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        await fetchUser(credentials.password);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to retrieve token from Keychain:', error);
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
