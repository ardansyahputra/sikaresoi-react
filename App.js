import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import layar utama
import HomeScreen from './screen/BottomNavBar/Home/HomeScreen';
import MenuScreen from './screen/BottomNavBar/Menu/MenuScreen';
import KontrakKinerjaScreen from './screen/BottomNavBar/KontrakKinerja/KontrakKinerjaScreen';
import ProfileScreen from './screen/BottomNavBar/Profile/ProfileScreen';
import SettingJabatan from './screen/BottomNavBar/Menu/SettingJabatan/SettingJabatan';
import RealisasiKinerja from './screen/BottomNavBar/Menu/RealisasiKinerja/RealisasiKinerja';
import Persetujuan from './screen/BottomNavBar/Home/Persetujuan/Persetujuan';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Login Screen
function LoginScreen({ navigation }) {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://your-backend-api.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nip,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token); // Simpan token dari respons
        navigation.replace('HomeTabs'); // Pindah ke tab Home
      } else {
        Alert.alert('Login Gagal', data.message || 'NIP atau password salah.');
      }
    } catch (error) {
      Alert.alert('Kesalahan', 'Terjadi masalah jaringan atau server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>MASUK</Text>
      <TextInput
        style={styles.input}
        placeholder="NIP"
        value={nip}
        onChangeText={setNip}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Masuk" onPress={handleLogin} />
      )}
    </View>
  );
}

// Menu Navigator (Nested Stack)
function MenuNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="SettingJabatan" component={SettingJabatan} />
      <Stack.Screen name="RealisasiKinerja" component={RealisasiKinerja} />
      <Stack.Screen name="Persetujuan" component={Persetujuan} />
    </Stack.Navigator>
  );
}

// Bottom Tabs
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Menu') iconName = focused ? 'folder' : 'folder-outline';
          else if (route.name === 'Kontrak Kinerja') iconName = focused ? 'document' : 'document-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          height: 70,
          elevation: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuNavigator} />
      <Tab.Screen name="Kontrak Kinerja" component={KontrakKinerjaScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Aplikasi Utama
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Memuat...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styling
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f8ffb3', // Transparansi 70%
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
