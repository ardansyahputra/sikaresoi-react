import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon Library

const Allmenu = ({navigation}) => {
  // Menambahkan navigation sebagai prop
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
          {renderIcon('Tugas Tambahan', 'clipboard-outline', () =>
            navigation.navigate('TugasTambahan'),
          )}{' '}
          {/* Ikon untuk Tugas Tambahan */}
          {renderIcon('Kontrak Kerja', 'bag-check-outline', () =>
            navigation.navigate('KontrakKerja'),
          )}{' '}
          {/* Ikon untuk Kontrak Kerja */}
          {renderIcon('Capaian Kinerja', 'stats-chart-outline', () =>
            navigation.navigate('CapaianKinerja'),
          )}{' '}
          {/* Ikon untuk Capaian Kinerja */}
          {renderIcon('Rekapitulasi', 'document-text-outline', () =>
            navigation.navigate('Rekapitulasi'),
          )}{' '}
          {/* Ikon untuk Rekapitulasi */}
          {renderIcon('Remunerasi', 'checkmark-done-circle', () =>
            navigation.navigate('Remunerasi'),
          )}{' '}
          {/* Ikon untuk Remunerasi */}
          {renderIcon('Tunjangan Tambahan', 'wallet-outline', () =>
            navigation.navigate('TunjanganTambahan'),
          )}{' '}
          {/* Ikon untuk Tunjangan Tambahan */}
        </View>

        {/* USER */}
        <Text style={styles.sectionTitle}>User</Text>
        <View style={styles.iconGrid}>
          {renderIcon('User', 'person', () => navigation.navigate('User'))}
          {renderIcon('User Group', 'people', () =>
            navigation.navigate('UserGroup'),
          )}
          {renderIcon('Persentase Kegiatan', 'pie-chart-outline', () =>
            navigation.navigate('PersentaseKegiatan'),
          )}
        </View>

        {/* MASTER */}
        <Text style={styles.sectionTitle}>Master</Text>
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
        <Text style={styles.sectionTitle}>Fingerprint</Text>
        <View style={styles.iconGrid}>
          {renderIcon('Jam Finger', 'time-outline', () =>
            navigation.navigate('JamFingerprint'),
          )}
          {renderIcon('Mesin', 'hardware-chip-outline', () =>
            navigation.navigate('Mesin'),
          )}
        </View>

        <Text style={styles.sectionTitle}>Pengaturan Tambahan</Text>
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
