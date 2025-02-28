import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import {BarIndicator} from 'react-native-indicators';

const AttendanceChangeTable = () => {
  // State
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const navigation = useNavigation();
  const [jabatanList, setJabatanList] = useState([]); // State untuk data jabatan
  const [selectedJabatan, setSelectedJabatan] = useState(null); // State untuk jabatan yang dipilih
  const apiClient = useApiClient();

  // Handlers
  const handleDateChange = date => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setShowDatePicker(false);
  };

  useEffect(() => {
    if (selectedMonth && selectedYear && selectedJabatan) {
      fetchData();
    }
  }, [currentPage, selectedMonth, selectedYear, selectedJabatan]);

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchData = async () => {
    if (!selectedJabatan) {
      console.lo('Error: user_jabatan_id harus dipilih sebelum fetch data.');
      return;
    }

    try {
      setIsLoading(true);
      const baseURL = 'tanggung_renteng/realisasi';

      const params = {};
      if (selectedMonth) params.bulan_id = selectedMonth;
      if (selectedYear) params.tahun = selectedYear;
      if (selectedJabatan) params.user_jabatan_id = selectedJabatan;

      console.log('Mengirim request dengan parameter:', params);

      const response = await apiClient.get(baseURL, {params});
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk fetch data jabatan
  const fetchJabatanData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('tanggung_renteng/jabatan');

      const formattedData = response.data.data.map(item => ({
        label: `${item.user.name} - ${item.jabatan.nm_jabatan} (${item.periode})`,
        value: item.id,
      }));

      setJabatanList(formattedData); // Simpan data ke state
    } catch (error) {
      console.error('Error fetching jabatan data:', error);
    } finally {
      setIsLoading(false);
    }
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
    {label: '2020', value: 2020},
    {label: '2021', value: 2021},
    {label: '2022', value: 2022},
    {label: '2023', value: 2023},
    {label: '2024', value: 2024},
    {label: '2025', value: 2025},
  ];

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  // Panggil fetchJabatanData saat komponen dimuat
  useEffect(() => {
    fetchJabatanData();
  }, []);

  const handleHapus = uuid => {
    setSelectedUuid(uuid);
    setHapusModalVisible(true);
  };

  const handleEdit = (uuid, kuantitas, usulan_kuantitas) => {
    // Log data yang dikirimkan
    console.log('Data dikirim:', {
      uuid,
      kuantitas,
      usulan_kuantitas,
    });

    // Navigasi ke halaman RealisasiTanggung
    navigation.navigate('RealisasiTanggung', {
      uuid,
      kuantitas,
      usulan_kuantitas,
    });
  };

  const TableHeader = () => (
    <View>
      <View style={styles.filterHeader}>
        <View style={styles.rowContainer}>
          {/* Dropdown for Month and Year */}
          <View style={styles.dropdownsContainer}>
            <View style={styles.rowDropdowns}>
              <Dropdown
                style={styles.dropdownBulan}
                data={months} // Menggunakan state `month` yang sudah didefinisikan
                labelField="label"
                valueField="value"
                placeholder="Bulan"
                labelStyle={styles.dropdownLabel}
                selectedTextStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                itemTextStyle={styles.dropdownItemText}
                value={selectedMonth}
                onChange={item => {
                  setSelectedMonth(item.value); // Update bulan yang dipilih
                  fetchData(currentPage, item.value, selectedYear); // Panggil fetchData dengan bulan dan tahun
                  if (item.year) {
                    setSelectedYear(item.year); // Perbarui tahun berdasarkan bulan
                  }
                }}
              />
              <Dropdown
                style={styles.dropdownTahun}
                data={years}
                labelField="label"
                valueField="value"
                placeholder="Tahun"
                labelStyle={styles.dropdownLabel}
                selectedTextStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                itemTextStyle={styles.dropdownItemText}
                value={selectedYear}
                onChange={item => setSelectedYear(item.value)}
              />
            </View>

            {/* Dropdown Jabatan */}

            <Dropdown
              style={styles.dropdownjabatan}
              data={jabatanList}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              labelStyle={styles.dropdownLabel}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
              value={selectedJabatan}
              onChange={item => {
                setSelectedJabatan(item.value);
                if (selectedMonth && selectedYear) {
                  fetchData();
                }
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}
          numberOfLines={2}>
          URAIAN KEGIATAN
        </Text>
        <Text
          style={[
            GlobalStyle.SemiBold,
            styles.headerCell,
            styles.tableStatusCell,
          ]}
          numberOfLines={2} // Bisa disesuaikan sesuai kebutuhan
          ellipsizeMode="tail">
          STATUS
        </Text>
        <View style={styles.expandIconCell} />
      </View>
      <View style={styles.headerLine} />
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF';

    return (
      <>
        <View style={styles.tableRow}>
          <TouchableOpacity
            style={[styles.rowHeader, {backgroundColor: rowBackgroundColor}]}
            onPress={() => toggleExpand(item.id)}>
            <Text style={[styles.tableCell, styles.numberCell]}>
              {index + 1}
            </Text>
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}
              numberOfLines={2}>
              {item.target.list_kinerja.uraian.nm_uraian || '-'}
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.persenCell,
              ]}>
              {item.status ? 'Active' : 'Inactive'}
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
              {/* Biaya */}
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Biaya:{' '}
                {item.target?.list_kinerja?.uraian?.biaya !== undefined
                  ? item.target.list_kinerja.uraian.biaya
                  : '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                AK:{' '}
                {item.target?.list_kinerja?.uraian?.angka_kredit !== undefined
                  ? item.target.list_kinerja.uraian.angka_kredit
                  : '-'}
              </Text>

              {/* Kuantitas */}
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Kuantitas: {item.kuantitas || '-'}
              </Text>
              {/* Kualitas */}
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Kualitas: {item.target?.list_kinerja?.kualitas || '-'}
              </Text>
              {/* Bobot */}
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Bobot: {item.target?.list_kinerja?.bobot || '-'}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() =>
                    handleEdit(item.uuid, item.kuantitas, item.usulan_kuantitas)
                  }>
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {index === data.length - 1 && <View style={styles.verticalLine} />}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Tanggung Renteng" />
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
    </View>
  );
};

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
  persenCell: {
    fontSize: 12,
  },
  tableStatusCell: {
    width: 80,
    textAlign: 'center',
  },
  numberCell: {
    width: 45,
  },
  nameCell: {
    flex: 1,
    overflow: 'hidden',
    flexShrink: 1, // Memungkinkan teks agar tidak memaksa ruang lebih
    paddingHorizontal: 8, // Memberi jarak antar teks
    minWidth: 80, // Mencegah terlalu kecil saat teks panjang
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterHeader: {
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowDropdowns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,

    marginBottom: 20,
  },
  dropdownBulan: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: 120,
  },
  dropdownTahun: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: 90,
  },
  dropdownJabatan: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: '100%', // Lebih besar agar sesuai dengan keinginan
  },
  dropdownLabel: {
    fontFamily: 'Poppins-SemiBold', // Label font Poppins
    fontSize: 14,
    color: 'grey',
  },
  dropdownItemText: {
    fontFamily: 'Poppins-SemiBold', // Poppins untuk teks item
    fontSize: 14,
    color: 'grey',
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-SemiBold', // Placeholder font Poppins
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
  },
  dropdownText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    color: 'grey',
    fontFamily: 'Poppins-SemiBold',
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
});

export default AttendanceChangeTable;
