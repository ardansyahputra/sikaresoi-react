import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Ardhan from 'react-native-vector-icons/MaterialIcons';
import Gusti from 'react-native-vector-icons/MaterialCommunityIcons';
import Oliv from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}> {/* Membuat halaman scrollable */}
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.header}>
          <Image
            source={require('../../assets/images/sikaresoi.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </LinearGradient>

        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://via.placeholder.com/350x150' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Menu Favorite */}
        <View style={styles.menuRow}>
          {renderMenuIcon('Setting   Jabatan', 'settings', () => navigation.navigate('SettingJabatan'))}
          {renderMenuIcon('Realisasi  Kinerja', 'add-circle-outline', () => navigation.navigate('RealisasiKinerja'))}
          {renderMenuIcon('Persetujuan Kontrak Kinerja', 'shield-checkmark', () => navigation.navigate('Persetujuan'))}
          {renderMenuIcon('Lainnya', 'apps', () => navigation.navigate('Allmenu'))}
        </View>
        <View style={styles.dashboardNav}>
          {/* Baris 1: Dua tombol pertama */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.card,]}
              onPress={() => navigation.navigate('Presensi')}
            >
              <LinearGradient colors={['#4A90E2', '#1D56C0']} style={styles.gradient}>
                <Ardhan name="perm-contact-calendar" size={60} color="#FFFFFF"  />
                <Text style={styles.cardTitle}>Presensi</Text>
                <Text style={styles.cardSubtitle}>Data Presensi</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card,]}
              onPress={() => navigation.navigate('Teguran')}
            >
              <LinearGradient colors={['#FF6F61', '#E53935', '#B71C1C']} style={styles.gradient}>
                <Gusti name="email-newsletter" size={60} color="#FFFFFF" />
                <Text style={styles.cardTitle}>Teguran</Text>
                <Text style={styles.cardSubtitle}>Data Teguran</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Baris 2: Dua tombol berikutnya */}
          <View style={styles.row}>
          <TouchableOpacity
              style={[styles.card,]}
              onPress={() => navigation.navigate('Persetujuan')}
            >
              <LinearGradient colors={['#D32F2F', '#F44336']} style={styles.gradient}>
                <Oliv name="file-document" size={60} color="#FFFFFF" />
                <Text style={styles.cardTitle}>1 Kontrak Bawahan</Text>
                <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card,]}
              onPress={() => navigation.navigate('PersetujuanR')}
            >
                <LinearGradient colors={['#F57F17', '#FBC02D']} style={styles.gradient}>
                <Oliv name="file-document" size={60} color="#FFFFFF" />
                <Text style={styles.cardTitle}>0 Realisasi Bawahan</Text>
                <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const renderMenuIcon = (label, iconName, onPress) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <View style={styles.iconCircle}>
        <Icon name={iconName} size={30} color="#213376" />
      </View>
      <Text style={styles.menuText}>{label}</Text> {/* The label will wrap if too long */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 40 },
  header: { padding: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  banner: { margin: 10 },
  bannerImage: { width: '100%', height: 150, borderRadius: 8 },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexWrap: 'wrap', // Allow text to wrap to the next line
  },
  iconContainer: {
    alignItems: 'center',
    width: '25%', // Adjust width to control the item spacing
    marginVertical: 10,
  },
  iconCircle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flexShrink: 1,  // Allow text to shrink and wrap within its container
    textAlign: 'center', // Center align text under the icon
    paddingTop: 5, // Optional: add space between the icon and text
    width: '100%', // Ensure text uses available width for wrapping
  },

  logo: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  dashboardNav: {
    marginTop: 20,
    paddingHorizontal: 5,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  card: {
    width: '50%', // Mengatur lebar card agar dua card dalam satu baris
    borderRadius: 20,
    padding: 16,
    marginBottom: -60,
  },
  
  gradient: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginRight: 30,
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    marginRight: 30,
  },
});
