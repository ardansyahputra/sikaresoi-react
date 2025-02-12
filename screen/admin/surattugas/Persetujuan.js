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
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';
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
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
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
          const filePath = `/storage/emulated/0/Download/surat-tugas.pdf`;

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

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

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
      <View style={styles.filterContainer}>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>Display</Text>
          <Dropdown
            style={styles.dropdown}
            data={display}
            labelField="label"
            valueField="value"
            placeholder="10"
            value={selectedDisplay}
            onChange={item => {
              setSelectedDisplay(item.value);
              activeButton === 'direktur'
                ? fetchBulanData(currentPage)
                : fetchTahunData(currentPage);
            }}
            renderItem={item => (
              <Text style={[styles.dropdownItem, styles.customFont]}>
                {item.label}
              </Text>
            )}
            placeholderStyle={styles.customFont}
          />
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>{headerText}</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Status</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const tahunBulanData =
      activeButton === 'direktur' ? item.nomor : item.nomor;

    return (
      <View style={styles.tableRow}>
        <View style={styles.rowHeader}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {tahunBulanData || '-'}
          </Text>
          <View style={styles.actionContainer}>
            <Pressable
              style={({pressed}) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
              onPress={() => handleDownload(item.uuid)}>
              <FontAwesome name="eye" size={16} color="#8950FC" />
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.checkButton,
                pressed && styles.checkButtonPressed,
              ]}
              onPress={() => handleConfirm(item.uuid)}>
              <FontAwesome name="check" size={16} color="#1BC5BD" />
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.revisiButton,
                pressed && styles.revisiButtonPressed,
              ]}
              onPress={() => handleRevisi(item.uuid)}>
              <FontAwesome name="refresh" size={16} color="#F64E60" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Persetujuan Surat Tugas</Text>
        </View>
      </View>

      {/* Card untuk Tombol */}
      <View style={styles.card}>
        <View style={styles.tambahContainer}>
          <View style={styles.bulanContainer}>
            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                activeButton === 'direktur' && styles.buttonActive,
              ]}
              onPress={() => handlePress('direktur')}>
              <View style={styles.bulanButton}>
                <FontAwesome
                  name="tint"
                  size={24}
                  color={activeButton === 'direktur' ? '#A463FC' : 'gray'}
                  style={styles.icon}
                />
                <Text
                  style={[
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
                <FontAwesome
                  name="tint"
                  size={24}
                  color={activeButton === 'umum' ? '#A463FC' : 'gray'}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.buttonText,
                    activeButton === 'umum' && styles.textActive,
                  ]}>
                  Umum
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

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
          contentContainerStyle={styles.card}
          ListFooterComponent={
            <View>
              <Text style={styles.pageInfo}>
                Showing page {currentPage} of {lastPage}
              </Text>
              <View style={styles.paginationContainer}>
                <View style={styles.paginationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === 1 && styles.disabledButton,
                    ]}
                    disabled={currentPage === 1}
                    onPress={handlePreviousPage}>
                    <Text style={styles.pageButtonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === lastPage && styles.disabledButton,
                    ]}
                    disabled={currentPage === lastPage}
                    onPress={handleNextPage}>
                    <Text style={styles.pageButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
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
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, {backgroundColor: '#1BC5BD'}]}
                onPress={submitConfirm}>
                <Text style={styles.buttonText}>Setujui</Text>
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
              <Text style={styles.closeButtonText}>Tutup</Text>
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
    backgroundColor: '#F7F8FB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#333',
  },
  tableRow: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 0,
  },
  rowHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  tableCell: {
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    fontSize: 14,
  },
  tableStatusCell: {
    textAlign: 'center',
    flex: 1,
    paddingLeft: 0,
  },
  numberCell: {
    width: 50,
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
  approvedStatus: {
    backgroundColor: '#C9F7F5',
    color: '#4CAF50',
  },
  rejectedStatus: {
    borderRadius: 5,
    backgroundColor: '#FFE2E5',
    color: '#F44336',
  },
  pendingStatus: {
    color: '#FFC107',
  },
  defaultStatus: {
    color: '#9E9E9E',
  },
  filetext: {
    flexDirection: 'row',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  confirmButton: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1, // Added border width
    borderColor: '#8950FC', // Added border color
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 0,
  },
  confirmButtonPressed: {
    backgroundColor: '#8950FC', // 20 is opacity in hex (12%)
  },
  checkButton: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1, // Added border width
    borderColor: '#1BC5BD', // Added border color
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 0,
  },
  checkButtonPressed: {
    backgroundColor: '#1BC5BD', // 20 is opacity in hex (12%)
  },
  revisiButton: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1, // Added border width
    borderColor: '#F64E60', // Added border color
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 0,
  },
  revisiButtonPressed: {
    backgroundColor: '#F64E60', // 20 is opacity in hex (12%)
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  dropdownModal: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchContainer: {
    width: 180,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
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
    fontFamily: 'Poppins-Regular',
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
    fontSize: 13,
    color: '#333',
  },
  customFont: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  tambahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tambahButton: {
    flexDirection: 'row',
    backgroundColor: '#3699FF',
    width: 90,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tambahText: {
    marginTop: 1,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    marginLeft: 5,
    lineHeight: 20,
    fontSize: 13,
    textAlignVertical: 'center',
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
    backgroundColor: '#E6E7F0',
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'grey',
  },
  textActive: {
    fontFamily: 'Poppins-Regular',
    color: '#A463FC',
  },
  bulanContainer: {
    flexDirection: 'row',
  },
  bulanButton: {
    flexDirection: 'row',
    gap: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  modalMessage: {fontSize: 16, color: '#333'},
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});