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
import { StyleSheet } from 'react-native';

//login screens
import LoginScreen from './screen/auth/login/Login';
import HomeScreen from './screen/BottomNavBar/Home/HomeScreen';
import KontrakKinerjaScreen from './screen/BottomNavBar/KontrakKinerja/KontrakKinerjaScreen';
import SettingJabatan from './screen/BottomNavBar/Menu/SettingJabatan/SettingJabatan';
import FormJabatan from './screen/BottomNavBar/Menu/SettingJabatan/Form.js';
import TeguranScreen from './screen/TeguranScreen.js';
import RealisasiKinerja from './screen/BottomNavBar/Menu/RealisasiKinerja/RealisasiKinerja';
import PresensiScreen from './screen/PresensiScreen';
import Allmenu from './screen/Allmenu';
import DataTable from './screen/DataTable';
import DataTable2 from './screen/DataTable2';
import RemunerasiScreen from './screen/BottomNavBar/Home/Persetujuan/Renumerasi.js';
import PencapaianKerja from './screen/PencapaianKerja.js';
import Remunerasi from './screen/Remunerasi.js';
// import KontrakKerja from './screen/KontrakKerja.js';
import HistoryPresensi from './screen/HistoryPresensi';
import ProfileScreen from './screen/BottomNavBar/Profile/ProfileScreen';
import ProfileEdit from './screen/BottomNavBar/Profile/ProfileEdit';
import Password from './screen/BottomNavBar/Profile/Password';
import PersetujuanRealisasi from './screen/PersetujuanRealisasi';
import Persetujuan from './screen/Persetujuan.js';
import Bacascreen from './screen/Bacascreen.js';
import Bacakontrak from './screen/Bacakontrak.js';
import KontrakKerja from './screen/BottomNavBar/Menu/Laporan/KontrakKerja.js';
import RealisasiNext from './screen/RealisasiNext.js';

const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  tabLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    opacity: 0.6,
  },
});
// Stack Navigator untuk Menu
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Allmenu" component={Allmenu} />
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
        name="Allmenu"
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
        name="Persetujuan"
        component={Persetujuan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PersetujuanRealisasi"
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
      <Stack.Screen
        name="Bacascreen"
        component={Bacascreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Bacakontrak"
        component={Bacakontrak}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Remunerasi"
        component={Remunerasi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PencapaianKerja"
        component={PencapaianKerja}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RealisasiNext"
        component={RealisasiNext}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
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

          if (route.name === 'DASHBOARD') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'KONTRAK KINERJA') {
            iconName = focused ? 'documents' : 'documents-outline';
          } else if (route.name === 'PROFIL') {
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
        tabBarLabelStyle: styles.tabLabel, // Menggunakan style yang sudah dibuat
      })}>
      <Tab.Screen
        name="DASHBOARD"
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="KONTRAK KINERJA"
        component={KontrakKinerjaScreen} // Pastikan Presensi sudah ada
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="PROFIL"
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