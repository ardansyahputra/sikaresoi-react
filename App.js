import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; // Menggunakan native-stack
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import Home from './screen/admin/home/home';
import TeguranScreen from './screen/admin/user/teguran/Teguran';
import KontrakScreen from './screen/admin/kontrak/konfirm/Konfirm';
import RealisasiScreen from './screen/admin/realisasi/konfirm/Konfirm';
import PerubahanPresensiScreen from './screen/admin/absensi/Perubahan';
import Laporan from './screen/admin/laporan/Laporan';
import User from './screen/admin/user/User';
import Presensi from './screen/admin/presensi/Presensi';

//Menu Button Screens
import SuratTugasScreen from './screen/admin/surattugas/surattugas';
import PotonganLainScreen from './screen/admin/potongan_lain/potonganlain';
import LockScreen from './screen/admin/lock/lock';
import LainnyaScreen from './screen/admin/lainnya/lainnya';

//ciruclar Screens
import BelumKirimKontrakScreen from './screen/admin/kontrak/kirim/Kirim';
import BelumKirimRealisasiScreen from './screen/admin/realisasi/kirim/Kirim';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="User"
        component={User}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Teguran"
        component={TeguranScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Kontrak"
        component={KontrakScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Realisasi"
        component={RealisasiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PerubahanPresensi"
        component={PerubahanPresensiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SuratTugas"
        component={SuratTugasScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PotonganLain"
        component={PotonganLainScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Lock"
        component={LockScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Lainnya"
        component={LainnyaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="BelumKirimKontrak"
        component={BelumKirimKontrakScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="BelumKirimRealisasi"
        component={BelumKirimRealisasiScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Laporan') {
              iconName = focused ? 'document' : 'document-outline';
            } else if (route.name === 'Presensi') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
          },
        })}>
        <Tab.Screen
          name="Dashboard"
          component={HomeStack}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Laporan"
          component={Laporan}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Presensi"
          component={Presensi}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Profile"
          component={User}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
