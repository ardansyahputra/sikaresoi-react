import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import {APP_URL} from '@env';
import useApiClient from '../../../../src/api/apiClient'; // Custom API hook for making requests
import Header from '../../components/Header';


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
  const showConfirmationDialog = () => {
    // Validasi input
    if (!selectedUser || !selectedPosition || !selectedYear) {
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
              `Nama file: kontrak_kerja${selectedUser}_${selectedYear}.pdf`,
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
          : 'Terjadi kesalahan saat mengunduh file. Silakan coba lagi.',
      );
    } finally {
      setIsLoading(false);
      setIsModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Report Kontrak" />


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
          search
          searchPlaceholder="Cari nama..."
          maxHeight={300}
          renderItem={item => (
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>{item.label}</Text>
            </View>
          )}
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
          onPress={showConfirmationDialog}>
          {' '}
          // Ubah ini
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
                Anda Akan Mendownload Report Berformat Excel, Mungkin
                Membutuhkan Waktu Beberapa Detik!
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

      {/* Modal for errors */}
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