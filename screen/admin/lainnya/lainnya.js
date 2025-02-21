import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon Library
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../../components/Header';

const Allmenu = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Menu Cepat" />

      {/* Body */}
      <ScrollView>
        {/* LAPORAN */}
        <Text style={[GlobalStyle.SemiBold, styles.sectionTitle]}>Laporan</Text>
        <View style={styles.iconGrid}>
          {renderIcon('Tugas Tambahan', 'clipboard-outline', () =>
            navigation.navigate('TugasTambahan'),
          )}
          {renderIcon('Kontrak Kerja', 'bag-check-outline', () =>
            navigation.navigate('KontrakKerja'),
          )}
          {renderIcon('Capaian Kinerja', 'stats-chart-outline', () =>
            navigation.navigate('CapaianKinerja'),
          )}
          {renderIcon('Rekapitulasi', 'document-text-outline', () =>
            navigation.navigate('Rekapitulasi'),
          )}
          {renderIcon('Remunerasi', 'checkmark-done-circle', () =>
            navigation.navigate('Remunerasi'),
          )}
          {renderIcon('Tunjangan Tambahan', 'wallet-outline', () =>
            navigation.navigate('TunjanganTambahan'),
          )}
        </View>

        {/* USER */}
        <Text style={[GlobalStyle.SemiBold, styles.sectionTitle]}>User</Text>
        <View style={styles.iconGrid}>
          {renderIcon('User', 'person', () =>
            navigation.navigate('UserScreen'),
          )}
          {renderIcon('User Group', 'people', () =>
            navigation.navigate('UserGroup'),
          )}
          {renderIcon('Persentase Kegiatan', 'pie-chart-outline', () =>
            navigation.navigate('PersentaseKegiatan'),
          )}
        </View>

        {/* MASTER */}
        <Text style={[GlobalStyle.SemiBold, styles.sectionTitle]}>Master</Text>
        <View style={styles.iconGrid}>
          {renderIcon('Pemotongan', 'cut', () =>
            navigation.navigate('Pemotongan'),
          )}
          {renderIcon('Uang Makan', 'restaurant-outline', () =>
            navigation.navigate('UangMakan'),
          )}
          {renderIcon('Jabatan', 'briefcase-outline', () =>
            navigation.navigate('Jabatan'),
          )}
          {renderIcon('Unit Kerja', 'business-outline', () =>
            navigation.navigate('UnitKerja'),
          )}
          {renderIcon('Pangkat', 'ribbon-outline', () =>
            navigation.navigate('Pangkat'),
          )}
          {renderIcon('Satuan', 'grid-outline', () =>
            navigation.navigate('Satuan'),
          )}
          {renderIcon('Uraian', 'document-text-outline', () =>
            navigation.navigate('Uraian'),
          )}
          {renderIcon('Bulan & Tahun', 'calendar-outline', () =>
            navigation.navigate('BulanTahun'),
          )}
          {renderIcon('Dewan Pengawas', 'shield-outline', () =>
            navigation.navigate('DewanPengawas'),
          )}
          {renderIcon('PIR', 'git-network-outline', () =>
            navigation.navigate('PIR'),
          )}
          {renderIcon('Kegiatan', 'clipboard-outline', () =>
            navigation.navigate('Kegiatan'),
          )}
          {renderIcon('Jenis Pegawai', 'person-add-outline', () =>
            navigation.navigate('JenisPegawai'),
          )}
          {renderIcon('Lokasi Absensi', 'location-outline', () =>
            navigation.navigate('LokasiAbsensi'),
          )}
          {renderIcon('No WA', 'call-outline', () =>
            navigation.navigate('NoWa'),
          )}
          {renderIcon('Jenis Absensi', 'finger-print-outline', () =>
            navigation.navigate('JenisAbsensi'),
          )}
          {renderIcon('Reward & Punishment', 'gift-outline', () =>
            navigation.navigate('RewardPunishment'),
          )}
          {renderIcon('Deadline Kinerja', 'timer-outline', () =>
            navigation.navigate('DeadlineKinerja'),
          )}
          {renderIcon('Master PTKP', 'document-attach-outline', () =>
            navigation.navigate('MasterPTKP'),
          )}
          {renderIcon('Jam Kerja', 'time-outline', () =>
            navigation.navigate('JamKerja'),
          )}
        </View>

        {/* FINGERPRINT */}
        <Text style={[GlobalStyle.SemiBold, styles.sectionTitle]}>
          Fingerprint
        </Text>
        <View style={styles.iconGrid}>
          {renderIcon('Jam Finger', 'time-outline', () =>
            navigation.navigate('JamFingerprint'),
          )}
          {renderIcon('Mesin', 'hardware-chip-outline', () =>
            navigation.navigate('Mesin'),
          )}
        </View>

        <Text style={[GlobalStyle.SemiBold, styles.sectionTitle]}>
          Pengaturan Tambahan
        </Text>
        <View style={styles.iconGrid}>
          {renderIcon('Potongan Lain', 'cut-outline', () =>
            navigation.navigate('PotonganLain'),
          )}
          {renderIcon('Tanggung Renteng', 'cube-outline', () =>
            navigation.navigate('TanggungRenteng'),
          )}
          {renderIcon('Setting Hari Kerja', 'calendar-outline', () =>
            navigation.navigate('SettingHariKerja'),
          )}
          {renderIcon('Peta Jabatan', 'map-outline', () =>
            navigation.navigate('PetaJabatan'),
          )}
          {renderIcon('Setting', 'settings-outline', () =>
            navigation.navigate('Setting'),
          )}
          {renderIcon('Surat Tugas', 'document-outline', () =>
            navigation.navigate('SuratTugas'),
          )}
          {renderIcon('Verifikasi Surat Tugas', 'checkmark-done-outline', () =>
            navigation.navigate('VerifikasiSuratTugas'),
          )}
          {renderIcon('Persentase Capaian', 'stats-chart-outline', () =>
            navigation.navigate('SettingPersentaseCapaian'),
          )}
          {renderIcon('Setting Tugas Tambahan', 'settings-outline', () =>
            navigation.navigate('SettingTugasTambahan'),
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

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
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
