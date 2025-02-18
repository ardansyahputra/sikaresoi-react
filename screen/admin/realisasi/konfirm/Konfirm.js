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
} from 'react-native';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../../src/api/apiClient';

export default function BelumKontrak() {
  const apiClient = useApiClient();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
          Alert.alert('Error', 'Tidak ada data tahun dalam rentang 2020-2025');
        }
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
      const response = await apiClient.get('/bulan/show');
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

  const fetchRealisasiData = async page => {
    console.log('Fetching Realisasi Data');
    try {
      setLoading(true);
      const response = await apiClient.post('/realisasi/belum_setuju', {
        page,
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
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchKontrakData function
  const fetchKontrakData = async page => {
    console.log('Fetching Kontrak Data');
    try {
      setLoading(true);
      const response = await apiClient.post('/realisasi/sudah_setuju', {
        page,
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
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
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
      <View style={styles.filterContainer}>
        {/* Bottom Row - Display and Search */}
        <View style={styles.filterRowbl}>
          {/* Display Dropdown */}
          <View style={styles.filterGroupBottom}>
            <Text style={styles.filterLabel}>Display</Text>
            <Dropdown
              style={styles.displayDropdown}
              data={display}
              labelField="label"
              valueField="value"
              placeholder="10"
              value={selectedDisplay}
              onChange={item => {
                setSelectedDisplay(item.value);
                fetchRealisasiData(currentPage);
              }}
              placeholderStyle={styles.dropdownPlaceholder}
            />
          </View>

          {/* Search Input */}
          <View style={styles.filterGroupBottom}>
            <Text style={styles.filterLabel}>Search</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>#</Text>
        <Text style={[styles.headerCell, styles.nipCell]}>NIP/NRP</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Nama</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    const nameWithNip = `${item.kinerja?.user_jabatan?.user?.name || ''} ${
      item.kinerja?.user_jabatan?.user?.nik || ''
    }`;
    const nips = `${item.kinerja?.user_jabatan?.user?.nip || ''} ${
      item.kinerja?.user_jabatan?.user?.nip || ''
    }`;
    const tahun = `${item.kinerja?.tahun?.tahun || ''} ${
      item.kinerja?.tahun?.tahuna || ''
    }`;
    const bulan = `${item.bulan?.bulan || ''} ${
      item.kinerja?.bulan?.bulan || ''
    }`;
    const nipim = `${item.kinerja?.user_jabatan?.pimpinan?.name || ''} ${
      item.kinerja?.userjabatan?.pimpinan?.name || ''
    }`;
    const nrpim = `${item.kinerja?.user_jabatan?.pimpinan?.nip || ''} ${
      item.kinerja?.userjabatan?.pimpinan?.name || ''
    }`;
    const lasap = `${item.update || ''} ${
      item.kinerja?.userjabatan?.pimpinan?.name || ''
    }`;

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text style={[styles.tableCell, styles.nipCell]}>{nips || '-'}</Text>
          <Text style={[styles.tableCell, styles.nameCell]}>
            {nameWithNip || '-'}
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
            <Text style={styles.expandedText}>NIP/NRP: {nips || '-'}</Text>
            <Text style={styles.expandedText}>Nama: {nameWithNip || '-'}</Text>
            <Text style={styles.expandedText}>Tahun: {tahun || '-'}</Text>
            <Text style={styles.expandedText}>Bulan: {bulan || '-'}</Text>
            <Text style={styles.expandedText}>
              NIP/NRP Pimpinan: {nrpim || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Nama Pimpinan: {nipim || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Update Terakhir: {lasap || '-'}
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
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Ionicons name="person-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        {/* Container for buttons and filters */}
        <View style={styles.mainContainer}>
          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
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
                  Belum disetujui
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
                  Sudah Disetujui
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Filters Container */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              {/* Year Dropdown */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Tahun</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={tahunOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="2025"
                  value={selectedYear}
                  onChange={item => setSelectedYear(item.value)}
                  placeholderStyle={styles.dropdownPlaceholder}
                />
              </View>

              {/* Month Dropdown */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Bulan</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={bulanOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="bulan"
                  value={selectedMonth}
                  onChange={item => setSelectedMonth(item.value)}
                  placeholderStyle={styles.dropdownPlaceholder}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider}></View>
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
    padding: 15,
    margin: 10, // Added margin to avoid touching the edges
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: -10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center', // Align items to the center
  },
  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out the year and month dropdowns
    width: '100%', // Full width for the container
  },
  yearContainer: {
    flex: 1,
    marginRight: 10, // Add some space between year and month dropdown
  },
  monthContainer: {
    flex: 1,
  },
  dropdownTahun: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 5,
  },
  dropdownBulan: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 5,
  },
  displayContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  displayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 5,
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
  },
  // Additional styles for header and table rows
  headerCell: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#333',
  },
  rowHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F0F0F0',
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
  nipCell: {
    flex: 1,
    overflow: 'hidden',
  },
  numberCell: {
    width: 50,
  },
  nameCell: {
    flex: 1,
    overflow: 'hidden',
    marginLeft: 35,
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
    marginBottom: 10,
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
  submitButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  searchContainer: {
    width: 180,
    backgroundColor: '#FFFFFF',
    marginRight: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  filterContainer: {
    padding: 15,
    backgroundColor: '#fff',
    gap: 15, // Spacing between rows
  },

  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },

  filterGroupTop: {
    flex: 1,
  },

  filterGroupBottom: {
    flex: 1,
  },

  yearDropdown: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  dropdownBulan: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  displayDropdown: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-Regular',
  },

  dropdownPlaceholder: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },

  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
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
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -0,
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
  mainContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    marginBottom: 35,
    marginLeft: 60,
    marginTop: -17,
  },
  filtersContainer: {
    gap: 15,
    marginRight: 110,
    marginBottom: -20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8, // Kurangi gap
  },
  filterRowbl: {
    flexDirection: 'row',
    gap: 10, // Kurangi gap
    marginBottom: 10,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  dropdown: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  button: {
    height: 40,
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
