import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../HomeScreen'; // Pastikan path ini benar
import KontrakKinerjaScreen from '../KontrakKinerjaScreen';
import ProfileScreen from '../ProfileScreen';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Ardan from 'react-native-vector-icons/MaterialIcons';
import Gusti from 'react-native-vector-icons/FontAwesome';
import Gus from 'react-native-vector-icons/FontAwesome6';

const colors = ['#1c7aff', '#ff1c1c', '#ff7e1c', '#f719ff', '#999699', '#0da186'];

const Menu = ({ navigation }) => {
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


    
