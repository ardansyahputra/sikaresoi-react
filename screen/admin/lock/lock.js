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
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import CalendarPicker from 'react-native-calendar-picker';
import axios from 'axios';

export default function Lock() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [activeButton, setActiveButton] = useState('kontrak');
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [selectedBulan, setSelectedBulan] = useState(null);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  useEffect(() => {
    if (activeButton === 'kontrak') {
      fetchKontrakData(1); // Reset to page 1 when display changes
    } else {
      fetchRealisasiData(1); // Reset to page 1 when display changes
    }
  }, [activeButton, selectedDisplay]);

  const fetchRealisasiData = async page => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.123:8000/api/v1/lock/indexRealisasiAndro',
        {page, per: selectedDisplay},
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1MjYxODUwLCJleHAiOjE3ODkyNzU3NzksIm5iZiI6MTczNTI2MjM5OSwianRpIjoibWNVSldkQXB6clZ6TWJGaSIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ne7HJZcdDrbp0ZLX7206cot008P2NullbLWwRF8flFY',
          },
        },
      );
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKontrakData = async page => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.123:8000/api/v1/lock/indexKontrakAndro',
        {page, per: selectedDisplay},
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1MjYxODUwLCJleHAiOjE3ODkyNzU3NzksIm5iZiI6MTczNTI2MjM5OSwianRpIjoibWNVSldkQXB6clZ6TWJGaSIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ne7HJZcdDrbp0ZLX7206cot008P2NullbLWwRF8flFY',
          },
        },
      );
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const submitHapus = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.60.123:8000/api/v1/lock/${selectedUuid}/delete`,
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1MDIzOTQyLCJleHAiOjE3MzUwMzQxNzEsIm5iZiI6MTczNTAzMDU3MSwianRpIjoiWkUzRlQxd294Nml6RXRtZCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.BHAPlRSq8BEw3RTbP4Vgfh0Vp8jQR0tn_lBGRTQwI8o',
          },
        },
      );

      if (response.status === 200 || response.status === 204) {
        // Operasi berhasil
        Alert.alert('Berhasil', 'Data berhasil dihapus.');
        setHapusModalVisible(false);
        fetchData(currentPage); // Refresh data
      } else {
        // Jika respons statusnya tidak seperti yang diharapkan
        Alert.alert(
          'Peringatan',
          'Data mungkin sudah dihapus, tetapi respons tidak sesuai.',
        );
      }
    } catch (error) {
      console.error('Error saat menghapus:', error);
      Alert.alert('Error', 'Gagal menghapus data.');
    }
  };

  const handleHapus = uuid => {
    setSelectedUuid(uuid);
    setHapusModalVisible(true);
  };

  const handleTambah = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    // Helper function to format date
    const formatDate = date => {
      if (!date) return null;
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Format the combined dates
    const tanggalPengisian =
      selectedStartDate && selectedEndDate
        ? `${formatDate(selectedStartDate)} / ${formatDate(selectedEndDate)}`
        : null;

    console.log({
      jenis: selectedJenis,
      tahun: selectedTahun,
      bulan: selectedBulan,
      tanggalPengisian: tanggalPengisian,
    });
    setModalVisible(false);
  };

  const jenisData = [
    {label: 'Kontrak', value: 'kontrak'},
    {label: 'Realisasi', value: 'realisasi'},
  ];

  const tahunData = [
    {label: '2025', value: '2025'},
    {label: '2024', value: '2024'},
    {label: '2023', value: '2023'},
    {label: '2022', value: '2022'},
    {label: '2021', value: '2021'},
    {label: '2020', value: '2020'},
  ];

  const bulanData = [
    {label: 'Januari', value: '1'},
    {label: 'Februari', value: '2'},
    {label: 'Maret', value: '3'},
    {label: 'April', value: '4'},
    {label: 'Mei', value: '5'},
    {label: 'Juni', value: '6'},
    {label: 'Juli', value: '7'},
    {label: 'Agustus', value: '8'},
    {label: 'September', value: '9'},
    {label: 'Oktober', value: '10'},
    {label: 'November', value: '11'},
    {label: 'Desember', value: '12'},
  ];

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const getStatusStyle = status => {
    switch (status?.toUpperCase()) {
      case 'DIBUKA':
        return styles.approvedStatus;
      case 'DITUTUP':
        return styles.rejectedStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const handlePress = buttonName => {
    setActiveButton(buttonName); // Atur tombol aktif
    if (buttonName === 'kontrak') {
      fetchKontrakData(1); // Langsung fetch data saat tombol Kontrak dipilih
    } else {
      fetchRealisasiData(1); // Langsung fetch data saat tombol Realisasi dipilih
    }
  };

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
              fetchRealisasiData(currentPage); // Panggil fetchData setelah nilai dropdown diperbarui
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
        <Text style={[styles.headerCell, styles.nameCell]}>Jenis</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Status</Text>
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
            {item.jenis || '-'}
          </Text>
          <View style={styles.statusCellContainer}>
            <Text
              style={[
                styles.tableCell,
                styles.statusCell,
                getStatusStyle(item.status),
              ]}>
              {item.status || '-'}
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
            <Text style={styles.expandedText}>Jenis: {item.jenis || '-'}</Text>
            <Text style={styles.expandedText}>
              Tahun: {item.tahun?.tahun || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Tanggal Pengisian: {item.tgl_pengisian || '-'}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleApprove(item.uuid)}>
                <FontAwesome name="pencil" size={20} color="white" />
                <Text style={styles.customFont}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleHapus(item.uuid)}>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={styles.customFont}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
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
      </View>

      {/* Card untuk Tombol */}
      <View style={styles.card}>
        <View style={styles.tambahContainer}>
          <TouchableOpacity style={styles.tambahButton} onPress={handleTambah}>
            <FontAwesome
              name="plus"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.tambahText}>TAMBAH</Text>
          </TouchableOpacity>
          <View style={styles.kontrakContainer}>
            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                activeButton === 'kontrak' && styles.buttonActive,
              ]}
              onPress={() => handlePress('kontrak')}>
              <View style={styles.kontrakButton}>
                <FontAwesome
                  name="tint"
                  size={24}
                  color={activeButton === 'kontrak' ? '#A463FC' : 'gray'}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.buttonText,
                    activeButton === 'kontrak' && styles.textActive,
                  ]}>
                  Kontrak
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                activeButton === 'realisasi' && styles.buttonActive,
              ]}
              onPress={() => handlePress('realisasi')}>
              <View style={styles.kontrakButton}>
                <FontAwesome
                  name="tint"
                  size={24}
                  color={activeButton === 'realisasi' ? '#A463FC' : 'gray'}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.buttonText,
                    activeButton === 'realisasi' && styles.textActive,
                  ]}>
                  Realisasi
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Tabel */}
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

      <Modal
        visible={isHapusModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setHapusModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Setujui Data</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setHapusModalVisible(false)}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, styles.approveButton]}
                onPress={submitHapus}>
                <Text style={styles.buttonText}>Setujui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Input Tambah Data */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Data</Text>

            {/* Dropdown Jenis */}
            <Text style={styles.modalLabel}>Jenis:</Text>
            <Dropdown
              data={jenisData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jenis"
              value={selectedJenis}
              onChange={item => setSelectedJenis(item.value)}
              style={styles.dropdownModal}
            />

            {/* Dropdown Tahun */}
            <Text style={styles.modalLabel}>Tahun:</Text>
            <Dropdown
              data={tahunData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Tahun"
              value={selectedTahun}
              onChange={item => setSelectedTahun(item.value)}
              style={styles.dropdownModal}
            />

            {/* Dropdown Bulan */}
            <Text style={styles.modalLabel}>Bulan:</Text>
            <Dropdown
              data={bulanData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              value={selectedBulan}
              onChange={item => setSelectedBulan(item.value)}
              style={styles.dropdownModal}
            />

            <Text style={styles.modalLabel}>Rentang Tanggal:</Text>
            <View style={styles.calendarContainer}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
                onDateChange={onDateChange}
                width={300}
                selectedDayColor="#3699FF"
                selectedDayTextColor="#FFFFFF"
                todayBackgroundColor="#E6E6E6"
                todayTextStyle={{color: '#000000'}}
              />
            </View>

            {/* Tombol Modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  console.log(
                    'Tanggal yang dipilih:',
                    selectedStartDate,
                    selectedEndDate,
                  );
                  handleSave(); // Tutup modal setelah menyimpan
                }}>
                <Text style={styles.buttonText}>Simpan</Text>
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
  expandedContent: {
    padding: 15,
    backgroundColor: '#FAFAFA',
  },
  expandedText: {
    marginBottom: 5,
    fontSize: 14,
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
    minHeight: 80,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dropdownModal: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
  kontrakContainer: {
    flexDirection: 'row',
  },
  kontrakButton: {
    flexDirection: 'row',
    gap: 5,
  },
});
