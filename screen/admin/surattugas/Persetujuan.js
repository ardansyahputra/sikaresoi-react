import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import Header from '../components/Header';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../src/api/apiClient';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import {useNavigation} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';

export default function PersetujuanSuratTugas() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [activeButton, setActiveButton] = useState('direktur');
  const [selectedAction, setSelectedAction] = useState('');
  const [handleConfirmAction, setHandleConfirmAction] = useState(() => {});
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const apiClient = useApiClient();
  const navigation = useNavigation();

  useEffect(() => {
    if (activeButton === 'direktur') {
      fetchBulanData(currentPage); // Reset to page 1 when display changes
    } else {
      fetchTahunData(currentPage); // Reset to page 1 when display changes
    }
  }, [currentPage, activeButton, selectedDisplay]);

  const fetchBulanData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(`surat-tugas/atasan-dua`);

      setData(response.data.data); // Asumsi data langsung berupa array bulan
    } catch (error) {
      console.error('Error fetching bulan:', error);
      Alert.alert('Error', 'Gagal memuat data bulan.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTahunData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/surat-tugas/atasan-satu');
      setData(response.data.data); // Asumsi data langsung berupa array tahun
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tahun:', error);
      Alert.alert('Error', 'Gagal memuat data tahun.');
      setIsLoading(false);
    }
  };

  const handleDownload = async uuid => {
    try {
      console.log('Mulai proses download...');

      const response = await apiClient.post(
        `surat-tugas/preview?uuid=${uuid}`,
        {},
        {
          responseType: 'blob',
        },
      );

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        console.log('Response bukan PDF, menampilkan modal pesan...');
        setModalMessage('Data kosong atau laporan tidak ditemukan.');
        setIsModalVisible(true);
        return;
      }

      console.log('File adalah PDF, melanjutkan proses download...');

      const reader = new FileReader();
      const blob = new Blob([response.data], {type: 'application/pdf'});

      reader.onload = async () => {
        try {
          const base64data = reader.result.split(',')[1];
          let filePath = `/storage/emulated/0/Download/surat-tugas.pdf`;
          let counter = 1;

          // Check for file existence and create a unique file name
          while (await RNFS.exists(filePath)) {
            filePath = `/storage/emulated/0/Download/surat-tugas${counter}.pdf`;
            counter++;
          }

          await RNFS.writeFile(filePath, base64data, 'base64');
          console.log('File berhasil disimpan ke:', filePath);

          // Open the file after successful download
          const canOpen = await Linking.canOpenURL(`file://${filePath}`);
          if (canOpen) {
            await Linking.openURL(`file://${filePath}`);
          } else {
            // If direct opening fails, try with content URI
            const fileUri = `content://com.android.providers.downloads.documents/document/raw:${filePath}`;
            await Linking.openURL(fileUri);
          }

          setModalMessage('Laporan berhasil diunduh dan dibuka');
        } catch (writeError) {
          console.error('Error writing/opening file:', writeError);
          setModalMessage(
            'File berhasil diunduh tetapi gagal dibuka secara otomatis',
          );
        }
      };

      reader.onerror = error => {
        console.error('Error reading file:', error);
        setModalMessage('Gagal memproses file.');
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      if (error.response) {
        console.log('Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
        });
      } else {
        console.log('Error Message:', error.message);
      }
      setModalMessage('Terjadi kesalahan saat mengunduh file.');
    }

    setIsModalVisible(true);
  };

  const submitConfirm = async () => {
    try {
      const response = await apiClient.post(
        `/surat-tugas/${selectedUuid}/change`,
        {
          approval: 2,
        },
      );

      if (response.status === 200) {
        Alert.alert('Berhasil', 'Data berhasil disetujui');
        setConfirmModalVisible(false);
        // Refresh the data
        if (activeButton === 'direktur') {
          fetchBulanData(currentPage);
        } else {
          fetchTahunData(currentPage);
        }
      } else {
        Alert.alert('Error', 'Gagal menyetujui data');
      }
    } catch (error) {
      console.error('Error saat menyetujui:', error);
      Alert.alert('Error', 'Gagal menyetujui data');
    }
  };

  const handleConfirm = uuid => {
    setSelectedUuid(uuid);
    setConfirmModalVisible(true);
  };

  const handleRevisi = uuid => {
    setSelectedUuid(uuid);
    navigation.navigate('RevisiSuratTugas', {uuid});
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => {
        const newPage = prev - 1;
        return newPage;
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(prev => {
        const newPage = prev + 1;
        return newPage;
      });
    }
  };

  const handlePress = buttonName => {
    setActiveButton(buttonName); // Atur tombol aktif
    if (buttonName === 'direktur') {
      fetchBulanData(1); // Langsung fetch data saat tombol Bulan dipilih
    } else {
      fetchTahunData(1); // Langsung fetch data saat tombol Tahun dipilih
    }
  };

  const headerText = activeButton === 'direktur' ? 'No SKP' : 'No SKP';

  const TableHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        {/* Baris atas: Tombol Bulan & Tahun */}
        <View style={styles.bulanContainer}>
          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
              activeButton === 'direktur' && styles.buttonActive,
            ]}
            onPress={() => handlePress('direktur')}>
            <View style={styles.bulanButton}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'direktur' && styles.textActive,
                ]}>
                Direktur
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
              activeButton === 'umum' && styles.buttonActive,
            ]}
            onPress={() => handlePress('umum')}>
            <View style={styles.bulanButton}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'umum' && styles.textActive,
                ]}>
                Umum
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Baris bawah: Search Bar & Tombol Tambah */}
        <View style={styles.bottomContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={[GlobalStyle.SemiBold, styles.searchBar]}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
            />
          </View>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          {headerText}
        </Text>
        <Text
          style={[
            GlobalStyle.SemiBold,
            styles.headerCell,
            styles.tableStatusCell,
          ]}>
          STATUS
        </Text>
        <View style={styles.expandIconCell} />
      </View>
      <View style={styles.headerLine} />
    </View>
  );

  const renderItem = ({item, index}) => {
    const tahunBulanData =
      activeButton === 'direktur' ? item.nomor : item.nomor;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF'; // Warna selang-seling

    return (
      <>
        <View style={styles.tableRow}>
          <View
            style={[styles.rowHeader, {backgroundColor: rowBackgroundColor}]}>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.numberCell,
              ]}>
              {index + 1}
            </Text>
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {tahunBulanData || '-'}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.iconButton, styles.purpleButton]}
                onPress={() => handleDownload(item.uuid)}>
                <Ionicons name="eye" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.blueButton]}
                onPress={() => handleConfirm(item.uuid)}>
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.redButton]}
                onPress={() => handleRevisi(item.uuid)}>
                <Ionicons name="refresh" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {index === data.length - 1 && <View style={styles.verticalLine} />}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Verifikasi Surat Tugas" />
      {/* Loading Indicator */}
      {isLoading ? (
        // Loading Indicator
        <View style={styles.loadingContainer}>
          <BarIndicator color="#D4C6C6" count={5} size={24} />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={TableHeader}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{flexGrow: 1, padding: '10'}}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.paginationContainer}>
              <Text style={[GlobalStyle.SemiBold, styles.pageInfo]}>
                {currentPage} of {lastPage}
              </Text>

              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.disabledButton,
                  ]}
                  disabled={currentPage === 1}
                  onPress={handlePreviousPage}>
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={currentPage === 1 ? '#ccc' : '#BEC2D5'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === lastPage && styles.disabledButton,
                  ]}
                  disabled={currentPage === lastPage}
                  onPress={handleNextPage}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={currentPage === lastPage ? '#ccc' : '#BEC2D5'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}
      {/* Hapus Modal */}
      <Modal
        visible={isHapusModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setHapusModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lihat Data</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setHapusModalVisible(false)}>
                <Text style={styles.buttonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        visible={isConfirmModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setConfirmModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Setujui Data</Text>
            <Text style={styles.modalText}>Surat tugas akan disetujui.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.buttonTextModal}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, {backgroundColor: '#1BC5BD'}]}
                onPress={submitConfirm}>
                <Text style={styles.buttonTextModal}>Setujui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Download Modal */}
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
              <Text style={styles.buttonTextModal}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableHeader: {
    marginTop: 15,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerCell: {
    fontSize: 13,
    color: '#9196B5',
  },
  tableRow: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 0,
  },
  rowHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F7F8FC',
    alignItems: 'center',
  },
  tableCell: {
    flexWrap: 'wrap',
    color: '#313131',
    fontSize: 14,
  },
  tableStatusCell: {
    textAlign: 'center',
    flex: 0,
    paddingLeft: 0,
  },
  numberCell: {
    width: 45,
  },
  nameCell: {
    flex: 1,
    overflow: 'hidden',
  },
  statusCellContainer: {
    width: 100,
  },
  statusCell: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  expandIconCell: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerLine: {
    height: 2,
    backgroundColor: '#D3D3D3', // Garis horizontal bawah header
    marginBottom: 5,
  },
  verticalLine: {
    height: 2, // Tinggi garis horizontal
    backgroundColor: '#D3D3D3', // Warna abu-abu mirip header line
    marginBottom: 10, // Jarak atas & bawah agar tidak menempel
  },
  expandedContent: {
    padding: 15,
    backgroundColor: '#FAFAFA',
  },
  expandedText: {
    marginBottom: 5,
    fontSize: 14,
    color: '#313131',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    padding: 8, // Padding agar tombol lebih mudah diklik
    borderRadius: 5,
  },
  pageButtonText: {
    fontSize: 13,
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5, // Efek disabled lebih jelas
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: '#888', // Warna abu-abu sesuai tampilan gambar
    marginRight: 10, // Jarak antara teks dan tombol navigasi
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: 'column', // Supaya tersusun vertikal
    alignItems: 'stretch', // Mengisi lebar parent
    marginBottom: 10,
  },
  bulanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Posisi ke kiri
    gap: 10,
    marginBottom: 20, // Beri jarak antara tombol Bulan & Tahun dengan Search Bar
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Search & Tambah sejajar
  },
  searchTambahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 42, // **Tinggi sama dengan tombol tambah**
    flex: 1,
  },

  searchIcon: {
    marginRight: 10,
    fontSize: 14, // **Agar proporsional dengan teks**
    alignSelf: 'center',
  },

  searchBar: {
    flex: 1,
    fontSize: 12, // **Agar lebih proporsional**
    color: '#BEC2D5',
    textAlignVertical: 'center', // **Pastikan teks sejajar secara vertikal**
    paddingVertical: 0, // **Hapus padding default agar tidak terlalu tinggi**
  },

  tambahButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3699FE',
    paddingHorizontal: 15,
    height: 40, // **Samakan tinggi dengan search bar**
    borderRadius: 5,
    marginLeft: 10,
  },

  icon: {
    fontSize: 14, // **Ukuran disesuaikan agar sejajar dengan teks**
  },

  tambahText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12, // **Lebih proporsional**
    textAlignVertical: 'center',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  displayText: {
    fontSize: 13,
    marginRight: 8,
    textAlign: 'center',
    color: '#3f4254',
  },
  dropdown: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItem: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },

  iconButton: {
    padding: 10, // Ukuran tombol lebih besar
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blueButton: {
    backgroundColor: '#20C6C0', // Warna biru untuk reset & edit
  },
  purpleButton: {
    backgroundColor: '#8950FC', // Warna biru untuk reset & edit
  },
  redButton: {
    backgroundColor: '#FF536D', // Warna merah untuk hapus
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#000',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelText: {
    color: '#0A3D62',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  confirmText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    height: 40,
    width: 90,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#fff',
  },
  buttonActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#A463FC', // Warna sesuai desain
  },
  buttonText: {
    fontSize: 14,
    color: 'grey',
  },
  buttonTextModal: {
    color: 'white',
    textAlign: 'center',
  },
  textActive: {
    color: '#A463FC',
  },
  bulanButton: {
    flexDirection: 'row',
    gap: 5,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {fontSize: 16, color: '#333'},
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
});
