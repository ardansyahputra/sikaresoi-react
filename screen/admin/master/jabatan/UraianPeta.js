import React, {useState, useEffect, useCallback, act} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../../src/api/apiClient';
import {useNavigation} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import Toast from 'react-native-toast-message';
import {useRoute} from '@react-navigation/native';
import TambahUraian from '../uraian/Tambah';

export default function UraianPeta() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [activeButton, setActiveButton] = useState('bulan');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const apiClient = useApiClient();
  const route = useRoute();
  const {id, tahun} = route.params || {}; // Tangkap parameter yang dikirim
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, [currentPage, activeButton, selectedDisplay]),
  );

  const fetchData = async () => {
    try {
      if (activeButton === 'bulan') {
        const [bulanResponse] = await Promise.all([
          apiClient.post(`/uraian/jabatan/indexMasterUraian`, {
            tahun_id: tahun,
            jabatan_id: id,
          }),
        ]);
        setData(bulanResponse.data.data);
        setLastPage(bulanResponse.data.last_page || 1);
      } else {
        const [tahunResponse] = await Promise.all([
          apiClient.post(`/uraian/jabatan/index`, {
            tahun_id: tahun,
            jabatan_id: id,
          }),
        ]);
        setData(tahunResponse.data.data);
        setLastPage(tahunResponse.data.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHapusPress = uuid => {
    setSelectedUuid(uuid);
    setSelectedAction('hapus'); // Tandai bahwa ini aksi hapus
    setModalVisible(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUuid) return;

    setModalVisible(false); // Tutup modal sebelum aksi dijalankan
    setIsLoading(true); // Aktifkan loading

    // Langsung update state UI agar terlihat lebih cepat
    setData(prevData => prevData.filter(item => item.uuid !== selectedUuid));

    try {
      await apiClient.get(`uraian/jabatan/${selectedUuid}/delete`);

      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Data berhasil dihapus.',
      });

      fetchData(activeButton); 
    } catch (error) {
      console.error('Error saat menghapus data:', error);
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal menghapus data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTambah = uuid => {
    navigation.navigate('TambahUraianPeta', {
      tahun_id: tahun,
      jabatan_id: id,
      uuid: uuid,
    });
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
    setIsLoading(true); // Aktifkan loading segera
    setActiveButton(buttonName);
    setCurrentPage(1);
  };

  const headerText = activeButton === 'bulan' ? 'Name' : 'Uraian';

  const TableHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        {/* Baris atas: Tombol Bulan & Tahun */}
        <View style={styles.bulanContainer}>
          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
              activeButton === 'bulan' && styles.buttonActive,
            ]}
            onPress={() => handlePress('bulan')}>
            <View style={styles.bulanButton}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'bulan' && styles.textActive,
                ]}>
                Bulan
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
              activeButton === 'tahun' && styles.buttonActive,
            ]}
            onPress={() => handlePress('tahun')}>
            <View style={styles.bulanButton}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'tahun' && styles.textActive,
                ]}>
                Tahun
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
          Aksi
        </Text>
        <View style={styles.expandIconCell} />
      </View>
      <View style={styles.headerLine} />
    </View>
  );

  const renderItem = ({item, index}) => {
    const tahunBulanData =
      activeButton === 'bulan' ? item.nm_uraian : item.uraian?.nm_uraian;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF'; // Warna selang-seling

    const handleButtonPress = () => {
      if (activeButton === 'bulan') {
        handleTambah(item.uuid);
      } else {
        handleHapusPress(item.uuid);
      }
    };

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
                style={[
                  styles.iconButton,
                  activeButton === 'bulan'
                    ? styles.blueButton
                    : styles.redButton,
                ]}
                onPress={handleButtonPress}>
                <Ionicons
                  name={activeButton === 'bulan' ? 'add' : 'trash'}
                  size={20}
                  color="white"
                />
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
      <Header title="Uraian Peta Jabatan" />
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
    backgroundColor: '#3699FE', // Warna biru untuk reset & edit
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
  textActive: {
    color: '#A463FC',
  },
  bulanButton: {
    flexDirection: 'row',
    gap: 5,
  },
});
