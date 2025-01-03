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
import Presensi from './screen/admin/presensi/Presensi';

//Menu Button Screens
import SuratTugasScreen from './screen/admin/surattugas/Surat_tugas';
import PotonganLainScreen from './screen/admin/potongan_lain/Potongan_lain';
import LockScreen from './screen/admin/lock/Lock';
import LainnyaScreen from './screen/admin/lainnya/Lainnya';

//ciruclar Screens
import BelumKirimKontrakScreen from './screen/admin/kontrak/kirim/Kirim';
import BelumKirimRealisasiScreen from './screen/admin/realisasi/kirim/Kirim';

//Laporan
import TugasTambahanScreen from './screen/admin/laporan/tugas_tambahan/Tugas_tambahan';
import KontrakKerjaScreen from './screen/admin/laporan/kontrak_kerja/Kontrak_kerja';
import CapaianKinerjaScreen from './screen/admin/laporan/capaian_kinerja/Capaian_kinerja';
import RekapitulasiScreen from './screen/admin/laporan/rekapitulasi/Rekapitulasi';
import RemunerasiScreen from './screen/admin/laporan/remunerasi/Remunerasi';
import TunjanganTambahanScreen from './screen/admin/laporan/tunjangan_tambahan/Tunjangan_tambahan';

//User
import User from './screen/admin/master/user/User';
import UserGroupScreen from './screen/admin/master/user_group/User_group';
import PersentaseKegiatanScreen from './screen/admin/master/persentase_kegiatan/Persentase_kegiatan';

//Master
import PemotonganScreen from './screen/admin/master/pemotongan/Pemotongan';
import EditPA from './screen/admin/master/pemotongan/EditPA/EditPA';
import TambahPA from './screen/admin/master/pemotongan/TambahPA/TambahPA';
import UangMakanScreen from './screen/admin/master/uang_makan/Uang_makan';
import JabatanScreen from './screen/admin/master/jabatan/Jabatan';
import UnitKerjaScreen from './screen/admin/master/unit_kerja/Unit_kerja';
import PangkatScreen from './screen/admin/master/pangkat/Pangkat';
import SatuanScreen from './screen/admin/master/satuan/Satuan';
import UraianScreen from './screen/admin/master/uraian/Uraian';
import BulanTahunScreen from './screen/admin/master/bulan_tahun/Bulan_tahun';
import DewanPengawasScreen from './screen/admin/master/dewas/Dewas';
import PIRScreen from './screen/admin/master/pir/Pir';
import KegiatanScreen from './screen/admin/master/kegiatan/Kegiatan';
import JenisPegawaiScreen from './screen/admin/master/jenis_pegawai/Jenis_pegawai';
import LokasiAbsensiScreen from './screen/admin/master/lokasi_absensi/Lokasi_absensi';
import NoWaScreen from './screen/admin/master/nowa/Nowa';
import JenisAbsensiScreen from './screen/admin/master/jenis_absensi/Jenis_absensi';
import RewardPunishmentScreen from './screen/admin/master/reward_punishment/Reward_punishment';
import DeadlineKinerjaScreen from './screen/admin/master/deadline_kinerja/Deadline_kinerja';
import MasterPTKPScreen from './screen/admin/master/pajak_ptkp/Pajak_ptkp';
import JamKerjaScreen from './screen/admin/master/jam_kerja/Jam_kerja';

//Fingerprint
import JamFingerprintScreen from './screen/admin/master/fingerprint/jam/Jam_fingerprint';
import MesinScreen from './screen/admin/master/fingerprint/mesin/Mesin';

//Pengaturan Tambahan
import TanggungRentengScreen from './screen/admin/tanggung_renteng/Tanggung_renteng';
import SettingHariKerjaScreen from './screen/admin/harikerja/Hari_kerja';
import PetaJabatanScreen from './screen/admin/master/jabatan/Peta';
import SettingScreen from './screen/admin/setting/setting';
import VerifikasiSuratTugas from './screen/admin/surattugas/Persetujuan';
import SettingPersentaseCapaianScreen from './screen/admin/setting_persentase_capaian/Setting_persentase_capaian';

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
        name="Laporan"
        component={Laporan}
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
      <Stack.Screen
        options={{headerShown: false}}
        name="TugasTambahan"
        component={TugasTambahanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="KontrakKerja"
        component={KontrakKerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CapaianKinerja"
        component={CapaianKinerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Rekapitulasi"
        component={RekapitulasiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Remunerasi"
        component={RemunerasiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TunjanganTambahan"
        component={TunjanganTambahanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="UserGroup"
        component={UserGroupScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PersentaseKegiatan"
        component={PersentaseKegiatanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Pemotongan"
        component={PemotonganScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="UangMakan"
        component={UangMakanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Jabatan"
        component={JabatanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="UnitKerja"
        component={UnitKerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Pangkat"
        component={PangkatScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Satuan"
        component={SatuanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Uraian"
        component={UraianScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="BulanTahun"
        component={BulanTahunScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DewanPengawas"
        component={DewanPengawasScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PIR"
        component={PIRScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Kegiatan"
        component={KegiatanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="JenisPegawai"
        component={JenisPegawaiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="LokasiAbsensi"
        component={LokasiAbsensiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="NoWa"
        component={NoWaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="JenisAbsensi"
        component={JenisAbsensiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="RewardPunishment"
        component={RewardPunishmentScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DeadlineKinerja"
        component={DeadlineKinerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="MasterPTKP"
        component={MasterPTKPScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="JamKerja"
        component={JamKerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="JamFingerprint"
        component={JamFingerprintScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Mesin"
        component={MesinScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TanggungRenteng"
        component={TanggungRentengScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SettingHariKerja"
        component={SettingHariKerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PetaJabatan"
        component={PetaJabatanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Setting"
        component={SettingScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="VerifikasiSuratTugas"
        component={VerifikasiSuratTugas}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SettingPersentaseCapaian"
        component={SettingPersentaseCapaianScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditPa"
        component={EditPA}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahPa"
        component={TambahPA}
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
          },
        })}>
        <Tab.Screen
          name="Dashboard"
          component={HomeStack}
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
