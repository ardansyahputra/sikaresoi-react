// Pastikan Anda menginstal react-navigation
// npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons

import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../HomeScreen'; // Pastikan path ini benar
import KontrakKinerjaScreen from '../KontrakKinerjaScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';


function RealisasiKerjaScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Realisasi Kerja</Text>
    </View>
  );
}


// Komponen untuk masing-masing layar
function ProfileScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profil</Text>
      </View>
    );
  }

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Realisasi Kerja') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Kontrak Kinerja') {
              iconName = focused ? 'document' : 'document-outline';
            } else if (route.name === 'Profil') {
                iconName = focused ? 'person' : 'person-outline';
            }
            

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Realisasi Kerja" component={RealisasiKerjaScreen} />
        <Tab.Screen name="Kontrak Kinerja" component={KontrakKinerjaScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


    
