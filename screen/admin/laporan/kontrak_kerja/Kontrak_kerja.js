import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import {APP_URL} from '@env';
import useApiClient from '../../../../src/api/apiClient'; // Custom API hook for making requests

export default function KontrakKerja({navigation}) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [userList, setUserList] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const apiClient = useApiClient(); // Invoke the custom API hook

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient('/user_master/show');
        const data = response.data || (await response.json());

        if (data && data.res.code === 200) {
          const userData = data.data.map(user => ({
            label: user.name,
            value: user.id,
          }));
          setUserList(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch user positions
  useEffect(() => {
    if (selectedUser) {
      console.log('Fetching positions for user:', selectedUser); // Tambahkan log untuk memeriksa selectedUser
      const fetchPositions = async () => {
        try {
          const response = await apiClient(
            `/user/jabatan/show?user_id=${selectedUser}`,
          );
          const data = response.data || (await response.json());

          if (data && data.res.code === 200) {
            const positionData = data.data.map(position => ({
              label: position.jabatan.nm_jabatan,
              value: position.uuid,
            }));
            setPositions(positionData);
          } else {
            console.warn(
              'Tidak ada data jabatan yang ditemukan:',
              data.res.message,
            );
          }
        } catch (error) {
          console.error('Error fetching positions:', error);
        }
      };
      fetchPositions();
    }
  }, [selectedUser]);

  // Year options
  const yearData = [
    {label: '2020', value: '1'},
    {label: '2021', value: '2'},
    {label: '2022', value: '3'},
    {label: '2023', value: '4'},
    {label: '2024', value: '5'},
  ];

 // Fungsi untuk validasi sebelum download
const validateAndShowConfirmation = () => {
  // Validasi input
  if (!selectedUser || !selectedPosition || !selectedYear) {
    setModalMessage('Mohon lengkapi semua field yang diperlukan');
    setIsModalVisible(true);
    return;
  }
  // Tampilkan modal konfirmasi
  setIsConfirmationVisible(true);
};

// Fungsi untuk menangani download
const handleDownload = async () => {
  setIsConfirmationVisible(false);
  setIsLoading(true);

  const downloadUrl = `${APP_URL}/report/kontrak_kinerja/${selectedPosition}?type=stream&tahun_id=${selectedYear}`;
  const filePath = `${RNFS.DownloadDirectoryPath}/kontrak_kerja${selectedUser}_${selectedYear}.pdf`;

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
      try {
        const fileUri = `file://${filePath}`;
        const supported = await Linking.canOpenURL(fileUri);
        
        if (supported) {
          await Linking.openURL(fileUri);
          setModalMessage('Laporan berhasil diunduh dan dibuka!');
        } else {
          const androidUri = `content://com.android.externalstorage.documents/document/primary%3ADownload%2Fkontrak_kerja${selectedUser}_${selectedYear}.pdf`;
          await Linking.openURL(androidUri);
          setModalMessage('Laporan berhasil diunduh dan dibuka!');
        }
      } catch (openError) {
        console.error('Gagal membuka file:', openError);
        setModalMessage(
          'Laporan berhasil diunduh tetapi gagal dibuka secara otomatis. ' +
          'Silakan buka file secara manual dari folder Download. ' +
          `Nama file: kontrak_kerja${selectedUser}_${selectedYear}.pdf`
        );
      }
    } else {
      throw new Error('Download failed with status: ' + result.statusCode);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    setModalMessage(
      error.message.includes('timeout')
        ? 'Gagal mengunduh laporan: Koneksi timeout. Coba lagi dengan jaringan yang lebih stabil.'
        : 'Terjadi kesalahan saat mengunduh file. Silakan coba lagi.'
    );
  } finally {
    setIsLoading(false);
    setIsModalVisible(true);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Report Kontrak Kerja Pegawai</Text>
        <View style={styles.cardDivider}></View>

        <Text style={styles.label}>Pilih User *</Text>
        <Dropdown
          style={styles.dropdown}
          data={userList}
          labelField="label"
          valueField="value"
          placeholder="Pilih User"
          value={selectedUser}
          onChange={item => setSelectedUser(item.value)}
        />

        <Text style={styles.label}>Pilih Jabatan User *</Text>
        <Dropdown
          style={styles.dropdown}
          data={positions}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan User"
          value={selectedPosition}
          onChange={item => setSelectedPosition(item.value)}
          disabled={!selectedUser}
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
  onPress={validateAndShowConfirmation}>  // Ubah ini
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

      {/* Modal for errors */}
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
