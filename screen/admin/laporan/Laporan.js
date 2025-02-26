import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, Image, ScrollView, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

export default function Laporan({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Header title="Laporan" />


      <View style={styles.containers}>
        <View style={styles.content}>
          {/* Laporan Tugas Tambahan */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TugasTambahan')}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                Laporan Tugas Tambahan
              </Text>
              <Icon
                name="arrow-forward-circle-outline"
                size={24}
                color="#28c4ac" // Ganti dengan warna yang diinginkan
                style={styles.iconStyleRight}
              />
            </TouchableOpacity>
          </View>

          {/* Laporan Kontrak Kerja */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('KontrakKerja')}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                Laporan Kontrak Kerja
              </Text>
              <Icon
                name="arrow-forward-circle-outline"
                size={24}
                color="#28c4ac" // Ganti dengan warna yang diinginkan
                style={styles.iconStyleRight}
              />
            </TouchableOpacity>
          </View>

          {/* Laporan Capaian Kinerja */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CapaianKinerja')}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                Laporan Capaian Kinerja
              </Text>
              <Icon
                name="arrow-forward-circle-outline"
                size={24}
                color="#28c4ac" // Ganti dengan warna yang diinginkan
                style={styles.iconStyleRight}
              />
            </TouchableOpacity>
          </View>

          {/* Laporan Rekapitulasi */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Rekapitulasi')}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                Laporan Rekapitulasi
              </Text>
              <Icon
                name="arrow-forward-circle-outline"
                size={24}
                color="#28c4ac" // Ganti dengan warna yang diinginkan
                style={styles.iconStyleRight}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Remunerasi')}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                Laporan Remunerasi
              </Text>
              <Icon
                name="arrow-forward-circle-outline"
                size={24}
                color="#28c4ac" // Ganti dengan warna yang diinginkan
                style={styles.iconStyleRight}
              />
            </TouchableOpacity>
          </View>

          {/* Laporan Tunjangan Tambahan */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TunjanganTambahan')}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                Laporan Tunjangan Tambahan
              </Text>
              <Icon
                name="arrow-forward-circle-outline"
                size={24}
                color="#28c4ac" // Ganti dengan warna yang diinginkan
                style={styles.iconStyleRight}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

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
  containers:  {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  content: {
  flex: 1,
  paddingHorizontal: -30, 
  paddingVertical: 2,
},

  dropdownWrapperTitle: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 30,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  iconStyleRight: {
    marginLeft: 10, // Menempatkan ikon di kanan
  },
  formContainer: {marginTop: 10},
  downloadButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    
  },
});
