import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon Library
import { useAuth } from '../../auth/AuthContext'; // Import useAuth from AuthContext

const Allmenu = ({ navigation }) => {
  const { hasMenuAccess } = useAuth(); // Get hasMenuAccess function from AuthContext

  // Function to render icon only if user has access to the route
  const renderIconWithAccess = (label, iconName, route, onPress) => {
    if (hasMenuAccess(route)) {
      return renderIcon(label, iconName, onPress);
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Cepat</Text>
      </View>

      {/* Body */}
      <ScrollView>
        {/* LAPORAN */}
        <Text style={styles.sectionTitle}>Laporan</Text>
        <View style={styles.iconGrid}>
          {renderIconWithAccess('Tugas Tambahan', 'clipboard-outline', 'admin.laporan.tugas_tambahan', () =>
            navigation.navigate('TugasTambahan')
          )}
          {renderIconWithAccess('Kontrak Kerja', 'bag-check-outline', 'admin.laporan.kontrak_kerja', () =>
            navigation.navigate('KontrakKerja')
          )}
          {renderIconWithAccess('Capaian Kinerja', 'stats-chart-outline', 'admin.laporan.capaian_kinerja', () =>
            navigation.navigate('CapaianKinerja')
          )}
          {renderIconWithAccess('Rekapitulasi', 'document-text-outline', 'admin.laporan.rekapitulasi', () =>
            navigation.navigate('Rekapitulasi')
          )}
          {renderIconWithAccess('Remunerasi', 'checkmark-done-circle', 'admin.laporan.remunerasi', () =>
            navigation.navigate('Remunerasi')
          )}
          {renderIconWithAccess('Tunjangan Tambahan', 'wallet-outline', 'admin.laporan.tunjangan_tambahan', () =>
            navigation.navigate('TunjanganTambahan')
          )}
        </View>

        {/* USER */}
        <Text style={styles.sectionTitle}>User</Text>
        <View style={styles.iconGrid}>
          {renderIconWithAccess('User', 'person', 'user.master', () =>
            navigation.navigate('UserScreen')
          )}
          {renderIconWithAccess('User Group', 'people', 'admin.master.user_group', () =>
            navigation.navigate('UserGroup')
          )}
          {renderIconWithAccess('Persentase Kegiatan', 'pie-chart-outline', 'admin.master.persentase_kegiatan', () =>
            navigation.navigate('PersentaseKegiatan')
          )}
        </View>

        {/* MASTER */}
        <Text style={styles.sectionTitle}>Master</Text>
        <View style={styles.iconGrid}>
          {renderIconWithAccess('Pemotongan', 'cut', 'admin.master.pemotongan', () =>
            navigation.navigate('Pemotongan')
          )}
          {renderIconWithAccess('Uang Makan', 'restaurant-outline', 'admin.master.uang_makan', () =>
            navigation.navigate('UangMakan')
          )}
          {renderIconWithAccess('Jabatan', 'briefcase-outline', 'admin.master.jabatan', () =>
            navigation.navigate('Jabatan')
          )}
          {renderIconWithAccess('Unit Kerja', 'business-outline', 'admin.master.unit_kerja', () =>
            navigation.navigate('UnitKerja')
          )}
          {renderIconWithAccess('Pangkat', 'ribbon-outline', 'admin.master.pangkat', () =>
            navigation.navigate('Pangkat')
          )}
          {renderIconWithAccess('Satuan', 'grid-outline', 'admin.master.satuan', () =>
            navigation.navigate('Satuan')
          )}
          {renderIconWithAccess('Uraian', 'document-text-outline', 'admin.master.uraian', () =>
            navigation.navigate('Uraian')
          )}
          {renderIconWithAccess('Bulan & Tahun', 'calendar-outline', 'admin.master.bulan_tahun', () =>
            navigation.navigate('BulanTahun')
          )}
          {renderIconWithAccess('Dewan Pengawas', 'shield-outline', 'admin.master.dewas', () =>
            navigation.navigate('DewanPengawas')
          )}
          {renderIconWithAccess('PIR', 'git-network-outline', 'admin.master.pir', () =>
            navigation.navigate('PIR')
          )}
          {renderIconWithAccess('Kegiatan', 'clipboard-outline', 'admin.master.kegiatan', () =>
            navigation.navigate('Kegiatan')
          )}
          {renderIconWithAccess('Jenis Pegawai', 'person-add-outline', 'admin.master.jenis_pegawai', () =>
            navigation.navigate('JenisPegawai')
          )}
          {renderIconWithAccess('Lokasi Absensi', 'location-outline', 'admin.master.lokasiabsensi', () =>
            navigation.navigate('LokasiAbsensi')
          )}
          {renderIconWithAccess('No WA', 'call-outline', 'admin.master.nowa', () =>
            navigation.navigate('NoWa')
          )}
          {renderIconWithAccess('Jenis Absensi', 'finger-print-outline', 'admin.master.jenis_absensi', () =>
            navigation.navigate('JenisAbsensi')
          )}
          {renderIconWithAccess('Reward & Punishment', 'gift-outline', 'admin.master.reward_punishment', () =>
            navigation.navigate('RewardPunishment')
          )}
          {renderIconWithAccess('Deadline Kinerja', 'timer-outline', 'admin.master.deadline_kinerja', () =>
            navigation.navigate('DeadlineKinerja')
          )}
          {renderIconWithAccess('Master PTKP', 'document-attach-outline', 'admin.master.pajak_ptkp', () =>
            navigation.navigate('MasterPTKP')
          )}
          {renderIconWithAccess('Jam Kerja', 'time-outline', 'admin.master.jamkerja', () =>
            navigation.navigate('JamKerja')
          )}
        </View>

        {/* FINGERPRINT */}
        <Text style={styles.sectionTitle}>Fingerprint</Text>
        <View style={styles.iconGrid}>
          {renderIconWithAccess('Jam Finger', 'time-outline', 'admin.master.settingfingerprint', () =>
            navigation.navigate('JamFingerprint')
          )}
          {renderIconWithAccess('Mesin', 'hardware-chip-outline', 'admin.master.mesinfingerprint', () =>
            navigation.navigate('Mesin')
          )}
        </View>

        <Text style={styles.sectionTitle}>Pengaturan Tambahan</Text>
        <View style={styles.iconGrid}>
          {renderIconWithAccess('Potongan Lain', 'cut-outline', 'admin.potongan_lain', () =>
            navigation.navigate('PotonganLain')
          )}
          {renderIconWithAccess('Tanggung Renteng', 'cube-outline', 'admin.tanggung_renteng', () =>
            navigation.navigate('TanggungRenteng')
          )}
          {renderIconWithAccess('Setting Hari Kerja', 'calendar-outline', 'admin.harikerja', () =>
            navigation.navigate('SettingHariKerja')
          )}
          {renderIconWithAccess('Peta Jabatan', 'map-outline', 'admin.master.jabatan.peta', () =>
            navigation.navigate('PetaJabatan')
          )}
          {renderIconWithAccess('Setting', 'settings-outline', 'admin.setting', () =>
            navigation.navigate('Setting')
          )}
          {renderIconWithAccess('Surat Tugas', 'document-outline', 'admin.surattugas', () =>
            navigation.navigate('SuratTugas')
          )}
          {renderIconWithAccess('Verifikasi Surat Tugas', 'checkmark-done-outline', 'surattugas.approval', () =>
            navigation.navigate('VerifikasiSuratTugas')
          )}
          {renderIconWithAccess('Persentase Capaian', 'stats-chart-outline', 'admin.setting_persentase_capaian', () =>
            navigation.navigate('SettingPersentaseCapaian')
          )}
          {renderIconWithAccess('Setting Tugas Tambahan', 'settings-outline', 'admin.setting_tugas_tambahan', () =>
            navigation.navigate('SettingTugasTambahan')
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Fungsi untuk merender ikon dengan label
const renderIcon = (label, iconName, onPress) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <View style={styles.iconCircle}>
        <Icon name={iconName} size={30} color="#213376" />
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013A91',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: 'relative',
  },
  headerBackgroundIcon: {
    position: 'absolute',
    top: -30,
    right: -10,
    zIndex: -1,
    opacity: 0.2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 16,
  },
  sectionSubtitle: {
    color: '#C0C0C0',
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 10,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'start',
    marginBottom: 20,
    position: 'relative',
  },
  gridBackgroundIcon: {
    position: 'absolute',
    left: -20,
    top: -20,
    zIndex: -1,
    opacity: 0.2,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 10,
    width: '25%',
  },
  iconCircle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Allmenu;