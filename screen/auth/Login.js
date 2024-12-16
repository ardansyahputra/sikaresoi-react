import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nip || !password) {
      Alert.alert('Error', 'NIP dan Password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://192.168.2.102:8000/api/v1/auth/login', {
        nip,
        password,
      });

      const { token, user } = response.data;

      // Simpan token ke AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('Success', 'Login berhasil');
      setLoading(false);

      // Arahkan ke halaman berikutnya setelah login
      navigation.replace('HomeScreen');
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Login Gagal',
        error.response?.data?.message || 'Terjadi kesalahan, coba lagi.'
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // Path gambar background
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>MASUK</Text>
        <TextInput
          style={styles.input}
          placeholder="NIP"
          value={nip}
          onChangeText={setNip}
          autoCapitalize="none"
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Pastikan gambar menutupi layar
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Efek transparan putih
    margin: 16,
    borderRadius: 10, // Untuk border kontainer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
