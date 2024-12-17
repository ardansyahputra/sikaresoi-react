import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

// Axios instance
const apiClient = axios.create({
  baseURL: 'http://192.168.2.100:8000/api/v1',
  headers: {
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjIuMTAwOjgwMDBcL2FwaVwvdjFcL2F1dGhcL3JlZnJlc2giLCJpYXQiOjE3MzQwNTIwOTEsImV4cCI6MTczNDA2MTA2NCwibmJmIjoxNzM0MDU3NDY0LCJqdGkiOiJoa2ZxeFJGN1YzUFpXOHhZIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.n-gPIOw27V-FXZ4htAHAf2rCNyVcXxWOCtkaL8UHCxM',
  },
});

const Home = () => {
  const [totalContracts, setTotalContracts] = useState(null);
  const [year, setYear] = useState('null');
  const [attendanceChanges, setAttendanceChanges] = useState(null);
  const [usersNotSubmittedRealization, setUsersNotSubmittedRealization] =
    useState(null);
  const [usersNotSubmittedContracts, setUsersNotSubmittedContracts] =
    useState(null);

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

    axios
      .all([
        fetchContracts,
        fetchAttendanceChanges,
        fetchUsersNotSubmittedRealization,
        fetchUsersNotSubmittedContracts,
      ])
      .then(
        axios.spread(
          (
            contractsResponse,
            attendanceResponse,
            usersNotAttendedResponse,
            usersNotSubmittedContractsResponse,
          ) => {
            if (contractsResponse.data.status) {
              setTotalContracts(contractsResponse.data.data.total);
              setYear(contractsResponse.data.data.tahun);
            }
            if (attendanceResponse.data.status) {
              setAttendanceChanges(attendanceResponse.data.data.total);
            }
            if (usersNotAttendedResponse.data.status) {
              setUsersNotSubmittedRealization(
                usersNotAttendedResponse.data.data,
              );
            }
            if (usersNotSubmittedContractsResponse.data.status) {
              setUsersNotSubmittedContracts(
                usersNotSubmittedContractsResponse.data.data,
              );
            }
          },
        ),
      )
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const items = [
    {
      title: `${attendanceChanges || 0} Perubahan Presensi`,
      subtitle: 'Belum Dikonfirmasi',
      icon: 'calendar-outline',
      color: ['#0288D1', '#03A9F4'], // Gradasi biru tua ke biru terang
    },
    {
      title: '147 User',
      subtitle: 'Presensi Harian',
      icon: 'people-outline',
      color: ['#9C27B0', '#D500F9'], // Gradasi ungu cerah ke ungu muda
    },
    {
      title: `${
        usersNotSubmittedRealization ? usersNotSubmittedRealization.total : 0
      } User`,
      subtitle: `Belum Kirim Realisasi ${
        usersNotSubmittedRealization
          ? usersNotSubmittedRealization.bulan
          : 'bulan'
      } `,
      icon: 'people-outline',
      color: ['#8E24AA', '#6A1B9A'], // Gradasi ungu tua ke ungu gelap
    },
    {
      title: `${
        usersNotSubmittedContracts ? usersNotSubmittedContracts.total : 20
      } User`,
      subtitle: `Belum kirim Kontrak (${
        usersNotSubmittedContracts ? usersNotSubmittedContracts.tahun : ''
      })`,
      icon: 'people-outline',
      color: ['#FB8C00', '#FF7043'], // Gradasi jingga gelap ke oranye terang
    },
    {
      title: `${totalContracts || 0} Kontrak`,
      subtitle: `Belum Disetujui (${year || ''})`,
      icon: 'document-outline',
      color: ['#D32F2F', '#F44336'], // Gradasi merah terang ke merah muda
    },
    {
      title: '0 Realisasi Desember',
      subtitle: 'Belum Disetujui',
      icon: 'document-outline',
      color: ['#1976D2', '#1565C0'], // Gradasi biru sedang ke biru lebih gelap
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.verticalCard}>
        {' '}
        {/* Selalu gunakan verticalCard */}
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
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Breadcrumbs */}
      <View style={styles.breadcrumbsContainer}>
        <Text style={styles.breadcrumbsText}>
          Dashboard {'-'} Admin {'-'} Dashboard
        </Text>
      </View>

//<View style={styles.circularButtonsContainer}>
  <Text style={styles.buttonsTitle}>Menu</Text>
  <View style={styles.buttonsContainer}>
    {/* Menggunakan ikon Ionicons untuk menggantikan tombol angka */}
    {['person', 'document', 'build'].map((item, index) => (
      <View key={index} style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.circleButton}>
          {/* Ganti dengan ikon yang sesuai */}
          <Ionicons name={item + "-outline"} size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>
          {/* Label tombol */}
          {item === 'person' ? 'User' : 
           item === 'document' ? 'Laporan' :
           item === 'build' ? 'Master' :
           item === 'clipboard' ? 'Surat Tugas' :
           'Lainnya'}
        </Text>
      </View>
    ))}
  </View>
</View>

      <FlatList
        data={items.slice(0, 8)} // Menampilkan 8 kartu pertama
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="document-text-outline" size={24} color="#333" />
          <Text style={styles.navLabel}>Laporan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#333" />
          <Text style={styles.navLabel}>Presensi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.navLabel}>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#E7E9F1',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  headerLeft: {
    flex: 1,
  },
logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  iconWrapper: {
    padding: 10,
  },


  breadcrumbsContainer: {
    backgroundColor: '#fff',
    padding: 10,
  },
  breadcrumbsText: {
    fontSize: 14,
  },
  grid: {
    paddingHorizontal: 20,
    marginTop: 20,
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
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
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
    height: 150, // Tinggi vertical card lebih kecil
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  
  
  
  circularButtonsContainer: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,  // Sesuaikan padding agar lebih ramping
    marginTop:20,
    borderRadius: 25,
    width: 365,  // Ukuran lebar yang lebih ramping
    height: 155,  // Ukuran tinggi yang lebih sesuai
    alignSelf: 'center',  // Menjaga container di tengah layar
  },

buttonsTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
  textAlign: 'center',  // Menjaga teks berada di tengah
},

buttonsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly', // Membuat tombol tersebar merata
},

buttonWrapper: {
  alignItems: 'center',
  marginBottom: 10,  // Mengurangi margin bawah untuk tombol lebih rapat
  width: '30%',  // Menyusun tombol dengan ukuran lebar yang lebih kecil
},

circleButton: {
  width: 40,  // Ukuran tombol tetap kecil
  height: 40,
  borderRadius: 20,  // Tombol tetap bulat sempurna
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
},

buttonLabel: {
  fontSize: 12,  // Ukuran font label tombol
  color: '#333',
  marginTop: 5,
  textAlign: 'center',  // Menjaga label tetap di tengah
},



  bottomNavbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#333',
  },
});

export default Home;
