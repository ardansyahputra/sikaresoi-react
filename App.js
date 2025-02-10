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
import Toast from 'react-native-toast-message';
import customToastConfig from './screen/components/toastConfig';

// Import screens
import Home from './screen/admin/home/home';
import TeguranScreen from './screen/admin/user/teguran/Teguran';
import Tambahtegur from './screen/admin/user/teguran/Tambahtegur';
import Edittegur from './screen/admin/user/teguran/Edittegur';
import KontrakScreen from './screen/admin/kontrak/konfirm/Konfirm';
import RealisasiScreen from './screen/admin/realisasi/konfirm/Konfirm';
import PerubahanPresensiScreen from './screen/admin/absensi/Perubahan';
import Laporan from './screen/admin/laporan/Laporan';
import Presensi from './screen/admin/presensi/Presensi';
import Presensiedit from './screen/admin/presensi/Presensiedit';
import Presensiexcel from './screen/admin/presensi/Presensiexcel';
import UserScreen from './screen/admin/user/user';

//Menu Button Screens
import SuratTugasScreen from './screen/admin/surattugas/Surat_tugas';
import PotonganLainScreen from './screen/admin/potongan_lain/Potongan_lain';
import LockScreen from './screen/admin/lock/lock';
import LainnyaScreen from './screen/admin/lainnya/lainnya';

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
import EditUserScreen from './screen/admin/user/Edituser';
import UserGroupScreen from './screen/admin/master/user_group/User_group';
import PersentaseKegiatanScreen from './screen/admin/master/persentase_kegiatan/Persentase_kegiatan';
import TambahUser from './screen/admin/user/Tambahuser';

//profile
import ProfileEdit from './screen/admin/master/user/ProfileEdit';
import Password from './screen/admin/master/user/Password';
import User from './screen/admin/master/user/ProfileScreen';

//Master
import PemotonganScreen from './screen/admin/master/pemotongan/Pemotongan';
import EditPA from './screen/admin/master/pemotongan/EditPA/EditPA';
import TambahPA from './screen/admin/master/pemotongan/TambahPA/TambahPA';
import UangMakanScreen from './screen/admin/master/uang_makan/Uang_makan';
import TambahUangMakan from './screen/admin/master/uang_makan/Tambah';
import EditUangMakan from './screen/admin/master/uang_makan/Edit';
import JabatanScreen from './screen/admin/master/jabatan/Jabatan';
import TambahJabatan from './screen/admin/master/jabatan/Tambah';
import EditJabatan from './screen/admin/master/jabatan/Edit';
import UnitKerjaScreen from './screen/admin/master/unit_kerja/Unit_kerja';
import TambahUnitKerja from './screen/admin/master/unit_kerja/Tambah';
import EditUnitKerja from './screen/admin/master/unit_kerja/Edit';
import PangkatScreen from './screen/admin/master/pangkat/Pangkat';
import EditPangkat from './screen/admin/master/pangkat/Edit';
import TambahPangkat from './screen/admin/master/pangkat/Tambah';
import SatuanScreen from './screen/admin/master/satuan/Satuan';
import TambahSatuan from './screen/admin/master/satuan/Tambah';
import EditSatuan from './screen/admin/master/satuan/Edit';
import UraianScreen from './screen/admin/master/uraian/Uraian';
import EditUraian from './screen/admin/master/uraian/Edit';
import TambahUraian from './screen/admin/master/uraian/Tambah';
import BulanTahunScreen from './screen/admin/master/bulan_tahun/Bulan_tahun';
import TambahTahun from './screen/admin/master/bulan_tahun/TambahTahun';
import EditTahun from './screen/admin/master/bulan_tahun/EditTahun';
import TambahBulan from './screen/admin/master/bulan_tahun/TambahBulan';
import EditBulan from './screen/admin/master/bulan_tahun/EditBulan';
import DewanPengawasScreen from './screen/admin/master/dewas/Dewas';
import TambahDewas from './screen/admin/master/dewas/Tambah';
import EditDewas from './screen/admin/master/dewas/Edit';
import PIRScreen from './screen/admin/master/pir/Pir';
import KegiatanScreen from './screen/admin/master/kegiatan/Kegiatan';
import EditKegiatan from './screen/admin/master/kegiatan/Edit';
import TambahKegiatan from './screen/admin/master/kegiatan/Tambah';
import JenisPegawaiScreen from './screen/admin/master/jenis_pegawai/Jenis_pegawai';
import EditJenisPegawai from './screen/admin/master/jenis_pegawai/Edit';
import TambahJenisPegawai from './screen/admin/master/jenis_pegawai/Tambah';
import LokasiAbsensiScreen from './screen/admin/master/lokasi_absensi/Lokasi_absensi';
import EditLokasiAbsensi from './screen/admin/master/lokasi_absensi/Edit';
import TambahLokasiAbsensi from './screen/admin/master/lokasi_absensi/Tambah';
import NoWaScreen from './screen/admin/master/nowa/Nowa';
import EditNoWhatsapp from './screen/admin/master/nowa/Edit';
import JenisAbsensiScreen from './screen/admin/master/jenis_absensi/Jenis_absensi';
import RewardPunishmentScreen from './screen/admin/master/reward_punishment/Reward_punishment';
import EditRewardPunishment from './screen/admin/master/reward_punishment/Edit';
import TambahRewardPunishment from './screen/admin/master/reward_punishment/Tambah';
import Reward from './screen/admin/master/reward_punishment/reward/Reward';
import TambahReward from './screen/admin/master/reward_punishment/reward/TambahReward';
import EditReward from './screen/admin/master/reward_punishment/reward/EditReward';
import TambahPunishment from './screen/admin/master/reward_punishment/reward/TambahPunishment';
import EditPunishment from './screen/admin/master/reward_punishment/reward/EditPunishment';
import DeadlineKinerjaScreen from './screen/admin/master/deadline_kinerja/Deadline_kinerja';
import MasterPTKPScreen from './screen/admin/master/pajak_ptkp/Pajak_ptkp';
import EditPajakPtkp from './screen/admin/master/pajak_ptkp/Edit';
import TambahPajakPtkp from './screen/admin/master/pajak_ptkp/Tambah';
import JamKerjaScreen from './screen/admin/master/jam_kerja/Jam_kerja';

