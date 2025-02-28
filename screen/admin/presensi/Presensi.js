import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BarIndicator} from 'react-native-indicators';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import DatePicker from 'react-native-modern-datepicker';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';

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
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [Tanggal, setTanggal] = useState('');
  const [tambahModalVisible, setTambahModalVisible] = useState(false);
  const apiClient = useApiClient();

  // Fetch data saat komponen pertama kali dimuat
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
    setTanggal(today); // Set tanggal default ke hari ini
    fetchData(currentPage, selectedDisplay, today); // Fetch data untuk hari ini
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  // Fetch data saat currentPage, selectedDisplay, atau Tanggal berubah
  useEffect(() => {
    fetchData(currentPage, selectedDisplay, Tanggal);
  }, [currentPage, selectedDisplay, Tanggal]);

  // Fetch data setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchData(currentPage, selectedDisplay, Tanggal); // Fetch data saat halaman difokuskan
    }, [currentPage, selectedDisplay, Tanggal]),
  );

  const fetchData = async (page, selectedDisplay, tanggal) => {
    try {
      setIsLoading(true);
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
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal memuat data.',
      });
    } finally {
      setIsLoading(false);
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

  const getStatusStyle = status => {
    switch (status?.toUpperCase()) {
      case 'WFO':
        return styles.badgeApproved; // Badge biru
      case 'BELUM HADIR':
        return styles.badgeRejected; // Badge merah
      default:
        return styles.badgeDefault; // Badge default (abu-abu)
    }
  };

  const stripHtml = html => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const TableHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.rowContainer}>
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
          <View style={styles.dropdownsContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}>
              <Text style={[GlobalStyle.SemiBold, styles.dateText]}>
                {Tanggal || 'Pilih Tanggal'}
              </Text>
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

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => navigation.navigate('Presensiexcel')}>
              <FontAwesome
                name="file-excel-o"
                size={20}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
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
          NAMA
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
    if (!item) return null;
    const isExpanded = expandedId === item.id;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF'; // Warna selang-seling

    return (
      <>
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
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}
              numberOfLines={2}>
              {item.name}
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.persenCell,
                getStatusStyle(stripHtml(item.status)),
              ]}>
              {stripHtml(item.status) || '-'} {/* Hapus tag HTML */}
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
              <Text
                style={[GlobalStyle.SemiBold, styles.expandedText]}
                numberOfLines={2}>
                Nama: {item.name}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Tanggal: {item.absensi?.tanggal}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Pemotongan: {item.absensi?.pemotongan}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() => handleEdit(item.id, item.name)}>
                  <Ionicons name="settings-outline" size={20} color="white" />
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
      <Header title="Presensi" />
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
    paddingRight: 8, // Memberi jarak antar teks
    minWidth: 80, // Mencegah terlalu kecil saat teks panjang
  },
  filetext: {
    flexDirection: 'row',
    alignItems: 'left', // Menjadikan teks sejajar secara vertikal
  },

  expandedLinkText: {
    color: '#9B94E9',
  },
  statusCellContainer: {
    width: 100,
  },
  statusCell: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  expandIconCell: {
    width: 30,
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
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    backgroundColor: '#3699FE', // Warna biru untuk reset & edit
  },
  persenCell: {
    fontSize: 12,
  },

  greenButton: {
    backgroundColor: '#1BC5BD', // Warna biru untuk reset & edit
  },
  redButton: {
    backgroundColor: '#FF536D', // Warna merah untuk hapus
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
    marginBottom: 10,
  },
  modalTolak: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%', // Pastikan input menggunakan lebar penuh
    marginVertical: 20, // Tambahkan padding agar tidak di tengah
    paddingHorizontal: 15, // Memberikan ruang pada sisi kiri dan kanan
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#313131',
    fontSize: 14,
    textAlignVertical: 'top', // Pastikan teks dimulai dari atas
    backgroundColor: '#f9f9f9', // Tambahkan warna latar belakang untuk kontras
    borderColor: 'transparent',
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
    backgroundColor: '#1BC5BD',
  },
  confirmTolak: {
    backgroundColor: '#FF536D',
  },
  confirmText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeApproved: {
    backgroundColor: '#C9F7F5', // Biru
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start', // Agar badge tidak melebar
    color: '#1BC5BD',
    maxWidth: 80, // Maksimum lebar badge agar teks bisa turun
    flexWrap: 'wrap',
  },
  badgeRejected: {
    backgroundColor: '#FFE2E5', // Merah
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    color: '#F64E60',
  },
  badgeAbsen: {
    backgroundColor: '#FFF4DE', // kuning
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    color: '#FFA800',
  },
  badgePending: {
    backgroundColor: '#FFF4DE', // Kuning
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    color: '#FFA800',
  },
  badgeDefault: {
    backgroundColor: '#FFF4DE', // kUNING
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    color: '#FFA800',
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
  dropdownsContainer: {
    flexDirection: 'row', // Dropdown Bulan dan Tahun sejajar horizontal
    alignItems: 'center',
    gap: 10,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    height: 42, // Tinggi yang sama untuk semua elemen
    minWidth: 100,
    backgroundColor: '#F7F8FC',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1BC5BD',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 40,
  },
});
