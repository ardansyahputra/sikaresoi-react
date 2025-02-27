import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import DatePicker from 'react-native-modern-datepicker';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../components/Header';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

const CustomDatePicker = ({isVisible, onClose, onDateChange, currentDate}) => {
  const slideAnim = React.useRef(
    new Animated.Value(BOTTOM_SHEET_HEIGHT),
  ).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  transform: [
                    {
                      translateY: slideAnim,
                    },
                  ],
                },
              ]}>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Select Date</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <DatePicker
                mode="calendar"
                onDateChange={onDateChange}
                current={currentDate || new Date().toISOString().split('T')[0]}
                options={{
                  textHeaderColor: '#007BFF',
                  textDefaultColor: '#333',
                  selectedTextColor: '#FFF',
                  mainColor: '#007BFF',
                  textSecondaryColor: '#B0B0B0',
                  borderColor: 'rgba(122, 146, 165, 0.1)',
                }}
                style={styles.datePicker}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function Jabatan() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [Tanggal, setTanggal] = useState('');
  const [tambahModalVisible, setTambahModalVisible] = useState(false);
  const apiClient = useApiClient();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    setTanggal(today); // Set the default date to today
    fetchData(currentPage, selectedDisplay, today); // Fetch data for today initially
  }, []); // Empty dependency array to run only once on component mount

  useEffect(() => {
    fetchData(currentPage, selectedDisplay, Tanggal); // Fetch data whenever date or other dependencies change
  }, [currentPage, selectedDisplay, Tanggal]); // Watch for changes to currentPage, selectedDisplay, and Tanggal

  const fetchData = async (page, selectedDisplay, tanggal) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/admin/absensi/index', {
        page,
        per: selectedDisplay,
        search: searchQuery,
        tanggal: tanggal || '', // Pastikan tanggal dikirimkan dengan benar
      });

      if (response?.data?.data) {
        setData(response.data.data);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      } else {
        console.error('Data tidak valid:', response);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, name) => {
    console.log('Navigating to Presensiedit with:', {
      userId: id,
      userName: name,
      selectedDate: Tanggal, // Pastikan ini berisi nilai tanggal
    });

    navigation.navigate('Presensiedit', {
      userId: id,
      userName: name,
      selectedDate: Tanggal,
    });
  };

  const display = [
    {label: '5', value: 1},
    {label: '10', value: 2},
    {label: '25', value: 3},
    {label: '50', value: 4},
    {label: '100', value: 5},
  ];

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDateChange = React.useCallback(
    date => {
      const [year, month, day] = date.split('/');
      const formattedDate = `${year}-${month}-${day}`; // Pastikan format yang benar

      if (formattedDate !== Tanggal) {
        setTanggal(formattedDate);
        setShowDatePicker(false); // Tutup popup setelah memilih tanggal
      }
    },
    [Tanggal],
  );

  const TableHeader = () => (
    <View>
      <View style={styles.tambahContainer}>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{Tanggal || 'Pilih Tanggal'}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>

          <CustomDatePicker
            isVisible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateChange={handleDateChange}
            currentDate={
              Tanggal ||
              new Date().toISOString().split('T')[0].replace(/-/g, '/')
            }
          />
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => navigation.navigate('Presensiexcel')}>
          <FontAwesome
            name="file-excel-o"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.downloadText}>Download Excel</Text>
        </TouchableOpacity>
      </View>

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
            onChange={item => setSelectedDisplay(item.value)}
            renderItem={item => (
              <Text style={[styles.dropdownItem, styles.customFont]}>
                {item.label}
              </Text>
            )}
          />
        </View>
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
        <Text style={[styles.headerCell, styles.nameCell]}>Nama</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Status</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    if (!item) return null;
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
            {item.name}
          </Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.status}
          </Text>
          <View style={styles.actionCell}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#333"
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedText}>Nama: {item.name}</Text>
            <Text style={styles.expandedText}>
              Tanggal: {item.absensi?.tanggal}
            </Text>
            <Text style={styles.expandedText}>
              Pemotongan: {item.absensi?.pemotongan}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item.id, item.name)}>
                <FontAwesome name="cogs" size={30} color="white" />
                <Text style={styles.customFont}></Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}></View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
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
    marginLeft: 10,
  },
  nameCell: {
    flex: 2,
    overflow: 'hidden',
    marginright: 100,
  },
  statusCellContainer: {
    width: 100,
  },
  statusCell: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 35,
  },
  expandIconCell: {
    width: 40,
    alignItems: 'flex-end',
  },
  approvedStatus: {
    color: '#4CAF50',
  },
  rejectedStatus: {
    color: '#F44336',
  },
  pendingStatus: {
    color: '#FFC107',
  },
  defaultStatus: {
    color: '#9E9E9E',
  },
  expandedContent: {
    padding: 15,
    backgroundColor: '#FAFAFA',
  },
  expandedText: {
    marginBottom: 5,
    fontSize: 14,
    marginright: 10,
  },
  dibacaWrapper: {
    flexDirection: 'row', // Menyusun "Dibaca:" dan nilai dibaca dalam satu baris
    alignItems: 'center', // Menyusun konten secara vertikal agar berada sejajar
    marginBottom: 5, // Memberikan jarak bawah setelah wrapper
    flexWrap: 'wrap', // Memungkinkan elemen untuk membungkus jika terlalu panjang
  },
  dibacaValueWrapper: {
    backgroundColor: '#4CAF50', // Warna latar belakang default
    borderRadius: 8, // Membuat sudut rounded
    paddingVertical: 5, // Menambahkan padding vertikal di dalam wrapper
    paddingHorizontal: 10, // Menambahkan padding horizontal di dalam wrapper
    marginright: 20,
    marginBottom: 20, // Memberikan jarak antara "Dibaca:" dan nilai
    maxWidth: '100%', // Membatasi lebar nilai agar tidak melampaui layar
    overflow: 'hidden', // Menyembunyikan konten yang melampaui batas
  },
  DibacaText: {
    fontSize: 14,
    color: '#fff', // Warna teks putih agar kontras dengan background
  },
  expandedLinkText: {
    color: 'blue',
    marginBottom: 5,
    fontSize: 14,
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
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
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
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    width: 150,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
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
    fontSize: 12,
    color: '#333',
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
  },
  tambahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Agar elemen dalam satu baris rata tengah secara vertikal
    marginBottom: 10,
    padding: 10, // Tambahkan padding agar terlihat lebih rapi
    backgroundColor: '#F9F9F9', // Warna latar belakang untuk elemen container
    borderRadius: 8, // Tambahkan border radius untuk gaya lebih modern
    elevation: 2, // Bayangan untuk tampilan lebih menarik di Android
    shadowColor: '#000', // Bayangan untuk iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tambahButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    width: 90,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tambahText: {
    fontFamily: 'Poppins-Regular',
    color: 'white', // Warna teks putih agar kontras dengan latar belakang gelap
    lineHeight: 10,
    fontSize: 10,
    textAlignVertical: 'center',
    marginRight: 10,
  },
  downloadText: {
    fontFamily: 'Poppins-Regular',
    color: 'white', // Warna teks putih agar kontras dengan latar belakang gelap
    lineHeight: 20,
    fontSize: 14,
    textAlignVertical: 'center',
    marginRight: 10,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
  },
  tambahText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3699FF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  customFont: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
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
  input: {
    flex: 1, // Agar input mengambil ruang yang tersedia
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF', // Tambahkan latar belakang putih untuk input
    marginRight: 10, // Beri jarak antar elemen di sebelah kanan
  },
  datePickerContainer: {
    marginBottom: 10,
  },

  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: BOTTOM_SHEET_HEIGHT,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    // Add elevation for Android
    elevation: 5,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  datePicker: {
    borderRadius: 10,
  },
  confirmDateButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmDateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
