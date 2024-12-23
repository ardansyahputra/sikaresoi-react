import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon Library
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Allmenu = ({ navigation }) => { // Menambahkan navigation sebagai prop
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Icon Background */}
        <MaterialCommunityIcons name="menu" size={150} color="#ffffff20" style={styles.headerBackgroundIcon} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Cepat</Text>
      </View>

      {/* Body */}
      <ScrollView>
        {/* Menu Favorit */}
        <Text style={styles.sectionTitle}>Menu Favorit</Text>
        <Text style={styles.sectionSubtitle}>4 menu favorit yang ada di dashboard Anda</Text>

        <View style={styles.iconGrid}>
          {/* Icon Grid Background */}
          <MaterialCommunityIcons name="grid-large" size={200} color="#ffffff10" style={styles.gridBackgroundIcon} />
          {renderIcon('Setting Jabatan', 'settings', () => navigation.navigate('SettingJabatan'))}
          {renderIcon('Realisasi Kinerja', 'add-circle-outline', () => navigation.navigate('RealisasiKinerja'))}
          {renderIcon('Persetujuan Kontrak Kinerja', 'shield-checkmark', () => navigation.navigate('Persetujuan'))}
          {renderIcon('Persetujuan Realisasi', 'documents-outline', () => navigation.navigate('PersetujuanR'))}
        </View>

        {/* Menu Lainnya */}
        <Text style={styles.sectionTitle}>LAPORAN</Text>
        <View style={styles.iconGrid}>
          {renderIcon('Kontrak Kerja', 'bag-check-outline')}
          {renderIcon('Pencapaian Kerja', 'gift-outline')}
          {renderIcon('Remunerasi', 'checkmark-done-circle')}
          {renderIcon('Kontrak Kerja', 'bag-check-outline')}
          {renderIcon('Pencapaian Kerja', 'gift-outline')}
          {renderIcon('Remunerasi', 'checkmark-done-circle')}
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