//Fingerprint
import JamFingerprintScreen from './screen/admin/master/fingerprint/jam/Jam_fingerprint';
import MesinScreen from './screen/admin/master/fingerprint/mesin/Mesin';
import Editmesin from './screen/admin/master/fingerprint/mesin/ascreen/Editmesin';
import Tambahmesin from './screen/admin/master/fingerprint/mesin/ascreen/Tambahmesin';

//Pengaturan Tambahan
import TanggungRentengScreen from './screen/admin/tanggung_renteng/Tanggung_renteng';
import SettingHariKerjaScreen from './screen/admin/harikerja/Hari_kerja';
import PetaJabatanScreen from './screen/admin/master/jabatan/Peta';
import SettingScreen from './screen/admin/setting/setting';
import VerifikasiSuratTugas from './screen/admin/surattugas/Persetujuan';
import SettingPersentaseCapaianScreen from './screen/admin/setting_persentase_capaian/Setting_persentase_capaian';
import EditPersentaseCapaian from './screen/admin/setting_persentase_capaian/Edit';
import TambahPersentaseCapaian from './screen/admin/setting_persentase_capaian/Tambah';
import SettingTugasTambahan from './screen/admin/setting_tugas_tambahan/Setting_tugas_tambahan';
import EditSettingTugas from './screen/admin/setting_tugas_tambahan/Edit';
import TambahSettingTugas from './screen/admin/setting_tugas_tambahan/Tambah';

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
        component={Home}
        options={{headerShown: false}}
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
        name="Tambahtegur"
        component={Tambahtegur}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Edittegur"
        component={Edittegur}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="UserScreen"
        component={UserScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Edituser"
        component={EditUserScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Tambahuser"
        component={TambahUser}
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
        name="TambahUangMakan"
        component={TambahUangMakan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditUangMakan"
        component={EditUangMakan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Jabatan"
        component={JabatanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditJabatan"
        component={EditJabatan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahJabatan"
        component={TambahJabatan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="UnitKerja"
        component={UnitKerjaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahUnitKerja"
        component={TambahUnitKerja}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditUnitKerja"
        component={EditUnitKerja}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Pangkat"
        component={PangkatScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditPangkat"
        component={EditPangkat}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahPangkat"
        component={TambahPangkat}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Satuan"
        component={SatuanScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahSatuan"
        component={TambahSatuan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditSatuan"
        component={EditSatuan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Uraian"
        component={UraianScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahUraian"
        component={TambahUraian}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditUraian"
        component={EditUraian}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="BulanTahun"
        component={BulanTahunScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahTahun"
        component={TambahTahun}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditTahun"
        component={EditTahun}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahBulan"
        component={TambahBulan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditBulan"
        component={EditBulan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DewanPengawas"
        component={DewanPengawasScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahDewas"
        component={TambahDewas}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditDewas"
        component={EditDewas}
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
        name="EditKegiatan"
        component={EditKegiatan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahKegiatan"
        component={TambahKegiatan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="JenisPegawai"
        component={JenisPegawaiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditJenisPegawai"
        component={EditJenisPegawai}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahJenisPegawai"
        component={TambahJenisPegawai}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="LokasiAbsensi"
        component={LokasiAbsensiScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahLokasiAbsensi"
        component={TambahLokasiAbsensi}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditLokasiAbsensi"
        component={EditLokasiAbsensi}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="NoWa"
        component={NoWaScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditNoWhatsapp"
        component={EditNoWhatsapp}
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
        name="EditRewardPunishment"
        component={EditRewardPunishment}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahRewardPunishment"
        component={TambahRewardPunishment}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Reward"
        component={Reward}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahReward"
        component={TambahReward}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditReward"
        component={EditReward}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahPunishment"
        component={TambahPunishment}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditPunishment"
        component={EditPunishment}
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
        name="TambahPajakPtkp"
        component={TambahPajakPtkp}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditPajakPtkp"
        component={EditPajakPtkp}
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
        name="EditPersentaseCapaian"
        component={EditPersentaseCapaian}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahPersentaseCapaian"
        component={TambahPersentaseCapaian}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Presensi"
        component={Presensi}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Presensiedit"
        component={Presensiedit}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Presensiexcel"
        component={Presensiexcel}
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
      <Stack.Screen
        options={{headerShown: false}}
        name="Editmesin"
        component={Editmesin}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Tambahmesin"
        component={Tambahmesin}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SettingTugasTambahan"
        component={SettingTugasTambahan}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="EditSettingTugas"
        component={EditSettingTugas}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TambahSettingTugas"
        component={TambahSettingTugas}
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
          display: shouldShowTabNavigator ? 'flex' : 'none',
        },
      })}>
      <Tab.Screen
        name="Dashboard"
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Presensi"
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
          <Toast config={customToastConfig} />
        </NavigationContainer>
      </NavigationProvider>
    </AuthProvider>
  );
}
