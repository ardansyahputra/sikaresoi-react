import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal,Linking, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import {APP_URL} from '@env';import useApiClient from '../../../../src/api/apiClient';
import Header from '../../components/Header';

export default function TugasTambahan({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [taxReduction, setTaxReduction] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [leftSignature, setLeftSignature] = useState('');
  const [rightSignature, setRightSignature] = useState('');
  const [signatures, setSignatures] = useState([]); // State to store the list of signatures
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const apiClient = useApiClient();  // Invoke the hook here

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await apiClient(`/user_master/show`);  // Use the environment variable here
        const data = response.data || await response.json(); // Try fetching as JSON if necessary

        console.log('Received Data:', data);

        if (data && data.res.code === 200) {
          const signatureData = data.data.map(user => ({
            label: user.name,
            value: user.id,
          }));
          setSignatures(signatureData);
        }
      } catch (error) {
        console.error('Error fetching signature data:', error);
      }
    };

    fetchSignatures();
  }, []);

  const monthData = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 },
  ];

  const yearData = [
    { label: '2020', value: '2020' },
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  const taxReductionData = [
    { label: 'Progresif', value: 'PROGRESIF' },
    { label: 'Final', value: 'FINAL' },
  ];

  const typeData = [
    { label: 'P1', value: 'P1' },
    { label: 'P2', value: 'P2' },
    { label: 'P1 & P2', value: 'ALL' },
  ];

  const showConfirmationDialog = () => {
    if (!selectedMonth || !selectedYear) {
      setModalMessage('Harap isi kolom dengan lengakp!');
      setIsModalVisible(true);
      return;
    }

    if (!APP_URL) {
      setModalMessage('URL server tidak ditemukan. Periksa konfigurasi!');
      setIsModalVisible(true);
      return;
    }

    setIsConfirmationVisible(true);
  };

// Fungsi untuk menangani download
const handleDownload = async () => {
  setIsConfirmationVisible(false);
  setIsLoading(true);

  const downloadUrl = `${APP_URL}/report/admin/remunerasi/${selectedMonth}/${selectedYear}?p=${taxReduction}&kiri=${leftSignature}&kanan=${rightSignature}&tipe=${selectedType}`;
  const filePath = `/storage/emulated/0/Download/Laporan_Remun${selectedMonth}_${selectedYear}.xlsx`;

  try {
    console.log('Memulai proses download:', downloadUrl);

    const download = RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: filePath,
      connectionTimeout: 20000,
      readTimeout: 60000,
      progress: res => {
        if (res.contentLength && res.contentLength > 0) {
          const progressPercent = ((res.bytesWritten / res.contentLength) * 100).toFixed(2);
          console.log(`Download progress: ${progressPercent}%`);
        }
      },
    });

      const result = await download.promise;
    
          if (result.statusCode === 200) {
            setModalMessage('Laporan berhasil diunduh!');
            
            try {
              // Matikan loading sebelum mencoba membuka file
              setIsLoading(false);
              
              // Coba buka file yang telah diunduh
              const canOpen = await Linking.canOpenURL(`file://${filePath}`);
              if (canOpen) {
                await Linking.openURL(`file://${filePath}`);
              } else {
                // Jika gagal buka langsung, coba dengan content URI
                const fileUri = `content://com.android.providers.downloads.documents/document/raw:${filePath}`;
                await Linking.openURL(fileUri);
              }
            } catch (openError) {
              console.error('Gagal membuka file:', openError);
              setModalMessage('Laporan berhasil diunduh tetapi gagal dibuka secara otomatis. Silakan buka file secara manual dari folder Download.');
              setIsModalVisible(true);
            }
          } else {
            setModalMessage('Gagal mengunduh laporan. Coba lagi.');
            setIsLoading(false);
            setIsModalVisible(true);
          }
        } catch (error) {
          console.error('Terjadi kesalahan saat mengunduh file:', error);
          if (error.message.includes('timeout')) {
            setModalMessage(
              'Gagal mengunduh laporan: Koneksi timeout. Coba lagi dengan jaringan yang lebih stabil.',
            );
          } else {
            setModalMessage('Terjadi kesalahan saat mengunduh file.');
          }
          setIsLoading(false);
          setIsModalVisible(true);
        }
      };

  return (
    <View style={styles.container}>
      <Header title="Remunerasi" />


      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Report Remunerasi</Text>
        </View>
        <View style={styles.cardDivider}></View>

        <Text style={styles.label}>Pilih Bulan *</Text>
        <Dropdown
          style={styles.dropdown}
          data={monthData}
          labelField="label"
          valueField="value"
          placeholder="Pilih Bulan"
          value={selectedMonth}
          onChange={item => setSelectedMonth(item.value)}
        />

        <Text style={styles.label}>Pilih Tahun *</Text>
        <Dropdown
          style={styles.dropdown}
          data={yearData}
          labelField="label"
          valueField="value"
          placeholder="Pilih Tahun"
          value={selectedYear}
          onChange={item => setSelectedYear(item.value)}
        />

        <Text style={styles.label}>Potongan Pajak *</Text>
        <Dropdown
          style={styles.dropdown}
          data={taxReductionData}
          labelField="label"
          valueField="value"
          placeholder="Pilih Potongan Pajak"
          value={taxReduction}
          onChange={item => setTaxReduction(item.value)}
        />

        <Text style={styles.label}>Pilih Tipe *</Text>
        <Dropdown
          style={styles.dropdown}
          data={typeData}
          labelField="label"
          valueField="value"
          placeholder="Pilih Tipe"
          value={selectedType}
          onChange={item => setSelectedType(item.value)}
        />

        <Text style={styles.label}>Tanda Tangan Kiri *</Text>
        <Dropdown
          style={styles.dropdown}
          data={signatures}
          labelField="label"
          valueField="value"
          placeholder="Pilih Tanda Tangan Kiri"
          value={leftSignature}
          onChange={item => setLeftSignature(item.value)}
            search
            searchPlaceholder="Cari nama..."
            maxHeight={300}
            renderItem={item => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item.label}</Text>
              </View>
            )}
          />
        <Text style={styles.label}>Tanda Tangan Kanan *</Text>
        <Dropdown
          style={styles.dropdown}
          data={signatures}
          labelField="label"
          valueField="value"
          placeholder="Pilih Tanda Tangan Kanan"
          value={rightSignature}
          onChange={item => setRightSignature(item.value)}
            search
            searchPlaceholder="Cari nama..."
            maxHeight={300}
            renderItem={item => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item.label}</Text>
              </View>
            )}
          />        <TouchableOpacity
          style={styles.downloadButton}
          onPress={showConfirmationDialog}>
          <Text style={styles.buttonText}>Download Laporan</Text>
        </TouchableOpacity>
      </View>

      {/* Konfirmasi Download Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirmationVisible}
        onRequestClose={() => setIsConfirmationVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apakah Anda Yakin?</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Anda Akan Mendownload Report Berformat Excel, Mungkin Membutuhkan Waktu Beberapa Detik!
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsConfirmationVisible(false)}>
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDownload}>
                <Text style={styles.modalButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal animationType="fade" transparent={true} visible={isLoading}>
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#28c4ac" />
            <Text style={styles.loadingText}>Mendownload file...</Text>
          </View>
        </View>
      </Modal>

     <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container & Header Styles
  container: {
    flex: 1,
    backgroundColor: '#E7E9F1',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Card Styles
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginHorizontal: 10,
    marginTop: 30,
    width: 387,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: -5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },

  // Form Elements
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  downloadButton: {
    backgroundColor: '#28c4ac',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#ccc',
    padding: 20,
    marginHorizontal: -20,
    marginTop: -20,
  },
  modalTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  confirmButton: {
    backgroundColor: '#28c4ac',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  // Loading Modal
  loadingContent: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Close Button
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
});