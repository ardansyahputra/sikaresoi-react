import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  modalVisible,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import { Alert } from 'react-native';


export default function UangMakan() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isTambahModalVisible, setTambahModalVisible] = useState(false);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [activeButton, setActiveButton] = useState('pulangAwal'); // New state for active button
  const [selectedGolongan, setSelectedGolongan] = useState('');
  const [selectedNominal, setSelectedNominal] = useState('');
  const [selectedType, setSelectedType] = useState(null);


  const apiClient = useApiClient();

  useFocusEffect(
    React.useCallback(() => {
      fetchData(currentPage, selectedDisplay);
    }, [currentPage, selectedDisplay]),
  );

  const fetchData = async (page, display) => {
    try {
      if (!activeButton) return; // Prevent unnecessary API calls

      setIsLoading(true);
      let endpoint = '';
      switch (activeButton) {
        case 'pulangAwal':
          endpoint = '/pemotongan_pulang_awal/index';
          break;
        case 'telambat':
          endpoint = '/pemotongan_terlambat/index';
          break;
        case 'tidakHadir':
          endpoint = '/pemotongan_tidak_hadir/index';
          break;
        default:
          throw new Error('Invalid button type');
      }

      const response = await apiClient.post(endpoint, {
        page,
        display,
      });

      if (!response.data) throw new Error('No data received');

      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching ', error);
      // Optional: Show error toast to user
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTidakHadirEdit = async (uuid, navigation) => {
    try {
      if (!uuid || typeof uuid !== 'string') {
        console.error('UUID tidak valid:', uuid);
        console.log('Error', 'UUID tidak valid.');
        return;
      }

      const endpoint = `/pemotongan_tidak_hadir/${uuid}/edit`;
      const response = await apiClient.get(endpoint);
      const data = response.data.data;

      // Handle specific structure for 'tidakHadir'
      if (
        !data ||
        data.batas_toleransi === undefined ||
        data.potongan === undefined
      ) {
        console.error('Data tidak lengkap:', data);
        console.log('Error', 'Data tidak valid untuk diedit.');
        return;
      }

      console.log('Data edit yang di-fetch:', data);

      navigation.push('EditPa3', {
        jenisAlasan: data.jenis_alasan,
        batasToleransi: data.batas_toleransi,
        potongan: data.potongan,
        uuid: data.uuid,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Terjadi kesalahan saat mengambil data.';
      console.error('Error fetch data edit:', error.response || error);
      console.log('Error', errorMessage);
    }
  };

  // Handle for 'pulangAwal' and 'telambat' (combined in the same function)
  const handleEdit = async (uuid, navigation) => {
    try {
      if (!uuid || typeof uuid !== 'string') {
        console.error('UUID tidak valid:', uuid);
        console.log('Error', 'UUID tidak valid.');
        return;
      }

      let endpoint = '';
      let navigateTo = '';

      switch (activeButton) {
        case 'pulangAwal':
          endpoint = `/pemotongan_pulang_awal/${uuid}/edit`;
          navigateTo = 'EditPa'; // Assuming this is the correct screen for pulangAwal
          break;
        case 'telambat':
          endpoint = `/pemotongan_terlambat/${uuid}/edit`;
          navigateTo = 'EditPa2'; // Assuming this is the correct screen for telambat
          break;
        case 'tidakHadir':
          // Do not handle 'tidakHadir' here, call its separate handler
          return handleTidakHadirEdit(uuid, navigation);
        default:
          console.error('Invalid activeButton:', activeButton);
          return;
      }

      const response = await apiClient.get(endpoint);
      const data = response.data.data;

      if (!data || !data.batas_atas || !data.batas_bawah || !data.potongan) {
        console.error('Data tidak lengkap:', data);
        console.log('Error', 'Data tidak valid untuk diedit.');
        return;
      }

      console.log('Data edit yang di-fetch:', data);

      navigation.navigate(navigateTo, {
        initialPotongan: data.potongan,
        initialBatasAtas: data.batas_atas,
        initialBatasBawah: data.batas_bawah,
        uuid: data.uuid,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Terjadi kesalahan saat mengambil data.';
      console.error('Error fetch data edit:', error.response || error);
      console.log('Error', errorMessage);
    }
  };

  const handleCreate = (navigation, type) => {
    try {
      // Tidak perlu memvalidasi atau mengirimkan data apa pun
      console.log(`Navigasi ke ${type} untuk pembuatan data baru`);

      // Navigasi ke halaman yang sesuai berdasarkan type
      if (type === 'pulangAwal') {
        navigation.navigate('TambahPa'); // Hanya arahkan, tanpa membawa data
      } else if (type === 'telambat') {
        navigation.navigate('TambahPa2'); // Hanya arahkan, tanpa membawa data
      } else if (type === 'tidakHadir') {
        navigation.navigate('TambahPa3'); // Hanya arahkan, tanpa membawa data
      }
    } catch (error) {
      console.error('Error navigating to page:', error);
      console.log(
        'Error',
        'Terjadi kesalahan saat mengarahkan ke halaman Tambah.',
      );
    }
  };

  const handlePress = async buttonName => {
    try {
      setIsLoading(true);
      setActiveButton(buttonName);
      setCurrentPage(1);

      let endpoint = '';
      switch (buttonName) {
        case 'pulangAwal':
          endpoint = '/pemotongan_pulang_awal/index';
          break;
        case 'telambat':
          endpoint = '/pemotongan_terlambat/index';
          break;
        case 'tidakHadir':
          endpoint = '/pemotongan_tidak_hadir/index';
          break;
      }

      const response = await apiClient.post(endpoint, {
        page: 1,
        display: selectedDisplay,
      });

      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData(currentPage, selectedDisplay);
    }, [currentPage, selectedDisplay, activeButton]), // Tidak ada activeButton di dependencies
  );

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleHapusPress = (uuid, type) => {
    console.log("UUID diterima:", uuid);
    console.log("Type diterima:", type);

    if (!uuid || typeof uuid !== 'string') {
        console.error("UUID yang diterima bukan string:", uuid);
        return;
    }

    setSelectedUuid(uuid);
    setSelectedType(type);
    setModalVisible(true);
};


const handleConfirmAction = async () => {
  console.log("UUID yang akan dihapus:", selectedUuid);
  console.log("Tipe yang dipilih:", selectedType);

  if (!selectedUuid || typeof selectedUuid !== 'string') {
      console.error('UUID tidak valid:', selectedUuid);
      Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'UUID tidak valid.',
      });
      return;
  }

  Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus data ini?',
      [
          { text: 'Batal', style: 'cancel' },
          {
              text: 'Hapus',
              onPress: async () => {
                  try {
                      let endpoint = '';

                      switch (selectedType) {
                          case 'pulangAwal':
                              endpoint = `/pemotongan_pulang_awal/${selectedUuid}/delete`;
                              break;
                          case 'terlambat':
                              endpoint = `/pemotongan_terlambat/${selectedUuid}/delete`;
                              break;
                          case 'tidakHadir':
                              endpoint = `/pemotongan_tidak_hadir/${selectedUuid}/delete`;
                              break;
                          default:
                              console.error('Invalid type:', selectedType);
                              return;
                      }

                      console.log("Menghapus dengan endpoint:", endpoint);

                      const response = await apiClient.delete(endpoint);
                      if (response.status === 200) {
                          console.log('Data berhasil dihapus');
                          Toast.show({
                              type: 'success',
                              text1: 'Sukses',
                              text2: 'Data berhasil dihapus.',
                          });

                          fetchData(currentPage, selectedDisplay);
                      }
                  } catch (error) {
                      console.error('Error deleting data:', error);
                      Toast.show({
                          type: 'error',
                          text1: 'Gagal',
                          text2: 'Terjadi kesalahan saat menghapus data.',
                      });
                  }
              },
          },
      ],
      { cancelable: false }
  );
};


  const TableHeader = () => {
    const renderHeaders = () => {
      if (activeButton === 'pulangAwal' || activeButton === 'telambat') {
        return (
          <>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.numberCell,
              ]}>
              #
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.numberCell,
              ]}>
              Batas Bawah
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.reasonCell,
              ]}>
              Batas Atas
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.deductionCell,
              ]}>
              Potongan
            </Text>
          </>
        );
      } else {
        // Default case for other buttons like 'tidakHadir'
        return (
          <>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.numberCell,
              ]}>
              NO
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.reasonCell,
              ]}>
              JENIS CUTI
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.toleranceCell,
              ]}>
              BATAS TOLERANSI
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.headerCell,
                styles.deductionCell,
              ]}>
              POTONGAN
            </Text>
          </>
        );
      }
    };
  
    return (
      <View>
        <View style={styles.headerContainer}>
          {/* Toggle Buttons Container */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={({pressed}) => [
                styles.toggleButton,
                pressed && styles.buttonPressed,
                activeButton === 'pulangAwal' && styles.buttonActive,
              ]}
              onPress={() => handlePress('pulangAwal')}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'pulangAwal' && styles.textActive,
                ]}>
                Pulang Awal
              </Text>
            </Pressable>
  
            <Pressable
              style={({pressed}) => [
                styles.toggleButton,
                pressed && styles.buttonPressed,
                activeButton === 'telambat' && styles.buttonActive,
              ]}
              onPress={() => handlePress('telambat')}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'telambat' && styles.textActive,
                ]}>
                Telambat
              </Text>
            </Pressable>
  
            <Pressable
              style={({pressed}) => [
                styles.toggleButton,
                pressed && styles.buttonPressed,
                activeButton === 'tidakHadir' && styles.buttonActive,
              ]}
              onPress={() => handlePress('tidakHadir')}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'tidakHadir' && styles.textActive,
                ]}>
                Tidak Hadir
              </Text>
            </Pressable>
          </View>
  
          {/* Search and Add Button Container */}
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
            <TouchableOpacity
              style={styles.tambahButton}
              onPress={() => handleCreate(navigation, activeButton)}>
              <Ionicons name="add" size={18} color="#fff" style={styles.icon} />
              <Text style={[GlobalStyle.SemiBold, styles.tambahText]}>
                Tambah
              </Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Table Header */}
        <View style={styles.tableHeader}>
          {renderHeaders()}
          <View style={styles.expandIconCell} />
        </View>
        <View style={styles.headerLine} />
      </View>
    );
  };
  

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF';

    if (activeButton === 'tidakHadir') {
      return (
        <View style={styles.tableRow}>
          <TouchableOpacity
            style={[styles.rowHeader, {backgroundColor: rowBackgroundColor}]}
            onPress={() => toggleExpand(item.id)}>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.numberCell,
              ]}>
              {index + 1}
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.reasonCell,
              ]}>
              {item.jenis_alasan || '-'}
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.toleranceCell,
              ]}>
              {item.batas_toleransi || '-'}
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.deductionCell,
              ]}>
              {item.potongan || '-'}
            </Text>
            <View style={styles.expandIconCell}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#BEC2D5"
              />
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Jenis Cuti: {item.jenis_alasan || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Batas Toleransi: {item.batas_toleransi || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Potongan: {item.potongan || '-'}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() => handleTidakHadirEdit(item.uuid, navigation)}>
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, styles.redButton]}
                  onPress={() => handleHapusPress(item.uuid, 'tidakhadir')}>
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.tableRow}>
          <TouchableOpacity
            style={[styles.rowHeader, {backgroundColor: rowBackgroundColor}]}
            onPress={() => toggleExpand(item.id)}>
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
              {item.batas_bawah || '-'}
            </Text>
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {item.batas_atas || '-'}
            </Text>
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {item.potongan || '-'}
            </Text>
            <View style={styles.expandIconCell}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#BEC2D5"
              />
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Batas Bawah: {item.batas_bawah || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Batas Atas: {item.batas_atas || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Potongan: {item.potongan || '-'}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() => handleEdit(item.uuid, navigation)}>
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, styles.redButton]}
                  onPress={() => handleHapusPress(item.uuid)}>
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Pemotongan" />
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
                  onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
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
                  onPress={() =>
                    setCurrentPage(prev => Math.min(prev + 1, lastPage))
                  }>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.modalText]}>
              {selectedAction === 'hapus'
                ? 'Apakah Anda yakin ingin menghapus data ini?'
                : 'Apakah Anda yakin ingin mereset password pengguna ini?'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={[GlobalStyle.SemiBold, styles.cancelText]}>
                  Tidak
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirmAction}>
                <Text style={[GlobalStyle.SemiBold, styles.confirmText]}>
                  Ya
                </Text>
              </TouchableOpacity>
            </View>
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
  reasonCell: {
    flex: 2,
    paddingHorizontal: 10,
  },
  toleranceCell: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  deductionCell: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 42, // **Tinggi sama dengan tombol tambah**
    flex: 1,
    maxWidth: '60%', // **Agar fleksibel di berbagai layar**
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
    marginLeft: 12,
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
    backgroundColor: '#007AFF',
  },
  redButton: {
    backgroundColor: '#FF3B30',
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
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#fff',
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
  bulanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Posisi ke kiri
    gap: 10,
    marginBottom: 20, // Beri jarak antara tombol Bulan & Tahun dengan Search Bar
  },
  toggleButton: {
    height: 40,
    paddingHorizontal: 15,
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
    borderBottomColor: '#3699ff',
  },

  buttonText: {
    fontSize: 14,
    color: 'grey',
  },

  textActive: {
    color: '#3699ff',
  },

  searchAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContainer: {
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
});
