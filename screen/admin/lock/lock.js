import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {Pressable} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import useApiClient from '../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';

export default function Lock() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisible, setModalHapusVisible] = useState(false);
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
  const [selectedAction, setSelectedAction] = useState(null);

  const apiClient = useApiClient();

  useFocusEffect(
    React.useCallback(() => {
      if (activeButton === 'kontrak') {
        fetchKontrakData(currentPage);
      } else {
        fetchRealisasiData(currentPage);
      }
    }, [activeButton, currentPage, selectedDisplay]),
  );

  const fetchRealisasiData = async page => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/lock/indexRealisasi', {
        page,
        per: selectedDisplay,
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

  const fetchKontrakData = async page => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/lock/indexKontrak', {
        page,
        per: selectedDisplay,
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

  const handleHapusPress = uuid => {
    setSelectedUuid(uuid);
    setSelectedAction('hapus'); // Tandai bahwa ini aksi hapus
    setModalHapusVisible(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUuid) return;

    setModalHapusVisible(false); // Tutup modal sebelum aksi dijalankan

    try {
      const response = await apiClient.delete(`/lock/${selectedUuid}/delete`);

      if (response.status === 200 || response.status === 204) {
        if (activeButton === 'kontrak') {
          fetchKontrakData(1);
        } else {
          fetchRealisasiData(1);
        }
        Toast.show({
          type: 'success',
          text1: 'Berhasil',
          text2: 'Data berhasil dihapus.',
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'Peringatan',
          text2: 'Data mungkin sudah dihapus, tetapi respons tidak sesuai.',
        });
      }
    } catch (error) {
      console.error('Error saat menghapus:', error);
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal menghapus data.',
      });
    }
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
        return styles.badgeApproved;
      case 'DITUTUP':
        return styles.badgeRejected;
      default:
        return styles.badgeDefault;
    }
  };

  const stripHtml = html => {
    return html.replace(/<[^>]*>/g, '').trim();
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
      <View style={styles.headerContainer}>
        <View style={styles.bulanContainer}>
          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
              activeButton === 'kontrak' && styles.buttonActive,
            ]}
            onPress={() => handlePress('kontrak')}>
            <View style={styles.bulanButton}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
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
            <View style={styles.bulanButton}>
              <Text
                style={[
                  GlobalStyle.SemiBold,
                  styles.buttonText,
                  activeButton === 'realisasi' && styles.textActive,
                ]}>
                Realisasi
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

          <TouchableOpacity style={styles.tambahButton} onPress={handleTambah}>
            <Ionicons name="add" size={18} color="#fff" style={styles.icon} />
            <Text style={[GlobalStyle.SemiBold, styles.tambahText]}>
              Tambah
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          JENIS
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
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {item.jenis || '-'}
            </Text>

            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.persenCell,
                getStatusStyle(item.status),
                getStatusStyle(stripHtml(item.status)),
              ]}>
              {stripHtml(item.status) || '-'}
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
                Jenis: {item.jenis || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Tahun: {item.tahun?.tahun || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Tanggal Pengisian: {item.tgl_pengisian || '-'}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() => handleApprove(item.uuid)}>
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
        {index === data.length - 1 && <View style={styles.verticalLine} />}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Lock" />
      {/* Tabel */}
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
        onRequestClose={() => setModalHapusVisible(false)}>
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
                onPress={() => setModalHapusVisible(false)}>
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

      {/* Modal Input Tambah Data */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalTambahContainer}>
          <View style={styles.modalTambahContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={[GlobalStyle.SemiBold, styles.modalTambahText]}>
              Tambah Data
            </Text>

            {/* Dropdown Jenis */}
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Jenis:
            </Text>
            <Dropdown
              data={jenisData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jenis"
              value={selectedJenis}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={{
                ...GlobalStyle.SemiBold,
                fontSize: 14,
                color: '#313131',
              }}
              itemTextStyle={{
                ...GlobalStyle.SemiBold,
                fontSize: 14,
                color: '#313131',
              }}
              onChange={item => setSelectedJenis(item.value)}
              style={[styles.input]}
            />

            {/* Dropdown Tahun */}
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Tahun:
            </Text>
            <Dropdown
              data={tahunData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Tahun"
              value={selectedTahun}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={{
                ...GlobalStyle.SemiBold,
                fontSize: 14,
                color: '#313131',
              }}
              itemTextStyle={{
                ...GlobalStyle.SemiBold,
                fontSize: 14,
                color: '#313131',
              }}
              onChange={item => setSelectedTahun(item.value)}
              style={[styles.input]}
            />

            {/* Dropdown Bulan */}
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Bulan:
            </Text>
            <Dropdown
              data={bulanData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              value={selectedBulan}
              onChange={item => setSelectedBulan(item.value)}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={{
                ...GlobalStyle.SemiBold,
                fontSize: 14,
                color: '#313131',
              }}
              itemTextStyle={{
                ...GlobalStyle.SemiBold,
                fontSize: 14,
                color: '#313131',
              }}
              style={[styles.input]}
            />

            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Rentang Tanggal:
            </Text>
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
                style={{alignSelf: 'stretch'}}
              />
            </View>

            {/* Tombol Modal */}
            <View style={styles.modalTambahButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  console.log(
                    'Tanggal yang dipilih:',
                    selectedStartDate,
                    selectedEndDate,
                  );
                  handleSave(); // Tutup modal setelah menyimpan
                }}>
                <Text style={[GlobalStyle.SemiBold, styles.buttonSubmitText]}>
                  Simpan
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
  persenCell: {
    fontSize: 12,
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
  modalTambahText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalTambahContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTambahContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginBottom: 20,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
  },
  calendarContainer: {
    width: '104%', // Agar sejajar dengan dropdown di atasnya
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 20,
    alignSelf: 'stretch',
  },

  modalTambahButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#3699FE',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTambahButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
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
  buttonSubmitText: {color: '#fff', fontSize: 14},

  textActive: {
    color: '#A463FC',
  },
  bulanButton: {
    flexDirection: 'row',
    gap: 5,
  },
  badgeApproved: {
    backgroundColor: '#C9F7F5', // Biru
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start', // Agar badge tidak melebar
    color: '#1BC5BD',
  },
  badgeRejected: {
    backgroundColor: '#FFE2E5', // Merah
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    color: '#F64E60',
  },
  badgeDefault: {
    backgroundColor: '#BEC2D5', // Abu-abu
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});
