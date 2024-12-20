import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import Home from './screen/admin/home/home';
import Laporan from './screen/admin/laporan/Laporan';
import User from './screen/admin/user/User';
import Presensi from './screen/admin/presensi/Presensi';

// Membuat Tab dan Stack navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator utama yang berisi Tab Navigator dan DetailNavigator
function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="DetailNavigator" component={DetailNavigator} />
    </Stack.Navigator>
  );
}

// Stack Navigator untuk Layar Detail
function DetailNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DetailScreen" component={Presensi} />
    </Stack.Navigator>
  );
}


// Tab Navigator utama
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Laporan') {
            iconName = focused ? 'document' : 'remove-circle-outline';
          } else if (route.name === 'Presensi') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Laporan"
        component={Laporan}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Presensi"
        component={Presensi}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={User}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator /> {/* Gunakan MainNavigator sebagai navigator utama */}
    </NavigationContainer>
  );
}