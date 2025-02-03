import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Ardhan from 'react-native-vector-icons/MaterialIcons';
import Gusti from 'react-native-vector-icons/MaterialCommunityIcons';
import Oliv from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window'); // Mendapatkan lebar layar

// Fungsi renderMenuIcon dipindahkan ke sini
const renderMenuIcon = (label, iconName, onPress) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <View style={styles.iconCircle}>
        <Icon name={iconName} size={30} color="#213376" />
      </View>
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle the dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5' }]}>
        {/* Header */}
        <LinearGradient
          colors={isDarkMode ? ['#333', '#333'] : ['#FFFFFF', '#FFFFFF']}
          style={styles.header}>
          <Image
            source={require('../../assets/images/sikaresoi.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Icon
              name={isDarkMode ? 'moon' : 'sunny'}
              size={30}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Image
              source={{ uri: 'https://via.placeholder.com/350x150' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Menu Favorite */}
        <View style={styles.menuRow}>
          {renderMenuIcon('Setting Jabatan', 'settings', () => navigation.navigate('SettingJabatan'))}
          {renderMenuIcon('Realisasi Kinerja', 'add-circle-outline', () => navigation.navigate('RealisasiKinerja'))}
          {renderMenuIcon('Persetujuan Kontrak Kinerja', 'shield-checkmark', () => navigation.navigate('Persetujuan'))}
          {renderMenuIcon('Lainnya', 'apps', () => navigation.navigate('Allmenu'))}
        </View>

        {/* Dashboard */}
        <View style={styles.dashboardNav}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.card]} onPress={() => navigation.navigate('Presensi')}>
              <LinearGradient colors={['#4A90E2', '#1D56C0']} style={styles.gradient}>
                <Ardhan name="perm-contact-calendar" size={60} color="#FFFFFF" />
                <Text style={styles.cardTitle}>Presensi</Text>
                <Text style={styles.cardSubtitle}>Data Presensi</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card]} onPress={() => navigation.navigate('Teguran')}>
              <LinearGradient colors={['#FF6F61', '#E53935', '#B71C1C']} style={styles.gradient}>
                <Gusti name="email-newsletter" size={60} color="#FFFFFF" />
                <Text style={styles.cardTitle}>Teguran</Text>
                <Text style={styles.cardSubtitle}>Data Teguran</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.card]} onPress={() => navigation.navigate('Persetujuan')}>
              <LinearGradient colors={['#D32F2F', '#F44336']} style={styles.gradient}>
                <Oliv name="file-document" size={60} color="#FFFFFF" />
                <Text style={styles.cardTitle}>1 Kontrak Bawahan</Text>
                <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card]} onPress={() => navigation.navigate('PersetujuanRealisasi')}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bannerContainer: {
    paddingHorizontal: 16, // Memberi jarak dari sisi layar
  },
  banner: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 16, // Memberi jarak dari sisi layar
    flexWrap: 'wrap',
  },
  iconContainer: {
    alignItems: 'center',
    width: '22%', // Adjust width to control the item spacing
    marginVertical: 10,
  },
  iconCircle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuText: {
    flexShrink: 1,
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 12,
    color: '#213376',
    width: '100%',
    fontFamily: 'Poppins-SemiBold',

  },
  logo: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  dashboardNav: {
    marginTop: 20,
    paddingHorizontal: 16, // Memberi jarak dari sisi layar
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: width * 0.44, // Mengatur ukuran kartu agar responsif terhadap lebar layar
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    fontSize: 19,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  themeToggle: {
    position: 'absolute',
    top: 14,
    right: 20,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    elevation: 2,
  },
});
