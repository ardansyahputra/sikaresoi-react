import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import PresensiScreen from './screen/PresensiScreen';
import LoginScreen from './screen/auth/Login'; // Import LoginScreen

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Stack Navigator untuk Menu
const Stack = createNativeStackNavigator();

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

function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Presensi" component={PresensiScreen} />
    </Stack.Navigator>
  );
}

// Navigator untuk otentikasi
const AuthStack = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

// Aplikasi Utama
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cek token di AsyncStorage
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token); // Jika token ada, berarti sudah login
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Tampilkan indikator loading saat sedang memeriksa autentikasi
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Menu') {
                iconName = focused ? 'folder' : 'folder-outline';
              } else if (route.name === 'Kontrak Kinerja') {
                iconName = focused ? 'document' : 'document-outline';
              } else if (route.name === 'Profil') {
                iconName = focused ? 'person' : 'person-outline';
              }

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
          <Tab.Screen name="Home" component={HomeNavigator} />
          <Tab.Screen name="Menu" component={MenuNavigator} />
          <Tab.Screen name="Kontrak Kinerja" component={KontrakKinerjaScreen} />
          <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
