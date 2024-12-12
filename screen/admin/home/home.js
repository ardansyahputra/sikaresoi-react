import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

// Axios instance
const apiClient = axios.create({
  baseURL: 'http://192.168.2.100:8000/api/v1',
  headers: {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjIuMTAwOjgwMDBcL2FwaVwvdjFcL2F1dGhcL3JlZnJlc2giLCJpYXQiOjE3MzM5NjU3NjEsImV4cCI6MTczMzk4MTEwNSwibmJmIjoxNzMzOTc3NTA1LCJqdGkiOiJaZTFMQjNsTlNUYVB1c0NGIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0._25yNddEeg2TFxB_kxY6LUx4Vo_3jzZzRimF3ocl_FE'
  }
});

const Home = () => {
  const [totalContracts, setTotalContracts] = useState(null);
  const [year, setYear] = useState('null');
  const [attendanceChanges, setAttendanceChanges] = useState(null);
  const [usersNotSubmittedRealization, setUsersNotSubmittedRealization] = useState(null);
  const [usersNotSubmittedContracts, setUsersNotSubmittedContracts] = useState(null);

  useEffect(() => {
    const fetchContracts = apiClient.get('/home/all_kontrak_belum_setujui');
    const fetchAttendanceChanges = apiClient.get('/home/perubahan_presensi_belum_konfirmasi');
    const fetchUsersNotSubmittedRealization = apiClient.get('/home/user_belum_kirim_realisasi');
    const fetchUsersNotSubmittedContracts = apiClient.get('/home/user_belum_kirim_kontrak');

    axios.all([fetchContracts, fetchAttendanceChanges, fetchUsersNotSubmittedRealization, fetchUsersNotSubmittedContracts])
      .then(axios.spread((contractsResponse, attendanceResponse, usersNotAttendedResponse, usersNotSubmittedContractsResponse) => {
        if (contractsResponse.data.status) {
          setTotalContracts(contractsResponse.data.data.total);
          setYear(contractsResponse.data.data.tahun);
        }
        if (attendanceResponse.data.status) {
          setAttendanceChanges(attendanceResponse.data.data.total);
        }
        if (usersNotAttendedResponse.data.status) {
          setUsersNotSubmittedRealization(usersNotAttendedResponse.data.data);
        }
        if (usersNotSubmittedContractsResponse.data.status) {
          setUsersNotSubmittedContracts(usersNotSubmittedContractsResponse.data.data);
        }
      }))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const items = [
    {
      title: 'User',
      subtitle: 'User Management',
      icon: 'people-outline',
      color: '#2196F3',
    },
    {
      title: 'Data Teguran',
      subtitle: 'Lihat Data Teguran',
      icon: 'clipboard-outline',
      color: '#F44336',
    },
    {
      title: `${attendanceChanges || 0} Perubahan Presensi`,
      subtitle: 'Belum Dikonfirmasi',
      icon: 'calendar-outline',
      color: '#FF9800',
    },
    {
      title: '147 User Belum Absen',
      subtitle: 'Presensi Harian',
      icon: 'people-outline',
      color: '#9C27B0',
    },
    {
      title: `${usersNotSubmittedRealization ? usersNotSubmittedRealization.total : 147} Realisasi`,
      subtitle: `Belum Dikirim (${usersNotSubmittedRealization ? usersNotSubmittedRealization.bulan : 'Desember'} ${usersNotSubmittedRealization ? usersNotSubmittedRealization.tahun : ''})`,
      icon: 'clipboard-outline',
      color: '#4CAF50',
    },
    {
      title: `${usersNotSubmittedContracts ? usersNotSubmittedContracts.total : 20} Kontrak`,
      subtitle: `Belum Dikirim (${usersNotSubmittedContracts ? usersNotSubmittedContracts.tahun : ''})`,
      icon: 'document-outline',
      color: '#FF9800',
    },
    {
      title: `${totalContracts || 0} Kontrak`,
      subtitle: `Belum Disetujui (${year || ''})`,
      icon: 'checkmark-done-outline',
      color: '#FF5722',
    },
    {
      title: '0 Realisasi Desember',
      subtitle: 'Belum Disetujui',
      icon: 'file-tray-full-outline',
      color: '#4CAF50',
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.cardContent}>
        <Ionicons name={item.icon} size={30} color="white" style={styles.cardIcon} />
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

           {/* Breadcrumbs */}
           <View style={styles.breadcrumbsContainer}>
        <Text style={styles.breadcrumbText}>Dashboard {'-'} Admin {'-'} Dashboard</Text>
      </View>

      {/* Grid Items */}
      <FlatList
        data={items}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    marginLeft: 12,
  },
  grid: {
    padding: 15,
  },
  row: {
    flexDirection: 'column', // Changed from "column" to "row"
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 18  ,
    marginLeft: 10, // Adjust the margin to shift it slightly to the right
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10, // Add left margin to shift the title slightly to the right
    marginBottom: 8 ,
  },
  cardSubtitle: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10, // Add left margin to shift the subtitle slightly to the right
  },

  bottomNavbar: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#333',
  },
  breadcrumbsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Home;
