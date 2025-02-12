import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import {APP_URL} from '@env';

export default function Rekapitulasi({navigation}) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const monthData = [
    {label: 'Januari', value: 1},
    {label: 'Februari', value: 2},
    {label: 'Maret', value: 3},
    {label: 'April', value: 4},
    {label: 'Mei', value: 5},
    {label: 'Juni', value: 6},
    {label: 'Juli', value: 7},
    {label: 'Agustus', value: 8},
    {label: 'September', value: 9},
    {label: 'Oktober', value: 10},
    {label: 'November', value: 11},
    {label: 'Desember', value: 12},
  ];

  const yearData = [
    {label: '2020', value: '2020'},
    {label: '2021', value: '2021'},
    {label: '2022', value: '2022'},
    {label: '2023', value: '2023'},
    {label: '2024', value: '2024'},
    {label: '2025', value: '2025'},
  ];

  const showConfirmationDialog = () => {
    if (!selectedMonth || !selectedYear) {
      setModalMessage('Harap pilih bulan dan tahun untuk laporan!');
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

  const handleDownload = async () => {
    setIsConfirmationVisible(false);
    setIsLoading(true);

    const downloadUrl = `${APP_URL}/report/admin/rekapitulasi/${selectedMonth}/${selectedYear}`;
    const filePath = `/storage/emulated/0/Download/Laporan_Rekapitulasi${selectedMonth}_${selectedYear}.xlsx`;
    try {
      console.log('Memulai proses download:', downloadUrl);

      const download = RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
        connectionTimeout: 20000,
        readTimeout: 60000,
        progress: res => {
          if (res.contentLength && res.contentLength > 0) {
            const progressPercent = (
              (res.bytesWritten / res.contentLength) *
              100
            ).toFixed(2);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Laporan Tugas Tambahan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Report Capaian Kinerja Pegawai</Text>
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

        <TouchableOpacity
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
            <Text style={styles.modalMessage}>
              Apakah anda yakin akan mendownload file ke perangkat anda?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsConfirmationVisible(false)}>
                <Text style={styles.modalButtonText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDownload}>
                <Text style={styles.modalButtonText}>Ya</Text>
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

      {/* Notification Modal */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E7E9F1', paddingTop: 20},
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
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    marginHorizontal: 10,
    marginTop: 60,
    width: 387,
  },
  label: {fontSize: 16, marginBottom: 5, color: '#333'},
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
  buttonText: {color: '#FFF', fontWeight: 'bold'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  loadingContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  modalMessage: {fontSize: 16, color: '#333', textAlign: 'center'},
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
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
  },
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  cardHeader: {marginBottom: 15},
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: -5,
  },
  closeButtonText: {color: '#FFF', fontWeight: 'bold'},
});