import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView, // Tambahkan ScrollView di sini
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

// Axios instance
const apiClient = axios.create({
  baseURL: 'http://192.168.60.163:8000/api/v1',
  headers: {
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjA4MjM5LCJleHAiOjE3MzU2MzIyNDUsIm5iZiI6MTczNTYyODY0NSwianRpIjoicHppNUZWWkhNSmZ0S0U3ViIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.E_iFIJx6LEpDP6hcpNNyqwQL-6gX54Mqnov6v1lFBtc',
  },
});

const Home = () => {
  const navigation = useNavigation();
  const [totalContracts, setTotalContracts] = useState(null);
  const [year, setYear] = useState(null);
  const [attendanceChanges, setAttendanceChanges] = useState(null);
  const [usersNotSubmittedRealization, setUsersNotSubmittedRealization] =
    useState(null);
  const [usersNotSubmittedContracts, setUsersNotSubmittedContracts] =
    useState(null);
  const [usersNotAttended, setUsersNotAttended] = useState(null);
  const [realisasiDesember, setRealisasiDesember] = useState(null); // Untuk total realisasi
  const [bulanRealisasi, setBulanRealisasi] = useState(''); // Untuk bulan realisasi

  useEffect(() => {
    const fetchContracts = apiClient.get('/home/all_kontrak_belum_setujui');
    const fetchAttendanceChanges = apiClient.get(
      '/home/perubahan_presensi_belum_konfirmasi',
    );
    const fetchUsersNotSubmittedRealization = apiClient.get(
      '/home/user_belum_kirim_realisasi',
    );
    const fetchUsersNotSubmittedContracts = apiClient.get(
      '/home/user_belum_kirim_kontrak',
    );
    const fetchUsersNotAttended = apiClient.get('/home/presensi_belum_hadir');
    const fetchRealisasiDesember = apiClient.get(
      '/home/all_realisasi_belum_setujui',
    );

    axios
      .all([
        fetchContracts,
        fetchAttendanceChanges,
        fetchUsersNotSubmittedRealization,
        fetchUsersNotSubmittedContracts,
        fetchUsersNotAttended,
        fetchRealisasiDesember,
      ])
      .then(
        axios.spread(
          (
            contractsResponse,
            attendanceResponse,
            usersNotRealizationResponse,
            usersNotSubmittedContractsResponse,
            usersNotAttendedResponse,
            realisasiDesemberResponse,
          ) => {
            if (contractsResponse.data.status) {
              setTotalContracts(contractsResponse.data.data.total);
              setYear(contractsResponse.data.data.tahun);
            }
            if (attendanceResponse.data.status) {
              setAttendanceChanges(attendanceResponse.data.data.total);
            }
            if (usersNotRealizationResponse.data.status) {
              setUsersNotSubmittedRealization(
                usersNotRealizationResponse.data.data,
              );
            }
            if (usersNotSubmittedContractsResponse.data.status) {
              setUsersNotSubmittedContracts(
                usersNotSubmittedContractsResponse.data.data,
              );
            }
            if (usersNotAttendedResponse.data.status) {
              setUsersNotAttended(usersNotAttendedResponse.data.data);
            }
            if (realisasiDesemberResponse.data.status) {
              setRealisasiDesember(realisasiDesemberResponse.data.data.total);
              setBulanRealisasi(realisasiDesemberResponse.data.data.bulan); // Simpan bulan dari respons API
            }
          },
        ),
      )
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const items = [
    {
      title: `User`,
      icon: 'person',
      color: ['#4A90E2', '#1D56C0'],
      subtitle: 'Management user',
      navigateTo: 'User', // Nama layar navigasi
    },
    {
      title: 'Teguran',
      icon: 'alert-circle',
      color: ['#FF6F61', '#E53935', '#B71C1C'],
      subtitle: 'Data Teguran',
      navigateTo: 'Teguran', // Nama layar navigasi
    },
    {
      title: `${totalContracts || 0} Kontrak`,
      subtitle: `Belum Disetujui`,
      icon: 'document-outline',
      color: ['#D32F2F', '#F44336'],
      navigateTo: 'Kontrak', // Nama layar navigasi
    },
    {
      title: `${
        realisasiDesember !== null ? realisasiDesember : '0'
      } Realisasi ${bulanRealisasi || ''}`, // Gunakan bulan dari API
      subtitle: `Belum Disetujui`, // Gunakan total dari API
      icon: 'document-outline',
      color: ['#4A90E2', '#1D56C0'],
      navigateTo: 'Realisasi', // Nama layar navigasi
    },
    {
      title: `${attendanceChanges || 0} Perubahan Presensi`,
      subtitle: 'Belum Dikonfirmasi',
      icon: 'calendar-outline',
      color: ['#F9A825', '#FBC02D'],
      navigateTo: 'PerubahanPresensi', // Nama layar navigasi
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.verticalCard}
        onPress={() => navigation.navigate(item.navigateTo)} // Navigasi
      >
        <LinearGradient colors={item.color} style={styles.cardBackground}>
          <View style={styles.cardContent}>
            <Ionicons
              name={item.icon}
              size={30}
              color="white"
              style={styles.cardIcon}
            />
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}></View>
      </View>

      {/* Circular Buttons Container with Gradient */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#1D56C0', '#4A90E2']} // Gradasi biru tua ke biru terang
          style={styles.circularButtonsContainer}>
          <Text style={styles.buttonsTitle}></Text>
          <View style={styles.buttonsContainer}>
            {/* Circular Buttons */}
            {[
              {
                title: '1 User',
                subtitle: 'Presensi Harian',
                icon: 'person',
                navigateTo: 'Presensi', // Menambahkan navigateTo
              },
              {
                title: `${
                  usersNotSubmittedRealization
                    ? usersNotSubmittedRealization.total
                    : 0
                } User`,
                subtitle: `Belum Kirim Realisasi ${
                  usersNotSubmittedRealization
                    ? usersNotSubmittedRealization.bulan
                    : 'bulan'
                }`,
                icon: 'people',
                navigateTo: 'BelumKirimRealisasi', // Menambahkan navigateTo
              },
              {
                title: `${
                  usersNotSubmittedContracts
                    ? usersNotSubmittedContracts.total
                    : 20
                } User`,
                subtitle: `Belum Kirim Kontrak ${
                  usersNotSubmittedContracts
                    ? usersNotSubmittedContracts.tahun
                    : ''
                }`,
                icon: 'people-circle',
                navigateTo: 'BelumKirimKontrak', // Menambahkan navigateTo
              },
            ].map((item, index) => (
              <View key={index} style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => navigation.navigate(item.navigateTo)} // Menambahkan navigasi
                >
                  <Ionicons name={item.icon} size={35} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>{item.title}</Text>
                <Text style={styles.buttonSubtitle}>{item.subtitle}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Menu Buttons */}
        <View style={styles.menuButtonsContainer}>
          X
          <View style={styles.menuRow}>
            {[
              {
                title: 'Surat Tugas',
                icon: 'document-text',
                navigateTo: 'SuratTugas',
              },
              {
                title: 'Laporan',
                icon: 'document',
                navigateTo: 'Laporan',
              },
              {title: 'Lock', icon: 'lock-closed', navigateTo: 'Lock'},
              {
                title: 'Lainnya',
                icon: 'ellipsis-horizontal-circle-sharp',
                navigateTo: 'Lainnya',
              },
            ].map((item, index) => (
              <View key={index} style={styles.menuButtonWrapper}>
                <View style={styles.menuButton}>
                  <TouchableOpacity
                    style={styles.touchableMenuButton}
                    onPress={() => navigation.navigate(item.navigateTo)}>
                    <Ionicons name={item.icon} size={30} color="#213376" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FlatList untuk item yang lain */}
        <FlatList
          data={items.slice(0, 5)} // Hilangkan 3 item yang sudah dipindahkan
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E7E9F1'},

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  grid: {
    paddingHorizontal: 5,
    paddingHorizontal: 5,
    marginTop: 20,
    marginLeft: 10,
    marginLeft: 10,
  },

  cardBackground: {
    flex: 1,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 3,
    marginLeft: 3,
  },
  cardIcon: {
    marginRight: 25,
    marginBottom: 17,
    marginRight: 25,
    marginBottom: 17,
  },
  cardTitle: {
    fontSize: 15,
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  verticalCard: {
    flex: 1,
    marginRight: 10,
    height: 121, // Tinggi vertical card lebih kecil
    marginBottom: -10,
    height: 121, // Tinggi vertical card lebih kecil
    marginBottom: -10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  menuButtonsContainer: {
    padding: 25,
    backgroundColor: '#E7E9F1',
    borderRadius: 8,
    marginBottom: -20,
    marginBottom: -20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  menuTitle: {
    fontSize: 15,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  menuButtonWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  menuButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableMenuButton: {
    width: '120%',
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16, // Ensure same as menuButton
  },
  menuText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },

  circularButtonsContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    width: 370,
    height: 160,
    height: 160,
    alignSelf: 'center',
  },
  buttonsTitle: {
    fontWeight: 'bold',
    color: '#fff', // Agar sesuai dengan latar belakang biru
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 22,
    marginBottom: 22,
    width: '30%',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 7,
    backgroundColor: 'transparent',
    borderWidth: 1, // Menambahkan border
    borderColor: '#fff', // Warna border putih agar kontras
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 7,
    backgroundColor: 'transparent',
    borderWidth: 1, // Menambahkan border
    borderColor: '#fff', // Warna border putih agar kontras
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 16, // Menambah ukuran teks untuk keterbacaan yang lebih baik
    fontWeight: 'bold', // Membuat teks lebih tebal
    color: '#fff', // Warna teks tetap putih agar kontras dengan tombol
    marginTop: 8, // Memberikan jarak yang lebih besar antara tombol dan teks
    textAlign: 'center', // Memastikan teks tetap rata tengah
    textTransform: 'uppercase', // Membuat teks kapital semua untuk memberi kesan lebih tegas
  },
  buttonSubtitle: {
    fontSize: 11, // Ukuran yang lebih kecil untuk subjudul
    fontSize: 11, // Ukuran yang lebih kecil untuk subjudul
    color: '#fff', // Menjaga warna teks tetap putih
    textAlign: 'center', // Memastikan teks tetap rata tengah
    marginTop: 6, // Memberikan jarak antara label dan subtitle
    fontStyle: 'Bold', // Memberikan efek miring untuk subtitle
    fontStyle: 'Bold', // Memberikan efek miring untuk subtitle
  },
  bottomNavbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {},
  navItem: {
    alignItems: 'center',
  },
  navLabel: {},
  navLabel: {
    fontSize: 12,
    color: '#333',
  },
});

export default Home;
