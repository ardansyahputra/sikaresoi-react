import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BarIndicator} from 'react-native-indicators';

const AttendanceChangeTable = ({navigation}) => {
  // State
  const navigate = useNavigation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [selectedYear, setSelectedYear] = useState(2022);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [potongan, setPotongan] = useState('');
  const [error, setError] = useState('');
  const [nameList, setNameList] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const apiClient = useApiClient();
  const [selectedAction, setSelectedAction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Handlers
  const handleHapusPress = uuid => {
    setSelectedUuid(uuid);
    setSelectedAction('hapus'); // Tandai bahwa ini aksi hapus
    setModalVisible(true);
  };

  const handleCreate = () => {
    navigation.navigate('PotonganLainTambah');
  };

  const handleConfirmAction = async () => {
    if (!selectedUuid) return;

    setModalVisible(false); // Tutup modal sebelum aksi dijalankan

    try {
      await apiClient.delete(`/potongan_lain/${selectedUuid}/delete`);
      fetchData(currentPage);
      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Data berhasil dihapus.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal menghapus data.',
      });
    }
  };


  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData(currentPage, selectedMonth, selectedYear, 1); // Pastikan fetchData dipanggil dengan bulan dan tahun
    }
  }, [currentPage, selectedMonth, selectedYear]);

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchData = async (page, month, year) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('potongan_lain/index', {
        page,
        bulan: selectedMonth,
        tahun: selectedYear,
      });
      setData(response.data.data);
      setFilteredData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const TableHeader = () => (
    <View>
      {/* Search Bar */}
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
          onPress={() => handleCreate(navigation)}>
          <Ionicons name="add" size={18} color="#fff" style={styles.icon} />
          <Text style={[GlobalStyle.SemiBold, styles.tambahText]}>Tambah</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          NAMA
        </Text>
        <Text
          style={[
            GlobalStyle.SemiBold,
            styles.headerCell,
            styles.potonganCell,
          ]}>
          POTONGAN
        </Text>
        <View style={styles.expandIconCell} />
      </View>
      <View style={styles.headerLine} />
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF'; // Warna selang-seling

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={[styles.rowHeader, {backgroundColor: rowBackgroundColor}]}
          onPress={() => toggleExpand(item.id)}>
          <Text
            style={[GlobalStyle.Regular, styles.tableCell, styles.numberCell]}>
            {index + 1}
          </Text>
          <Text
            style={[GlobalStyle.Regular, styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.user?.name || '-'}
          </Text>
          <View style={styles.statusCellContainer}>
            <Text
              style={[
                GlobalStyle.Regular,
                styles.tableCell,
                styles.statusCell,
              ]}>
              {item.potongan || '-'}
            </Text>
          </View>
          <View style={styles.expandIconCell}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#333"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={[GlobalStyle.Regular, styles.expandedText]}>
              Tanggal: {item.tanggal || '-'}
            </Text>
            <Text style={[GlobalStyle.Regular, styles.expandedText]}>
              NIP: {item.user?.nip || '-'}
            </Text>
            <Text style={[GlobalStyle.Regular, styles.expandedText]}>
              Tanggal: {item.tanggal || '-'}
            </Text>
            <Text style={[GlobalStyle.Regular, styles.expandedText]}>
              keterangan: {item.keterangan || '-'}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.iconButton, styles.blueButton]}
                onPress={() => navigation.navigate('PotonganlainEdit')}>
                <FontAwesome name="pencil" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.redButton]}
                onPress={() => handleHapusPress(item.uuid)}>
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const months = [
    {label: 'January', value: 1},
    {label: 'February', value: 2},
    {label: 'March', value: 3},
    {label: 'April', value: 4},
    {label: 'May', value: 5},
    {label: 'June', value: 6},
    {label: 'July', value: 7},
    {label: 'August', value: 8},
    {label: 'September', value: 9},
    {label: 'October', value: 10},
    {label: 'November', value: 11},
    {label: 'December', value: 12},
  ];

  const years = [
    {label: '2022', value: 2022},
    {label: '2023', value: 2023},
    {label: '2024', value: 2024},
    {label: '2025', value: 2025},
  ];

  const handlePotonganChange = text => {
    // Hapus semua karakter selain angka dan titik
    const cleanText = text.replace(/[^0-9.]/g, '');

    // Hapus semua titik ribuan untuk validasi
    const numberValue = cleanText.replace(/\./g, '');

    // Validasi input untuk memastikan angka valid
    const regex = /^\d*(\.\d{0,2})?$/; // Mengizinkan angka dengan maksimal dua desimal
    if (regex.test(numberValue) || numberValue === '') {
      // Format ulang angka dengan pemisah ribuan
      const formattedText = numberValue
        ? new Intl.NumberFormat('id-ID').format(parseFloat(numberValue))
        : '';

      setPotongan(formattedText);
      setError('');
    } else {
      setError('Format potongan tidak valid');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Konfirmasi Realisasi" />
      <View style={styles.bottomContainer}>
        {/* Dropdown for Month and Year */}
        <View style={styles.dropdownsContainer}>
          <Dropdown
            style={styles.dropdownTahun}
            data={years}
            labelField="label"
            valueField="value"
            placeholder="2025"
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
            labelStyle={styles.dropdownLabel}
            selectedTextStyle={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
            itemTextStyle={styles.dropdownItemText}
          />

          {/* Month Dropdown */}
          <Dropdown
            style={styles.dropdownBulan}
            data={months}
            labelField="label"
            valueField="value"
            placeholder="bulan"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
            labelStyle={styles.dropdownLabel}
            selectedTextStyle={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
            itemTextStyle={styles.dropdownItemText}
          />
        </View>
      </View>

      {isLoading ? (
        // Loading Indicator
        <View style={styles.loadingContainer}>
          <BarIndicator color="#D4C6C6" count={5} size={24} />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={TableHeader}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.card}
          ListFooterComponent={
            <View>
              <Text style={[GlobalStyle.SemiBold, styles.pageInfo]}>
                {currentPage} of {lastPage}
              </Text>
              <View style={styles.paginationContainer}>
                <View style={styles.paginationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === 1 && styles.disabledButton,
                    ]}
                    disabled={currentPage === 1}
                    onPress={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }>
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={currentPage === 1 ? '#333' : '#BEC2D5'}
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
                    <Text style={styles.pageButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
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
};

const styles = StyleSheet.create({
  dropdownsContainer: {
    flexDirection: 'row', // Dropdown Bulan dan Tahun sejajar horizontal
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  monthContainer: {
    flex: 1,
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
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableHeader: {
    marginTop: 15,
    marginTop: 15,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  rowContainer: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    color: 'grey',
    fontFamily: 'Poppins-SemiBold',
  },
  dropdownTahun: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: 80,
  },
  dropdownBulan: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: 120,
  },
  monthContainer: {
    flex: 1,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerCell: {
    fontSize: 13,
    color: '#9196B5',
    color: '#9196B5',
  },

  tableRow: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 0,
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
    backgroundColor: '#F7F8FC',
    alignItems: 'center',
  },

  tableCell: {
    flexWrap: 'wrap',
    color: '#313131',
    color: '#313131',
    fontSize: 14,
  },

  tableStatusCell: {
    textAlign: 'center', // Teks di tengah
    width: 100, // Sesuaikan lebar sesuai kebutuhan
  },

  numberCell: {
    width: 45,
    width: 45,
  },

  nameCell: {
    flex: 1,
    overflow: 'hidden',
    flexShrink: 1, // Memungkinkan teks agar tidak memaksa ruang lebih
    paddingHorizontal: 10,
    minWidth: 80, // Mencegah terlalu kecil saat teks panjang
    marginRight: 5,
  },
  potonganCell: {
    flex: 1,
    overflow: 'hidden',
    flexShrink: 1, // Memungkinkan teks agar tidak memaksa ruang lebih
    paddingHorizontal: 29,
    minWidth: 10, // Mencegah terlalu kecil saat teks panjang
  },

  statusCellContainer: {
    width: 100,
  },

  statusCell: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 20,
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

  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pageButton: {
    padding: 8, // Padding agar tombol lebih mudah diklik
    padding: 8, // Padding agar tombol lebih mudah diklik
    borderRadius: 5,
  },

  pageButtonText: {
    fontSize: 15,
    color: '#fff',
  },

  disabledButton: {
    opacity: 0.5, // Efek disabled lebih jelas
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 42, // **Tinggi sama dengan tombol tambah**
    flex: 1,
    maxWidth: '60%', // **Agar fleksibel di berbagai layar**
    marginLeft: 10,
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
    paddingHorizontal: 20,
    height: 40, // **Samakan tinggi dengan search bar**
    borderRadius: 5,
    marginLeft: 10,
  },
  tambahText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12, // **Lebih proporsional**
    textAlignVertical: 'center',
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

  icon: {
    fontSize: 14, // **Ukuran disesuaikan agar sejajar dengan teks**
  },

  filterHeader: {
    marginBottom: 10,
    // borderWidth: 1,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  displayContainer: {
    flex: 1,
    maxWidth: '20%',
    marginRight: 10,
  },

  displayText: {
    fontSize: 14,
    textAlign: 'left',
    color: 'grey',
    width: '100%',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    color: 'grey',
    fontFamily: 'Poppins-SemiBold',
  },
  dropdownTahun: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: 80,
  },
  dropdownBulan: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: 120,
  },
  // Style untuk dropdown display
  dropdownDisplay: {
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 80, // Lebar sesuai kebutuhan
    justifyContent: 'center',
  },

  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: '#333',
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

  separatorText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 3,
  },

  dropdownItemText: {
    fontFamily: 'Poppins-SemiBold', // Poppins untuk teks item
    fontSize: 14,
    color: 'grey',
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-SemiBold', // Placeholder font Poppins
    fontFamily: 'Poppins-SemiBold', // Placeholder font Poppins
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
  },

  dropdownLabel: {
    fontFamily: 'Poppins-SemiBold', // Label font Poppins
    fontSize: 14,
    color: 'grey',
  },
  dropdownText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
    color: 'grey',
  },
  dropdownText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
  },
  bulanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Posisi ke kiri
    gap: 10,
    marginBottom: 20,
  },
  buttonpress: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingHorizontal: 5,
  },
  buttonPressed: {
    backgroundColor: '#fff',
  },
  buttonActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#A463FC', // Warna sesuai desain
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 42, // **Tinggi sama dengan tombol tambah**
    flex: 1,
    maxWidth: '60%', // **Agar fleksibel di berbagai layar**
    marginLeft: 10,
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
    paddingHorizontal: 20,
    height: 40, // **Samakan tinggi dengan search bar**
    borderRadius: 5,
    marginRight: 10,
  },

  icon: {
    fontSize: 20, // **Ukuran disesuaikan agar sejajar dengan teks**
    fontWeight: 'bold',
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

export default AttendanceChangeTable;