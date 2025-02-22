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
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Checkbox} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import axios from 'axios';

const MasterKinerja = ({navigation}) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [userJabatanData, setUserJabatanData] = useState(null);
  const [userJabatanId, setUserJabatanId] = useState(null);
  const [kinerjaId, setKinerjaId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tgsTambahan, setTgsTambahan] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [disabledItems, setDisabledItems] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  
  const apiClient = useApiClient();

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchListUraian(query, currentPage, selectedDisplay);
  };

  const parseCheckbox = (checkbox) => {
    const isChecked = checkbox.includes('checked="checked"');
    const isDisabled = checkbox.includes('disabled="disabled"');
    return { isChecked, isDisabled };
  };

  const [kinerja, setKinerja] = useState({
    totalak: 0,
    totalwpt: 0,
    totalbobot: 0,
    tahun_id: null,
    user_jabatan_id: null,
    alert: {
      show: false,
    },
  });
  const [listKinerja, setListKinerja] = useState([]);
  const [totalBobot, setTotalBobot] = useState(0);
  const [totalWpt, setTotalWpt] = useState(0);

 

  useEffect(() => {
    fetchUserJabatanData();
    fetchKinerja();
    fetchYears();
    fetchListUraian(currentPage, selectedDisplay, selectedYear);
  }, [currentPage, selectedDisplay, selectedYear]);

  useEffect(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.nm_uraian?.toLowerCase().includes(lowerCaseQuery) ||
          item.nm_satuan?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }, [searchQuery, data]);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      console.log('Jabatan Id:', response.data.data.jabatan_id);
      if (response?.data?.data) {
        setUserJabatanData(response.data.data);
        setUserJabatanId(response.data.data.jabatan_id);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
    }
  };

  const fetchKinerja = async (page, year) => {
    try {
      setLoading(true);
      const response = await apiClient.post('user/kinerja/list/index', {
        page,
        tahun_id: year,
      });
      if (response?.data) {
        setData(response.data.data);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        
        setKinerjaId(response.data.data.kinerja)
        setKinerja(response.data.kinerja || {
          totalak: 0,
          totalwpt: 0,
          totalbobot: 0,
          tahun_id: year,
          user_jabatan_id: userJabatanData?.id,
          alert: {
            show: false,
          },
        });
        setListKinerja(response.data.data);

        // Calculate totalBobot and totalWpt
        console.log('Data fetched:', response.data);
      } else {
        console.error('Invalid data:', response);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error)) {
        console.log(error.toJSON());
      }
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get('tahun/show');
          if (response?.data?.data) {
            const years = response.data.data.map(year => ({
              label: year.tahun.toString(),
              value: year.id,
            }));
    
            // Set default year to the current year
            const currentYear = new Date().getFullYear();
            const defaultYear = years.find(
              year => year.label === currentYear.toString(),
            );
            setSelectedYear(defaultYear ? defaultYear.value : years[0]?.value);
          } else {
            console.error('Failed to load year options:', response);
            Alert.alert('Error', 'Gagal memuat data tahun.');
          }
        } catch (error) {
          console.error('Error fetching years:', error);
          Alert.alert('Error', 'Gagal memuat data tahun.');
        } finally {
          setLoading(false);
        }
      };

  const fetchListUraian = async (page) => {
    try {
      setLoading(true);
      const response = await apiClient.post('uraian/indexAndro_user', {
        page,
        per: selectedDisplay,
        jabatan_id: userJabatanId || null,
        kinerja_id: kinerjaId || null,
        tgs_tambahan: tgsTambahan,
        search: searchQuery,
      });

      if (response?.data?.data) {
        const fetchedData = response.data.data;
        const checkedIds = [];
        const disabledIds = [];

        fetchedData.forEach((item) => {
          const { isChecked, isDisabled } = parseCheckbox(item.checkbox);
          if (isChecked) {
            checkedIds.push(item.id);
          }
          if (isDisabled) {
            disabledIds.push(item.id);
          }
        });

        setCheckedItems(checkedIds);
        setDisabledItems(disabledIds);
        setData(fetchedData);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      } else {
        console.error('Invalid data:', response);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxToggle = async (item) => {
    if (disabledItems.includes(item.checkbox)) {
      return; // Do nothing if the checkbox is disabled
    }

    const isChecked = checkedItems.includes(item.checkbox);
    if (isChecked) {
      setCheckedItems(checkedItems.filter((id) => id !== item.checkbox));
    } else {
      setCheckedItems([...checkedItems, item.checkbox]);
    }
    await saveListKinerja(item);
  };

  const saveListKinerja = async (item) => {
    try {
    
  
      // Construct the payload
      const payload = {
        kinerja: { // Use the kinerjaId from state
          uuid: item.uuid, // Generate or fetch this if needed
          user_jabatan_id: userJabatanData?.id, // Use the userJabatanData from state
          tahun_id: selectedYear, // Use the selectedYear from state
          status: 0, // Default status
        },
        list: {
          id: item.id || null, // Use the item's ID if available
          uraian_id: item.uraian?.id || item.id, // Use uraian.id or fallback to item.id
          kuantitas: item.kuantitas || 0,
          kualitas: item.kualitas || 0,
          waktu: item.waktu || 0,
          bobot: item.bobot || 0,
          wpt: item.wpt || 0,
          tgs_tambahan: item.tgs_tambahan || false,
          target_point: item.target_point || 0,
          uraian_point: item.uraian_point || 0,
        },
      };
  
      console.log('Payload:', JSON.stringify(payload, null, 2)); // Debugging: Log the payload
  
      // Send the payload to the API
      const response = await apiClient.post('user/kinerja/list/save', payload);
      console.log('Response:', response.data);
      fetchListUraian();
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal menyimpan data.',
      );
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

        {/*Button Kinerja */}
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
    const isExpanded = expandedId === item.id;

    return (
      <View>
        {/* Tampilan Ringkas */}
        <View style={styles.tableRow}>
          <TouchableOpacity
            style={styles.rowHeader}
            onPress={() => toggleExpand(item.id)}>
            <Text style={[styles.tableCell, styles.nameCell]}>
              {item.nm_uraian || "-" }
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

        {/* Tampilan Penuh */}
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
                {item.type_tugas = "Mandiri"
                ? (
                  <View style={styles.statusBadgeSuccess}>
                    <Text style={styles.statusTextSuccess}>Mandiri </Text>
                  </View>
                  ) : item.type_tugas = "Tambahan" ?(
                  <View style={styles.statusBadgeDanger}>
                  <Text style={styles.statusTextDanger}>Tambahan </Text>
                  </View>
                  ): null}
                </View>
              </View>
              <View style={styles.actionContainer}>
              <Checkbox
                status={checkedItems.includes(item.checkbox) ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxToggle(item)}
                disabled={disabledItems.includes(item.checkbox)}
              />          
            </View>
            </View>

           
          </View>
        )}
        
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('KontrakKinerja')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>
      <View>
        <Text style={[styles.customFont, styles.headerTitle]}>List Indikator</Text>              
      </View>


        <FlatList
          scrollEnabled={false}
          ListHeaderComponent={TableHeader}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.card}
          ListFooterComponent={
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
                    onPress={() =>
                      setCurrentPage(prev => Math.min(prev + 1, lastPage))
                    }
                    >
                    <Text style={styles.pageButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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

export default MasterKinerja;
