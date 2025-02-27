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
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const AttendanceChangeTable = () => {
  // State
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error('Error: user_jabatan_id harus dipilih sebelum fetch data.');
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  // Fungsi untuk fetch data jabatan
  const fetchJabatanData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('tanggung_renteng/jabatan');

      const formattedData = response.data.data.map(item => ({
        label: `${item.user.name} - ${item.jabatan.nm_jabatan} (${item.periode})`,
        value: item.id,
      }));

      setJabatanList(formattedData); // Simpan data ke state
    } catch (error) {
      console.error('Error fetching jabatan data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Search Bar */}
      <View style={styles.searchContainer}></View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>
          Uraian Kegiatan
        </Text>
        <Text style={[styles.headerCell, styles.tableStatusCelll]}>STATUS</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.target.list_kinerja.uraian.nm_uraian || '-'}
          </Text>
          <Text style={[styles.tableCell, styles.tableCellRight]}>
            {item.status ? 'Active' : 'Inactive'}
          </Text>
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
            {/* Biaya */}
            <Text style={styles.expandedText}>
              Biaya:{' '}
              {item.target?.list_kinerja?.uraian?.biaya !== undefined
                ? item.target.list_kinerja.uraian.biaya
                : '-'}
            </Text>
            <Text style={styles.expandedText}>
              AK:{' '}
              {item.target?.list_kinerja?.uraian?.angka_kredit !== undefined
                ? item.target.list_kinerja.uraian.angka_kredit
                : '-'}
            </Text>

            {/* Kuantitas */}
            <Text style={styles.expandedText}>
              Kuantitas: {item.kuantitas || '-'}
            </Text>
            {/* Kualitas */}
            <Text style={styles.expandedText}>
              Kualitas: {item.target?.list_kinerja?.kualitas || '-'}
            </Text>
            {/* Bobot */}
            <Text style={styles.expandedText}>
              Bobot: {item.target?.list_kinerja?.bobot || '-'}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  handleEdit(item.uuid, item.kuantitas, item.usulan_kuantitas)
                }>
                <FontAwesome name="chevron-down" size={20} color="white" />
                <Text style={styles.customFont}>Realisasi</Text>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown for Month and Year */}
      <View style={styles.filterContainer}>
        <Dropdown
          style={styles.dropdown}
          data={months} // Menggunakan state `month` yang sudah didefinisikan
          labelField="label"
          valueField="value"
          placeholder="Bulan"
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
          style={styles.dropdown}
          data={years}
          labelField="label"
          valueField="value"
          placeholder="Tahun"
          value={selectedYear}
          onChange={item => setSelectedYear(item.value)}
        />
      </View>

      {/* Dropdown Jabatan */}
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdownjabatan}
          data={jabatanList}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan"
          value={selectedJabatan}
          onChange={item => {
            setSelectedJabatan(item.value);
            if (selectedMonth && selectedYear) {
              fetchData();
            }
          }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          ListHeaderComponent={TableHeader}
          data={filteredData}
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
                    onPress={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }>
                    <Text style={styles.pageButtonText}>Previous</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
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
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
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
    flexWrap: 'wrap',
    fontSize: 14,
  },
  tableStatusCell: {
    textAlign: 'left',
    flex: 1,
    paddingLeft: 0,
  },
  numberCell: {width: 30},
  nameCell: {
    flex: 1,
    overflow: 'hidden',
  },
  statusCellContainer: {
    width: 100,
    paddingLeft: 28,
  },
  statusCell: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  expandIconCell: {
    width: 40,
    alignItems: 'flex-end',
  },
  expandedContent: {
    padding: 15,
    backgroundColor: '#FAFAFA',
  },
  expandedText: {
    marginBottom: 5,
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  paginationButtons: {
    flexDirection: 'row',
  },

  paginationText: {
    color: 'white',
    fontWeight: 'bold',
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
    backgroundColor: '#B0BEC5',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  pageInfo: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },

  searchContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  dropdown: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 120,
  },
  dropdownjabatan: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 380,
  },
  dropdownContainer: {
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row', // Atur elemen menjadi horizontal
    justifyContent: 'space-between', // Membuat elemen terpisah secara merata
    alignItems: 'center', // Align vertikal
    width: 1000, // Memastikan container memenuhi lebar penuh
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B0FF',
    paddingVertical: 9,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginHorizontal: 20,
  },
  addButtonText: {
    fontSize: 12,
    color: 'white',
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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonSimpan: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#3699ef',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonBatal: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#F64E60',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
  },
  /* Other styles omitted for brevity */
  modalLabel: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
    justifyContent: 'flex-start',
  },
  dateInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },

  editButton: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1Bc5BD',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
});

export default AttendanceChangeTable;
