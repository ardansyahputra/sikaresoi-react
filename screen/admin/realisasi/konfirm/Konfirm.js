import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../../src/api/apiClient';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import {BarIndicator} from 'react-native-indicators';

export default function BelumKontrak() {
  const apiClient = useApiClient();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(10);
  const [activeButton, setActiveButton] = useState('kontrak');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [bulanOptions, setBulanOptions] = useState([]);

  useEffect(() => {
    fetchTahun();
    fetchBulan();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRealisasiData(currentPage, selectedDisplay);
    }, [currentPage, selectedDisplay]),
  );

  useEffect(() => {
    if (activeButton === 'kontrak') {
      fetchRealisasiData(1);
    } else {
      fetchKontrakData(1);
    }
  }, [activeButton, selectedDisplay, selectedYear, selectedMonth]);

  const fetchTahun = async () => {
    try {
      const response = await apiClient.get('/tahun/show');
      console.log('API Response:', response.data); // Debugging log

      if (response.data && response.data.data) {
        // Filter tahun antara 2020-2025
        const filteredTahun = response.data.data.filter(item => {
          const tahun = parseInt(item.tahun);
          return tahun >= 2020 && tahun <= 2025;
        });

        // Set options hanya untuk tahun yang terfilter
        setTahunOptions(
          filteredTahun.map(item => ({label: item.tahun, value: item.tahun})),
        );

        if (filteredTahun.length === 0) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Tidak ada data tahun dalam rentang 2020-2025',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Data tahun tidak ditemukan.',
        });
      }
    } catch (error) {
      console.error('Error fetching tahun:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Gagal memuat data tahun.',
      });
    }
  };

  const fetchBulan = async () => {
    try {
      const response = await apiClient.get('/bulan/show');
      if (response.data && response.data.data) {
        setBulanOptions(
          response.data.data.map(item => ({label: item.bulan, value: item.id})),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Data bulan tidak ditemukan.',
        });
      }
    } catch (error) {
      console.error('Error fetching bulan:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Gagal memuat data bulan.',
      });
    }
  };

  const fetchRealisasiData = async page => {
    console.log('Fetching Realisasi Data');
    try {
      setIsLoading(true);
      const response = await apiClient.post('/realisasi/user_belum_kirim', {
        page: page,
        bulan: selectedMonth,
        per: selectedDisplay,
        search: searchQuery,
        tahun: selectedYear,
      });

      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Realisasi Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Gagal memuat data realisasi.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Update the fetchKontrakData function
  const fetchKontrakData = async page => {
    console.log('Fetching Kontrak Data');
    try {
      setIsLoading(true);
      const response = await apiClient.post('/realisasi/user_sudah_kirim', {
        page: page,
        bulan: selectedMonth,
        per: selectedDisplay,
        search: searchQuery,
        tahun: selectedYear,
      });

      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Kontrak Error:', error);
      console.log('Error', 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handlePress = buttonName => {
    setActiveButton(buttonName);
    if (buttonName === 'kontrak') {
      fetchRealisasiData(1);
    } else {
      fetchKontrakData(1);
    }
  };

  const TableHeader = () => (
    <View>
      <View style={styles.filterHeader}>
        <View style={styles.bottomRow}>
          <View style={styles.bulanContainer}>
            <Pressable
              style={({pressed}) => [
                styles.buttonpress,
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
                  Belum Kirim
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.buttonpress,
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
                  Sudah Kirim
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.separatorLine} />

        {/* Filters Container */}
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
            <Dropdown
              style={styles.dropdownTahun}
              data={tahunOptions}
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
              data={bulanOptions}
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
      </View>

      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          NIP/NRP
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          NAMA
        </Text>
        <View style={styles.expandIconCell} />
      </View>
      <View style={styles.headerLine} />
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF'; // Warna selang-seling

    const nameWithNip = `${item.kinerja?.user_jabatan?.user?.name || ''} ${
      item.kinerja?.user_jabatan?.user?.nik || ''
    }`;
    const nips = `${item.kinerja?.user_jabatan?.user?.nip || ''} ${
      item.kinerja?.user_jabatan?.user?.nip || ''
    }`;

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
              {item.nip || '-'}
            </Text>
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {item.name || '-'}
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
                NIP/NRP: {item.nip || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Nama: {item.name || '-'}
              </Text>
            </View>
          )}
        </View>
        {index === data.length - 1 && <View style={styles.verticalLine} />}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Kirim Realisasi" />
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

  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownsContainer: {
    flexDirection: 'row', // Dropdown Bulan dan Tahun sejajar horizontal
    alignItems: 'center',
    gap: 10,
  },
  monthContainer: {
    flex: 1,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    textAlign: 'center', // Teks di tengah
    width: 100, // Sesuaikan lebar sesuai kebutuhan
  },

  numberCell: {
    width: 45,
  },

  nameCell: {
    flex: 1,
    overflow: 'hidden',
    flexShrink: 1, // Memungkinkan teks agar tidak memaksa ruang lebih
    paddingHorizontal: 8,
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
    marginTop: 10,
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
    marginRight: 10, // **Agar fleksibel di berbagai layar**
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
