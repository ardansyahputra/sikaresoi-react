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

export default function PersetujuanRealisasi({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
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
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const TableHeader = () => (
    <View>
      <View style={styles.filterHeader}>
        <View style={styles.yearMonthContainer}>
          <View style={styles.yearContainer}>
            <Text style={styles.displayText}>Tahun :</Text>
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
          <View style={styles.monthContainer}>
            <Text style={styles.displayText}>Bulan :</Text>
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
        </View>
        <View style={styles.separatorLine} />
        <View style={styles.bottomRow}>
          <View style={styles.displayContainer}>
            <Text style={styles.displayText}>Display</Text>
            <Dropdown
              style={styles.dropdown}
              data={[
                {label: '10', value: 10},
                {label: '25', value: 25},
                {label: '50', value: 50},
                {label: '100', value: 100},
              ]}
              labelField="label"
              valueField="value"
              placeholder="10"
              value={selectedDisplay}
              onChange={item => setSelectedDisplay(item.value)}
            />
          </View>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#000"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>
          Detail Pengirim
        </Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Jabatan</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const toggleExpand = id => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    const nameWithNip = `${item.kinerja?.user_jabatan?.user?.name || ''} ${
      item.kinerja?.user_jabatan?.user?.nip || ''
    }`;
    const jabatanAndUnitKerja = `${
      item.kinerja?.user_jabatan?.jabatan?.nm_jabatan || ''
    } - ${item.kinerja?.user_jabatan?.unit_kerja?.nm_unit_kerja || ''}`;

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          {/* Display Detail Pengirim (name_nip) */}
          <Text style={[styles.tableCell, styles.nameCell]}>
            {nameWithNip || '-'}
          </Text>
          {/* Display Jabatan */}
          <Text style={[styles.tableCell, styles.nameCell]}>
            {jabatanAndUnitKerja || '-'}
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
            {/* Display Action Button (Preview) */}

            <Text style={styles.expandedText}>
              Periode: {item.kinerja?.user_jabatan?.periode || '-'}
            </Text>

            <Text style={styles.expandedText}>
              Status: {item.status_class || '-'}
            </Text>

            <Text style={styles.expandedText}>
              Status Revisi: {item.revisi_class || '-'}
            </Text>

            <Text style={styles.expandedText}>Aksi:</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate('RealisasiNext', {id: item.uuid})
              }>
              <FontAwesome name="eye" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('./assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Persetujuan Realisasi</Text>
        <Text style={styles.separatorText}> • </Text>
        <Text style={styles.headerSubtitle}>Realisasi</Text>
      </View>
      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backButton: {
    marginTop: 1,
    marginLeft: 3,
    marginRight: 1,
    opacity: 0.4,
  },
  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  yearContainer: {
    flex: 1,
    marginRight: 10,
  },
  monthContainer: {
    flex: 1,
  },

  separatorLine: {
    height: 3,
    backgroundColor: '#000',
    marginVertical: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Regular',
  },

  expandedLinkText: {
    color: 'blue',
    marginBottom: 5,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
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

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    maxWidth: '60%',
    marginLeft: 'auto',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'left',
    color: '#000',
    width: '100%',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  dropdownTahun: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
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
    fontFamily: 'Poppins-Regular', // Poppins untuk teks item
    fontSize: 14,
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-Regular', // Placeholder font Poppins
    fontSize: 14,
  },

  dropdownLabel: {
    fontFamily: 'Poppins-SemiBold', // Label font Poppins
    fontSize: 16,
  },
  dropdownText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

<View style={styles.headerContainer}>
  <View style={styles.filterHeader}>
    {/* Tahun dan Bulan Dropdown */}
    <View style={styles.yearMonthContainer}>
      {/* Tahun Dropdown */}
      <View style={styles.yearContainer}>
        <Text style={styles.displayText}>Tahun :</Text>
        <Dropdown
          style={styles.dropdownTahun}
          data={tahunOptions}
          labelField="label"
          valueField="value"
          placeholder="-- PILIH TAHUN --"
          value={selectedYear}
          onChange={item => setSelectedYear(item.value)}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
          itemTextStyle={styles.dropdownItemText}
          itemStyle={styles.dropdownItem}
        />
      </View>

      {/* Bulan Dropdown */}
      <View style={styles.monthContainer}>
        <Text style={styles.displayText}>Bulan :</Text>
        <Dropdown
          style={styles.dropdownBulan}
          data={bulanOptions}
          labelField="label"
          valueField="value"
          placeholder="-- PILIH BULAN --"
          value={selectedMonth}
          onChange={item => setSelectedMonth(item.value)}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
          itemTextStyle={styles.dropdownItemText}
          itemStyle={styles.dropdownItem}
        />
      </View>
    </View>

    {/* Garis Pemisah */}
    <View style={styles.separatorLine} />

    {/* Display Dropdown dan Search Bar */}
    <View style={styles.bottomRow}>
      {/* Display Dropdown */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>Display</Text>
        <Dropdown
          style={styles.dropdownDisplay}
          data={[
            {label: '10', value: 10},
            {label: '25', value: 25},
            {label: '50', value: 50},
            {label: '100', value: 100},
          ]}
          labelField="label"
          valueField="value"
          placeholder="10"
          value={selectedDisplay}
          onChange={item => setSelectedDisplay(item.value)}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
          itemTextStyle={styles.dropdownItemText}
          itemStyle={styles.dropdownItem}
        />
      </View>

      {/* Search Bar */}
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
  </View>
</View>;
