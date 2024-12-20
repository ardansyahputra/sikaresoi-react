import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import layar utama
import HomeScreen from './screen/BottomNavBar/Home/HomeScreen';
import KontrakKinerjaScreen from './screen/BottomNavBar/KontrakKinerja/KontrakKinerjaScreen';
import ProfileScreen from './screen/BottomNavBar/Profile/ProfileScreen';
import SettingJabatan from './screen/BottomNavBar/Menu/SettingJabatan/SettingJabatan';
import RealisasiKinerja from './screen/BottomNavBar/Menu/RealisasiKinerja/RealisasiKinerja';
import PresensiScreen from './screen/PresensiScreen';
import Allmenu from './screen/Allmenu';
import Persetujuan from './screen/Persetujuan';
import PersetujuanR from './screen/PersetujuanR';
import HistoryPresensi from './screen/HistoryPresensi';
import DataTable from './screen/DataTable';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Stack Navigator untuk Menu
const Stack = createNativeStackNavigator();

function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Presensi" component={PresensiScreen} />
      <Stack.Screen name="Allmenu" component={Allmenu} />
      <Stack.Screen name="SettingJabatan" component={SettingJabatan} />
      <Stack.Screen name="RealisasiKinerja" component={RealisasiKinerja} />
      <Stack.Screen name="Persetujuan" component={Persetujuan} />
      <Stack.Screen name="PersetujuanR" component={PersetujuanR} />
      <Stack.Screen name="HistoryPresensi" component={HistoryPresensi} />
      <Stack.Screen name="DataTable" component={DataTable} />
    </Stack.Navigator>
  );
}

// Aplikasi Utama
export default function App() {
  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

    // Sembunyikan tab bar untuk layar tertentu
    if (
      routeName === 'Presensi' ||
      routeName === 'Allmenu' ||
      routeName === 'SettingJabatan' ||
      routeName === 'RealisasiKinerja' ||
      routeName === 'Persetujuan' ||
      routeName === 'PersetujuanR' ||
      routeName === 'HistoryPresensi'
    ) {
      return false;
    }
    return true;
  };

  return (
    <NavigationContainer>
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
            height: getTabBarVisibility(route) ? 70 : 0,
            elevation: 8,
            display: getTabBarVisibility(route) ? 'flex' : 'none', // Sembunyikan tab bar
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="Kontrak Kinerja" component={KontrakKinerjaScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
