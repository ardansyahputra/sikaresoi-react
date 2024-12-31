import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Keychain from 'react-native-keychain';

// Import layar utama
import HomeScreen from './screen/BottomNavBar/Home/HomeScreen';
import KontrakKinerjaScreen from './screen/BottomNavBar/KontrakKinerja/KontrakKinerjaScreen';
import ProfileScreen from './screen/BottomNavBar/Profile/ProfileScreen';
import SettingJabatan from './screen/BottomNavBar/Menu/SettingJabatan/SettingJabatan';
import RealisasiKinerja from './screen/BottomNavBar/Menu/RealisasiKinerja/RealisasiKinerja';
import PresensiScreen from './screen/PresensiScreen';
import TeguranScreen from './screen/TeguranScreen'
import Allmenu from './screen/Allmenu';
import Persetujuan from './screen/Persetujuan';
import PersetujuanRealisasi from './screen/PersetujuanRealisasi';
import HistoryPresensi from './screen/HistoryPresensi';
import DataTable from './screen/DataTable';
import LoginScreen from './screen/auth/Login';
import KontrakKerja from './screen/BottomNavBar/Menu/Laporan/KontrakKerja';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Presensi" component={PresensiScreen} />
      <Stack.Screen name="Teguran" component={TeguranScreen} />
      <Stack.Screen name="Allmenu" component={Allmenu} />
      <Stack.Screen name="SettingJabatan" component={SettingJabatan} />
      <Stack.Screen name="RealisasiKinerja" component={RealisasiKinerja} />
      <Stack.Screen name="Persetujuan" component={Persetujuan} />
      <Stack.Screen name="PersetujuanRealisasi" component={PersetujuanRealisasi} />
      <Stack.Screen name="HistoryPresensi" component={HistoryPresensi} />
      <Stack.Screen name="DataTable" component={DataTable} />
      <Stack.Screen name="KontrakKerja" component={KontrakKerja} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Cek apakah token tersimpan di Keychain
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log('Credentials Retrieved:', credentials);
          setIsLoggedIn(true);
        } else {
          console.log('No Credentials Found');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Keychain Error:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkLoginStatus();
  }, []);
  
  if (loading) {
    // Tampilkan loading indikator (opsional)
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeScreen') {
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
              height: 70,
              elevation: 8,
            },
          })}
        >
          <Tab.Screen name="HomeScreen" component={HomeNavigator} />
          <Tab.Screen name="Kontrak Kinerja" component={KontrakKinerjaScreen} />
          <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
