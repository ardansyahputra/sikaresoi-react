import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Gusti from 'react-native-vector-icons/MaterialCommunityIcons';
import Oliv from 'react-native-vector-icons/MaterialCommunityIcons';
import Ardhan from 'react-native-vector-icons/MaterialIcons';
import PresensiScreen from '../../PresensiScreen';

export default function HomeScreen({ navigation }) { // <-- Tambahkan navigation di sini
  const [isProfileVisible, setProfileVisible] = useState(false);

  const toggleProfileMenu = () => {
    setProfileVisible(!isProfileVisible);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          
          {/* Profile Button with Image and Shadow */}
          <TouchableOpacity onPress={toggleProfileMenu} style={styles.profileButton}>
            <Text style={styles.userName}>BUDIAWAN, S.Si.T, MT</Text>
            <Image
              source={require('../../assets/300-14.jpg')} // Ganti dengan path gambar Anda
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* App Bar Section Below Profile */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Dashboard / User / Dashboard</Text>
      </View>

      {/* Dashboard Navigation */}
      <View style={styles.dashboardNav}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#007BFF' }]}
        onPress={() => navigation.navigate('Presensi')}
      >
        <Ardhan name="perm-contact-calendar" size={30} color="#FFFFFF" />
        <Text style={styles.cardTitle}>Presensi</Text>
        <Text style={styles.cardSubtitle}>Data Presensi</Text>
      </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#FF4757' }]}>
          <Gusti name="email-newsletter" size={30} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Teguran</Text>
          <Text style={styles.cardSubtitle}>Data Teguran</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFA502' }]}>
          <Oliv name="file-document" size={30} color="#FFFFFF" />
          <Text style={styles.cardTitle}>1 Kontrak Bawahan</Text>
          <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#7D5FFF' }]}>
          <Oliv name="file-document" size={30} color="#FFFFFF" />
          <Text style={styles.cardTitle}>0 Realisasi Bawahan</Text>
          <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
        </TouchableOpacity>
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Remunerasi 2024</Text>
        <BarChart
        data={{
          labels: ['Gaji Pokok', 'Tunjangan', 'Bonus', 'Potongan'],
          datasets: [
            {
              data: [45000000, 20000000, 15000000, 5000000],
              // Warna batang pada grafik menjadi ungu penuh
              color: () => `rgba(160, 32, 240, ${opacity})`, // Ungu penuh
            },
          ],
        }}
        width={300} // Width of the chart
        height={300} // Height of the chart
        chartConfig={{
          backgroundColor: '#ffffff', // Background chart warna putih
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0, // No decimal places for financial data
          color: (opacity = 1) => `rgba(160, 32, 240, ${opacity})`, // Warna untuk teks dan label (ungu)
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Warna label hitam
          propsForLabels: {
            fontSize: 10,
            fontWeight: 'bold',
          },
        }}
        accessor="population"
        paddingLeft="15"
        absolute // Display absolute values
      />
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={isProfileVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleProfileMenu}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Profil</Text>
            <Text style={styles.modalContent}>Detail Profil Pengguna</Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleProfileMenu}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: '#555',
    marginBottom: 35,  // Menambahkan spasi di bawah teks
    marginTop: 5,   
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },

  profileButton: {
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'flex-start',  
    shadowColor: '#000',  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,  
    shadowRadius: 4,  
    elevation: 5,  
    backgroundColor: '#fff', 
    borderRadius : 20, // Coba tambahkan latar belakang sementara
    paddingLeft : 10,
  },
  


  profileImage: {
    width: 40, // Adjust the size of the image
    height: 40,
    borderRadius: 20, // Make the image round
    marginLeft: 10, // Add space between the image and the name
    // Add shadow to the profile image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appBar: {
    backgroundColor: '#8080', // Blue background color
    padding: 1,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },

  appBarTitle: {
  fontSize: 15,
  fontWeight: 'bold',
  color: 'rgba(180, 180, 184, 20)', // Add opacity using RGBA
},


  appBarSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },

  dashboardNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  chartSection: {
    marginTop: 20,
    marginBottom : 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center', // Centering the chart
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF4757',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
