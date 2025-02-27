import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import useApiClient from '../../../../src/api/apiClient';
import axios from 'axios';

const MasterKinerjaRealisasi = ({ navigation }) => {
  // Core data states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDisplay, setSelectedDisplay] = useState(10); // Default to 10 items per page
  const [userJabatanData, setUserJabatanData] = useState(null);
  const [userJabatanId, setUserJabatanId] = useState(null);
  const [kinerjaId, setKinerjaId] = useState(null);
  const [tgsTambahan, setTgsTambahan] = useState(true); // Set default to true for Tugas Tambahan
  const [checkedItems, setCheckedItems] = useState([]);
  const [disabledItems, setDisabledItems] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [pimpinanId, setPimpinanId] = useState(null);
  const [bulanId, setBulanId] = useState(null);
  
  // Kinerja calculation states
  const [kinerja, setKinerja] = useState({
    totalak: 0,
    totalwpt: 0,
    totalbobot: 0,
    tahun_id: null,
    bulan_id: null,
    user_jabatan_id: null,
    alert: { show: false },
  });
  const [listKinerja, setListKinerja] = useState({ utama: [], tambahan: [] });
  
  const apiClient = useApiClient();

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const jabatanData = await fetchUserJabatanData();
        const yearsData = await fetchYears();
        const monthsData = await fetchMonth();
        
        // Log initialization results
        console.log('Initialization complete:', {
          jabatanId: userJabatanId,
          year: selectedYear,
          month: selectedMonth
        });
      } catch (error) {
        console.error('Error initializing data:', error);
        Alert.alert('Error', 'Gagal memuat data awal.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch data when dependencies change
  useEffect(() => {
    if (userJabatanId && selectedYear && selectedMonth) {
      console.log('Fetching data with:', { userJabatanId, selectedYear, selectedMonth });
      fetchKontrak(currentPage, selectedYear, selectedMonth);
      fetchListUraian(currentPage);
    }
  }, [currentPage, selectedDisplay, selectedYear, selectedMonth, userJabatanId]);

  // Filter data when search query changes
  useEffect(() => {
    if (data.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.nm_uraian?.toLowerCase().includes(lowerCaseQuery) ||
          item.nm_satuan?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Don't fetch here, let the useEffect handle it
  };

  const parseCheckbox = (checkbox) => {
    // Handle case where checkbox might be a string or object
    if (typeof checkbox === 'string') {
      const isChecked = checkbox.includes('checked="checked"');
      const isDisabled = checkbox.includes('disabled="disabled"');
      return { isChecked, isDisabled };
    }
    return { isChecked: false, isDisabled: false };
  };

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      if (response?.data?.data) {
        const userData = response.data.data;
        setUserJabatanData(userData);
        setUserJabatanId(userData.jabatan_id);
        console.log('User jabatan data fetched:', userData);
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
      throw error;
    }
  };

  const fetchKontrak = async (page = 1, year = selectedYear, month = selectedMonth) => {
    try {
      setLoading(true);
      console.log('Fetching kontrak with:', { page, year, month });
      
      const response = await apiClient.post('user/kinerja/list/target/realisasi/index', {
        page,
        tahun_id: year,
        bulan_id: month,
      });
  
      if (response?.data) {
        console.log('Kontrak response received:', response.data);
        
        const utamaData = response.data.utama || [];
        const tambahanData = response.data.tambahan || [];
        
        // Store the kinerja_id from the response for future use
        if (response.data.kinerja_id) {
          setKinerjaId(response.data.kinerja_id);
          console.log('Kinerja ID set from response:', response.data.kinerja_id);
        } else if (utamaData && utamaData.length > 0 && utamaData[0].kinerja_id) {
          setKinerjaId(utamaData[0].kinerja_id);
          console.log('Kinerja ID set from utamaData:', utamaData[0].kinerja_id);
        }
        
        // Make sure to handle tgs_tambahan properly
        if (response.data.tgs_tambahan !== undefined) {
          setTgsTambahan(response.data.tgs_tambahan);
        } else {
          setTgsTambahan(true); // Default to true for this screen
        }
  
        setData(utamaData);
        setCurrentPage(response.data.current_page || 1);
        setLastPage(response.data.last_page || 1);
  
        // Calculate totals from data
        const totalAk = utamaData.reduce((sum, item) => 
          sum + (parseFloat(item.target?.list_kinerja?.angka_kredit) || 0), 0);
        const totalWpt = utamaData.reduce((sum, item) => 
          sum + (parseFloat(item.target?.list_kinerja?.wpt) || 0), 0);
        const totalBobot = utamaData.reduce((sum, item) => 
          sum + (parseFloat(item.target?.list_kinerja?.bobot) || 0), 0);
  
        setKinerja({
          totalak: totalAk,
          totalwpt: totalWpt,
          totalbobot: totalBobot,
          tahun_id: year,
          bulan_id: month,
          user_jabatan_id: userJabatanData?.id,
          alert: { show: false },
        });
  
        setListKinerja({ utama: utamaData, tambahan: tambahanData });
      } else {
        console.error('Invalid data structure:', response);
        setData([]);
      }
    } catch (error) {
      handleApiError('Error fetching kontrak data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMonth = async () => {
    try {
      const response = await apiClient.get('bulan/show');
  
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const months = response.data.data.map(month => ({
          label: month.bulan.toString(),
          value: month.id,
        }));
  
        setBulanId(months);
  
        // Get current month (1-12)
        const currentMonthIndex = new Date().getMonth() + 1;
        
        // Find the month object with matching value
        const defaultMonth = months.find(month => month.value === currentMonthIndex);
        
        // Set the selected month
        const monthValue = defaultMonth ? defaultMonth.value : months[0]?.value || null;
        setSelectedMonth(monthValue);
        console.log('Selected month set to:', monthValue);
        
        return months;
      } else {
        throw new Error('Invalid month data format');
      }
    } catch (error) {
      console.error('Error fetching month:', error);
      Alert.alert('Error', 'Gagal memuat data bulan.');
      throw error;
    }
  };

  const fetchYears = async () => {
    try {
      const response = await apiClient.get('tahun/show');
      if (response?.data?.data) {
        const years = response.data.data.map(year => ({
          label: year.tahun.toString(),
          value: year.id,
        }));

        // Set default year to current year
        const currentYear = new Date().getFullYear();
        const defaultYear = years.find(
          year => year.label === currentYear.toString(),
        );
        
        const yearValue = defaultYear ? defaultYear.value : years[0]?.value;
        setSelectedYear(yearValue);
        console.log('Selected year set to:', yearValue);
        
        return years;
      } else {
        throw new Error('Failed to load year options');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      Alert.alert('Error', 'Gagal memuat data tahun.');
      throw error;
    }
  };

  const fetchListUraian = async (page = currentPage) => {
    try {
      setLoading(true);
      console.log('Fetching uraian list with:', {
        page,
        per: selectedDisplay,
        jabatan_id: userJabatanId,
        kinerja_id: kinerjaId,
        tgs_tambahan: tgsTambahan,
        search: searchQuery
      });
      
      const response = await apiClient.post('uraian/indexAndro_user', {
        page,
        per: selectedDisplay,
        jabatan_id: userJabatanId || null,
        kinerja_id: kinerjaId || null,
        tgs_tambahan: tgsTambahan,
        search: searchQuery,
      });

      if (response?.data?.data) {
        console.log('Uraian list fetched successfully');
        const fetchedData = response.data.data;
        const checkedIds = [];
        const disabledIds = [];

        fetchedData.forEach((item) => {
          // Check if item.checkbox exists before parsing
          if (item.checkbox) {
            const { isChecked, isDisabled } = parseCheckbox(item.checkbox);
            if (isChecked) {
              checkedIds.push(item.id);
            }
            if (isDisabled) {
              disabledIds.push(item.id);
            }
          }
        });

        console.log('Checked items:', checkedIds);
        console.log('Disabled items:', disabledIds);
        
        setCheckedItems(checkedIds);
        setDisabledItems(disabledIds);
        setData(fetchedData);
        setCurrentPage(response.data.current_page || 1);
        setLastPage(response.data.last_page || 1);
      } else {
        console.error('Invalid data:', response);
        setData([]);
      }
    } catch (error) {
      handleApiError('Error fetching uraian list', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxToggle = async (item) => {
    if (!item || !item.id) {
      console.error('Missing item or item.id in handleCheckboxToggle');
      return;
    }
    
    // Check if item is disabled
    if (disabledItems.includes(item.id)) {
      console.log('Item is disabled, ignoring toggle:', item.id);
      return; // Do nothing if disabled
    }
  
    // Toggle checked state
    const isChecked = checkedItems.includes(item.id);
    console.log('Toggling checkbox:', { itemId: item.id, currentState: isChecked });
    
    let newCheckedItems;
    
    if (isChecked) {
      newCheckedItems = checkedItems.filter(id => id !== item.id);
    } else {
      newCheckedItems = [...checkedItems, item.id];
    }
    
    // Update state immediately for responsive UI
    setCheckedItems(newCheckedItems);
    
    // Prepare the item for saving with toggled state
    const itemToSave = {
      ...item,
      checked: !isChecked
    };
    
    try {
      setLoading(true);
      console.log('Saving item after toggle:', itemToSave);
      
      // Save the item
      const saveResult = await saveListKinerja(itemToSave);
      console.log('Save result:', saveResult);
      
      // Show success message
      Alert.alert('Success', 'Perubahan berhasil disimpan');
      
      // Refresh data after saving - important to see changes
      if (userJabatanId && selectedYear && selectedMonth) {
        await fetchKontrak(currentPage, selectedYear, selectedMonth);
      }
    } catch (error) {
      console.error('Error saving after checkbox toggle:', error);
      
      // If save fails, revert the checkbox state
      setCheckedItems(isChecked ? [...checkedItems] : checkedItems.filter(id => id !== item.id));
      Alert.alert('Error', 'Gagal menyimpan perubahan.');
    } finally {
      setLoading(false);
    }
  };

  const saveListKinerja = async (item) => {
    try {
      if (!item || !item.id) {
        throw new Error('Invalid item data: Missing ID');
      }
      
      // Debug log
      console.log('Saving item:', JSON.stringify(item, null, 2));
      
      // Use existing kinerjaId from state if available
      const kinerjaUuid = kinerjaId || null;
      
      // Get the correct uraian_id
      const uraianId = item.uraian_id || item.id;
      
      if (!uraianId) {
        throw new Error('Missing uraian_id');
      }
      
      if (!userJabatanData?.id || !selectedYear || !selectedMonth) {
        throw new Error(`Missing required data: user_jabatan_id=${userJabatanData?.id}, tahun_id=${selectedYear}, or bulan_id=${selectedMonth}`);
      }
      
      // Construct the payload
      const payload = {
        kinerja: {
          uuid: kinerjaUuid,
          user_jabatan_id: userJabatanData?.id,
          tahun_id: selectedYear,
          bulan_id: selectedMonth,
          status: 0,
        },
        list: {
          id: null, // Let the backend generate a new ID for this entry
          uraian_id: uraianId,
          kuantitas: item.kuantitas || 0,
          kualitas: item.kualitas || 0,
          waktu: item.waktu || 0,
          bobot: item.bobot || 0,
          wpt: item.wpt || 0,
          tgs_tambahan: true, // This is the tugas tambahan screen
          target_point: item.target_point || 0,
          uraian_point: item.uraian_point || 0,
          // Add a checked property that reflects the current state
          checked: checkedItems.includes(item.id)
        },
        keterangan: {
          bulan_id: selectedMonth,
          pimpinan_id: pimpinanId || null,
        },
      };
  
      console.log('Sending payload for save:', JSON.stringify(payload, null, 2));
      
      const response = await apiClient.post('user/kinerja/list/save', payload);
      console.log('Save response:', response.data);
      
      // Store the kinerja_id from the response if it exists
      if (response.data && response.data.kinerja_id) {
        setKinerjaId(response.data.kinerja_id);
        console.log('Updated kinerjaId from response:', response.data.kinerja_id);
      }
      
      return response.data;
    } catch (error) {
      handleApiError('Error saving kinerja data', error);
      throw error;
    }
  };

  const handleApiError = (message, error) => {
    console.error(message, error);
    
    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }
    } else {
      console.log('Non-Axios error:', error.message);
    }
    
    Alert.alert(
      'Error',
      error.response?.data?.message || error.message || 'Terjadi kesalahan pada server.'
    );
  };

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const TableHeader = () => (
    <View>
      <View style={styles.filterContainer}>
        <View style={styles.displayContainer}>
          <Text style={[styles.displayText, styles.customFont]}>Uraian Kegiatan Tidak Ada?</Text>
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

        {/* Button Kinerja */}
        <View style={styles.buttonRightContainer}>
          <TouchableOpacity
            style={styles.listkinerjaButton}
            onPress={() => navigation.navigate('AddUraian')}>
            <Ionicons name="add" size={15} color="white" />
            <Text style={styles.buttonText}>BUAT KEGIATAN</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Ionicons name='search' size={20} color='#888' style={styles.searchIcon} />
          </View>
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameCell]}>
          Uraian Kegiatan
        </Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item}) => {
    if (!item || !item.id) {
      return null; // Skip rendering invalid items
    }
    
    const isExpanded = expandedId === item.id;
    const isChecked = checkedItems.includes(item.id);
    const isDisabled = disabledItems.includes(item.id);

    return (
      <View>
        {/* Compact View */}
        <View style={styles.tableRow}>
          <TouchableOpacity
            style={styles.rowHeader}
            onPress={() => toggleExpand(item.id)}>
            <Text style={[styles.tableCell, styles.nameCell]}>
              {item.nm_uraian || "-"}
            </Text>
            <View style={styles.expandIconCell}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Expanded View */}
        {isExpanded && (
          <View style={styles.expandedRow}>
            <View style={styles.splitContainer}>
              <View style={styles.leftColumn}>
                <Text style={[styles.expandedText, styles.customFont]}>
                  AK: <Text style={styles.expandedTextDetail}> {item.angka_kredit || '-'}</Text>
                </Text>
                <Text style={styles.expandedText}>
                  Biaya: <Text style={styles.expandedTextDetail}>{item.biaya || '-'}</Text>
                </Text>
                <Text style={styles.expandedText}>
                  WPT: <Text style={styles.expandedTextDetail}> {item.wpt || '-'}</Text>
                </Text>
              </View>

              <View style={styles.rightColumn}>
                <Text style={styles.expandedText}>
                  Satuan: <Text style={styles.expandedTextDetail}>{item.satuan || '-'}</Text>
                </Text>
                <Text style={styles.expandedText}>
                  Jenis Uraian:
                </Text>
                <View style={styles.statusSection}>
                  {item.type_tugas === "Mandiri" ? (
                    <View style={styles.statusBadgeSuccess}>
                      <Text style={styles.statusTextSuccess}>Mandiri</Text>
                    </View>
                  ) : item.type_tugas === "Tambahan" ? (
                    <View style={styles.statusBadgeDanger}>
                      <Text style={styles.statusTextDanger}>Tambahan</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.actionContainer}>
                <Checkbox
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxToggle(item)}
                  disabled={isDisabled}
                />          
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderPagination = () => (
    <View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === lastPage && styles.disabledButton,
            ]}
            disabled={currentPage === lastPage}
            onPress={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RealisasiKinerja')} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>
      
      <View>
        <Text style={[styles.customFont, styles.headerTitle]}>Tugas Tambahan</Text>      
      </View>

      <FlatList
        scrollEnabled={false}
        ListHeaderComponent={TableHeader}
        data={searchQuery ? filteredData : data}
        renderItem={renderItem}
        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.card}
        ListFooterComponent={renderPagination}
        ListEmptyComponent={
          !loading && (
            <Text style={[styles.customFont, styles.emptyText]}>
              Tidak ada data yang tersedia
            </Text>
          )
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  buttonRightContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
  },
  listkinerjaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#1bc5bd',
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: -10, 
    color: '#000',
  },
  searchIcon: {
    position: 'absolute',
    left: 120, 
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
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
    padding: 10,
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
    flex: 1,
    textAlign: 'center',
  },
  nameCell: {
    flex: 3,
    overflow: 'hidden', // Untuk menjaga tampilan saat teks panjang
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
  splitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 10,
  },
  expandedRow: {
    padding: 15,
    backgroundColor: '#F0F0',
  },
  expandedText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#555',
    marginTop: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#718096',
  },
  input: {
    width: 50,
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 15,
    color: '#2D3748',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#718096',
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 14,
    color: '#2D3748',
  },
  inputSuffix: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#718096',
  },
  inputSuffixBiaya: {
    marginRight: -15,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#718096',
  },
  arrowButton: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '2D3748',
    marginHorizontal: 0.5,
  },
  arrowText: {
    color: '#718096',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 4,
  },
  filetext: {
    flexDirection: 'row',
  },
  tatusSection: {
    marginVertical: 16,
  },
  statusBadgeDanger: {
    backgroundColor: '#fad1df',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeSuccess: {
    backgroundColor: '#c9f7f5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    marginTop: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  statusTextSuccess: {
    color: '#22c7bf',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextDanger: {
    color: '#ff0004',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 10,
  },
  displayContainer: {
    width: 150,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    marginRight: 10,
  },
  displayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    marginTop: -10,
    textAlign: 'left',
    color: 'black',
  },
  dropdown: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItem: {
    padding: 10,
    fontSize: 15,
    color: '#333',
  },
  tambahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tambahButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    width: 90,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#28c4ac', // Sama dengan warna tombol tambah
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 200,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f64e60',
    margin: 5,
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
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    width: 230,
    paddingVertical: 12,
    marginBottom: 5, // Beri jarak antar tombol
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#3699ff',
  },
  modalButtonDelete: {
    backgroundColor: '#f64e60',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MasterKinerjaRealisasi;
