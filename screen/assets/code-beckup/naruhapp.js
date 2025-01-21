import React from 'react';
import {AuthProvider} from './screen/auth/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NavigationProvider,
  useNavigationContext,
} from './src/navigation/NavigationContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

//login screens
import LoginScreen from './screen/auth/login/Login';
import HomeScreen from './screen/BottomNavBar/Home/HomeScreen';
import KontrakKinerjaScreen from './screen/BottomNavBar/KontrakKinerja/KontrakKinerjaScreen';
import ProfileScreen from './screen/BottomNavBar/Profile/ProfileScreen';
import SettingJabatan from './screen/BottomNavBar/Menu/SettingJabatan/SettingJabatan';
import FormJabatan from './screen/BottomNavBar/Menu/SettingJabatan/Form';
import RealisasiKinerja from './screen/BottomNavBar/Menu/RealisasiKinerja/RealisasiKinerja';
import PresensiScreen from './screen/PresensiScreen';
import TeguranScreen from './screen/TeguranScreen'
import Allmenu from './screen/Allmenu';
import Persetujuan from './screen/Persetujuan';
import PersetujuanRealisasi from './screen/PersetujuanRealisasi';
import HistoryPresensi from './screen/HistoryPresensi';
import DataTable from './screen/DataTable';
import KontrakKerja from './screen/BottomNavBar/Menu/Laporan/KontrakKerja';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  const {setCurrentScreen} = useNavigationContext();
  return (
    <Stack.Navigator
      screenListeners={{
        state: e => {
          const currentRoute = e.data.state.routes[e.data.state.index].name;
          setCurrentScreen(currentRoute); // Update layar aktif di context
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllMenu"
        component={Allmenu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="KontrakKinerja"
        component={KontrakKinerjaScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SettingJabatan"
        component={SettingJabatan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FormJabatan"
        component={FormJabatan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RealisasiKinerja"
        component={RealisasiKinerja}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Presensi"
        component={PresensiScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HistoryPresensi"
        component={HistoryPresensi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Teguran"
        component={TeguranScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Persetujusn"
        component={Persetujuan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PersetujuanRelisasi"
        component={PersetujuanRealisasi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DataTable"
        component={DataTable}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="KontrakKerja"
        component={KontrakKerja}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={User} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="Password" component={Password} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const {shouldShowTabNavigator} = useNavigationContext();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'KontrakKinerja') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          display: shouldShowTabNavigator ? 'flex' : 'none',
        },
      })}>
      <Tab.Screen
        name="Dashboard"
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="KontrakKin"
        component={Presensi} // Pastikan Presensi sudah ada
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </NavigationProvider>
    </AuthProvider>
  );
}



