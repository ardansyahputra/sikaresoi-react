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
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import useApiClient from '../src/api/apiClient';
import Header from './Header';
import GlobalStyle from './GlobalStyle';
import {BarIndicator} from 'react-native-indicators';

export default function PersetujuanRealisasi({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(10);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [bulanOptions, setBulanOptions] = useState([]);
  const apiClient = useApiClient();

  useEffect(() => {
    fetchData(selectedMonth, selectedYear, selectedDisplay, searchQuery);
    fetchTahun();
    fetchBulan();
  }, []);

  useEffect(() => {
    fetchData(selectedMonth, selectedYear, selectedDisplay, searchQuery);
  }, [selectedMonth, selectedYear, selectedDisplay, searchQuery]);

  const fetchTahun = async () => {
    try {
      const response = await apiClient.get('/tahun/show', {});

      console.log('API Response:', response.data); // Debugging log

      if (response.data && response.data.data) {
        setTahunOptions(
          response.data.data.map(item => ({label: item.tahun, value: item.id})),
        );
      } else {
        Alert.alert('Error', 'Data tahun tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error fetching tahun:', error);
      Alert.alert('Error', 'Gagal memuat data tahun.');
    }
  };

  const fetchBulan = async () => {
    try {
      const response = await apiClient.get('/bulan/show', {});

      console.log('API Response:', response.data); // Debugging log

      if (response.data && response.data.data) {
        setBulanOptions(
          response.data.data.map(item => ({label: item.bulan, value: item.id})),
        );
      } else {
        Alert.alert('Error', 'Data bulan tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error fetching bulan:', error);
      Alert.alert('Error', 'Gagal memuat data bulan.');
    }
  };

  const fetchData = async (bulanId, tahunId, perPage, search) => {
    try {
      setIsLoading(true);
      const payload = {
        bulan_id: bulanId || 1,
        tahun_id: tahunId || 6,
        per: perPage || 10,
        search: search || '',
      };
      const response = await apiClient.post(
        '/user/kinerja/send_realisasi/indexAndro',
        payload,
        {},
      );
  
      // Normalize headers to handle duplicates
      const normalizedHeaders = {};
      for (const [key, value] of Object.entries(response.headers)) {
        normalizedHeaders[key.toLowerCase()] = value;
      }
  
      console.log('Normalized Headers:', normalizedHeaders);
  
      if (response.data && response.data.data) {
        setData(response.data.data);
        setCurrentPage(response.data.current_page || 1);
        setLastPage(response.data.last_page || 1);
      } else {
        Alert.alert('Error', 'Data tidak valid.');
        console.error('Invalid response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const TableHeader = () => (
    <View>
      <View style={styles.filterHeader}>
        <View style={styles.bottomRow}>
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
        <View style={styles.separatorLine} />
        <View style={styles.yearMonthContainer}>
          <View style={styles.monthContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.displayText]}>
              Bulan :
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={bulanOptions}
              labelField="label"
              valueField="value"
              placeholder="-- PILIH BULAN --"
              value={selectedMonth}
              onChange={item => setSelectedMonth(item.value)}
              labelStyle={styles.dropdownLabel}
              selectedTextStyle={styles.dropdownText} // Font Poppins untuk teks yang dipilih
              placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
              itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
              itemStyle={styles.dropdownItemText}
            />
          </View>
          <View style={styles.yearContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.displayText]}>
              Tahun :
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={tahunOptions}
              labelField="label"
              valueField="value"
              placeholder="-- PILIH TAHUN --"
              value={selectedYear}
              onChange={item => setSelectedYear(item.value)}
              labelStyle={styles.dropdownLabel} // Label font Poppins
              selectedTextStyle={styles.dropdownText} // Font Poppins untuk teks yang dipilih
              placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
              itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
              itemStyle={styles.dropdownItemText}
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
          DETAIL PENGIRIM
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          JABATAN
        </Text>
        <View style={styles.expandIconCell} />
      </View>
      <View style={styles.headerLine} />
    </View>
  );

  const toggleExpand = id => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;
    const rowBackgroundColor = index % 2 === 0 ? '#F7F8FC' : '#FFFFFF'; // Warna selang-seling

    const nameWithNip = `${item.kinerja?.user_jabatan?.user?.name || ''} ${
      item.kinerja?.user_jabatan?.user?.nip || ''
    }`;
    const jabatanAndUnitKerja = `${
      item.kinerja?.user_jabatan?.jabatan?.nm_jabatan || ''
    } - ${item.kinerja?.user_jabatan?.unit_kerja?.nm_unit_kerja || ''}`;

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
            {/* Display Detail Pengirim (name_nip) */}
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {nameWithNip || '-'}
            </Text>
            {/* Display Jabatan */}
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {jabatanAndUnitKerja || '-'}
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
                Periode: {item.kinerja?.user_jabatan?.periode || '-'}
              </Text>

              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Status: {item.status_class || '-'}
              </Text>

              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Status Revisi: {item.revisi_class || '-'}
              </Text>

              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Aksi:
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() => {
                    console.log("🔍 Mengirim Params ke RealisasiNext:", {
                      id: item.uuid,
                      selectedBulanId: selectedMonth,
                      tahunId: selectedYear,
                      userJabatanId: item.kinerja?.user_jabatan?.id || null,
                      name: item.kinerja?.user_jabatan?.user?.name || "Nama Tidak Diketahui", // Kirim nama user
                    });
                
                    navigation.navigate('RealisasiNext', {
                      id: item.uuid,
                      selectedBulanId: selectedMonth,
                      tahunId: selectedYear,
                      userJabatanId: item.kinerja?.user_jabatan?.id || null,
                      name: item.kinerja?.user_jabatan?.user?.name || "Nama Tidak Diketahui", // Kirim nama user
                    });
                  }}
                >                
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
      <Header title="Persetujuan Realisasi" />
      {/* <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Persetujuan Realisasi</Text>
        <Text style={styles.separatorText}> • </Text>
        <Text style={styles.headerSubtitle}>Realisasi</Text>
      </View> */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
  tableHeader: {
    backgroundColor: '#E9EDFD',
    marginTop: 15,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 16,
  //   paddingVertical: 18,
  //   borderBottomLeftRadius: 20,
  //   borderBottomRightRadius: 20,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   elevation: 5,
  // },

  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  yearContainer: {
    flex: 1,
    marginRight: 10,
  },
  monthContainer: {
    flex: 1,
  },

  separatorLine: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 15,
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
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
    marginBottom: 4,
    marginTop: 10,
  },

  headerSubtitle: {
    color: '#000',
    marginLeft: 20,
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
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

  icon: {
    fontSize: 14, // **Ukuran disesuaikan agar sejajar dengan teks**
  },

  filterHeader: {
    marginBottom: 15,
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  // Style untuk dropdown display
  dropdownDisplay: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 80, // Lebar sesuai kebutuhan
    justifyContent: 'center',
  },

  // Style untuk dropdown bulan
  dropdownBulan: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },

  dropdownItem: {
    padding: 10,
    fontSize: 16,
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

  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
  },

  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: '#000',
  },

  separatorText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 3,
  },

  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000',
    marginLeft: 0,
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
  },
});
