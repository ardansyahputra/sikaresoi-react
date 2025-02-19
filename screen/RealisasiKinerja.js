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
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import GetAktifCard from './GetAktif';

const KontrakKinerjaScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [userJabatanData, setUserJabatanData] = useState(null);

  const apiClient = useApiClient();

  useEffect(() => {
    fetchYears();
    fetchMonths();
    fetchUserJabatanData();
  }, []);


  useEffect(() => {
    if (selectedYear, selectedMonth) {
      fetchData(currentPage, selectedYear, selectedMonth, selectedDisplay);
    }
  }, [currentPage, selectedYear, selectedMonth, selectedDisplay]);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('/user/jabatan/aktif');
      if (response?.data?.data) {
        setUserJabatanData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
    }
  };

  const fetchYears = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/tahun/show');
      if (response?.data?.data) {
        const years = response.data.data.map(year => ({
          label: year.tahun.toString(),
          value: year.id,
        }));
        setYearOptions(years);

        // Set default year to the current year
        const currentYear = new Date().getFullYear();
        const defaultYear = years.find(year => year.label === currentYear.toString());
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

  const fetchMonths = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/bulan/show');
      if (response?.data?.data) {
        const years = response.data.data.map(year => ({
          label: month.bulan.toString(),
          value: month.id,
        }));
        setYearOptions(years);

        // Set default year to the current year
        const currentMonth = new Date().getFullMonth();
        const defaultMonth = months.find(month => month.label === currentMonth.toString());
        setSelectedYear(defaultMonth ? defaultMonth.value : years[0]?.value);
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

  const fetchData = async (page, year, month) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/user/kinerja/list/index', {
        page,
        tahun_id: year,
        bulan_id: month,
      });
      if (response?.data?.data) {
        setData(response.data.data || []);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        console.log('Data fetched:', response.data);
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

  const onSaveKinerja = async (updatedItem) => {
    console.log('Updated Item:', updatedItem);
    try {
        const payload = {
            kinerja: {
                // Add the required fields for `kinerja`
                id: updatedItem.id,
                user_jabatan_id: updatedItem.user_jabatan_id,
                tahun_id: updatedItem.tahun_id || 0,
                tgs_tambahan: updatedItem.tgs_tambahan || 0, // Include `tgs_tambahan` with a default value
            },
            list: [updatedItem],
        };
        console.log('Payload:', payload); // Log the payload
        const response = await apiClient.post('/user/kinerja/list/save', payload);

        if (response?.data?.data) {
            Alert.alert('Sukses', 'Data kinerja berhasil diperbarui.');
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === updatedItem.id ? { ...item, ...updatedItem } : item
                )
            );
        } else {
            Alert.alert('Gagal', 'Terjadi kesalahan saat memperbarui data.');
        }
    } catch (error) {
        console.error('Error updating kinerja:', error);
        console.error('Response data:', error.response?.data); // Log the response data
        Alert.alert('Error', 'Gagal menyimpan perubahan.');
    }
};
  
  const onDeleteKinerja = async (uuid) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus data ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: async () => {
            try {
              const response = await apiClient.delete(`/user/kinerja/list/${uuid}/delete`);
              if (response?.data?.data) {
                Alert.alert('Sukses', 'Data berhasil dihapus.');
                setData((prevData) => prevData.filter((item) => item.id !== uuid));
              } else {
                Alert.alert('Gagal', 'Gagal menghapus data.');
              }
            } catch (error) {
              console.error('Error deleting kinerja:', error);
              Alert.alert('Error', 'Terjadi kesalahan saat menghapus data.');
            }
          },
        },
      ]
    );
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

  const TableHeader = () => (
    <View>
      <View style={styles.filterContainer}>
        {/* Tahun Selector */}
        <View style={styles.displayContainer}>
          <Dropdown
            style={styles.dropdown}
            data={yearOptions}
            labelField="label"
            valueField="value"
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={monthOptions}
            labelField="label"
            valueField="value"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
          />
        </View>

        {/*Button Kinerja */}
        <View style={styles.buttonRightContainer}>
          <TouchableOpacity style={styles.listkinerjaButton} onPress={() => navigation.navigate(IndikatorKinerja)}>
            <FontAwesome name="plus" size={15} color="white" />
            <Text style={styles.buttonText}>LIST KINERJA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.salinkontrakButton}>
            <FontAwesome name="copy" size={15} color="white" />
            <Text style={styles.buttonText}>SALIN KONTRAK</Text>
          </TouchableOpacity>
        </View>

      </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.numberCell]} align="center">Nomor</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Indikator Kinerja</Text>
          <View style={styles.expandIconCell} />
        </View>
    </View>
  );

  

  const renderItem = ({ item, index }) => {
    const isExpanded = expandedId === item.id;
  
    return (
      <View>
        {/* Tampilan Ringkas */}
        <View style={styles.tableRow}>
          <TouchableOpacity style={styles.rowHeader}
            onPress={() => toggleExpand(item.id)}>
            <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.nameCell]}>{item.uraian.nm_uraian || '-'}</Text>
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
              {/* Kolom kiri */}
              <View style={styles.leftColumn}>
                <Text style={styles.expandedText}>Biaya: </Text>
                <Text style={styles.expandedTextDetail}>Rp {item.uraian.biaya}</Text>
                
                <Text style={styles.expandedText}>AK: </Text>
                <Text style={styles.expandedTextDetail}>{item.uraian.angka_kredit}</Text>

                <Text style={styles.expandedText}>Kuantitas: </Text>
                <View style={styles.inputWrapper}>
                  {/* Input Angka */}
                  <TextInput
                    style={styles.input}
                    value={item.kuantitas?.toString()}
                    onChangeText={(value) => {
                      const numericValue = parseInt(value) || 1; // Pastikan minimal 1
                      const updatedItem = { ...item, kuantitas: numericValue };
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                  {/* Tombol Decrement */}
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      if (item.kuantitas > 1) {
                        const updatedItem = { ...item, kuantitas: item.kuantitas - 1 };
                        onSaveKinerja(updatedItem);
                      }
                    }}
                  >
                    <Text style={styles.arrowText}>-</Text>
                  </TouchableOpacity>
                  {/* Tombol Increment */}
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      const updatedItem = { ...item, kuantitas: item.kuantitas + 1 };
                      onSaveKinerja(updatedItem);
                    }}
                  >
                    <Text style={styles.arrowText}>+</Text>
                  </TouchableOpacity>

                  {/* Satuan */}
                  <Text style={styles.inputSuffix}>{item.uraian?.satuan}</Text>
                </View>
                {item.kuantitas <= 0 && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )} 

                <Text style={styles.expandedText}>Kualitas: </Text>
                <View style={styles.inputWrapper}>
                  {/* Input Angka */}
                  <TextInput
                    style={styles.input}
                    value={item.kualitas?.toString()}
                    onChangeText={(value) => {
                      const numericValue = parseInt(value) || 1; // Pastikan minimal 1
                      const updatedItem = { ...item, kualitas: numericValue };
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                  {/* Tombol Decrement */}
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      if (item.kuantitas > 1) {
                        const updatedItem = { ...item, kualitas: item.kualitas - 1 };
                        onSaveKinerja(updatedItem);
                      }
                    }}
                  >
                    <Text style={styles.arrowText}>-</Text>
                  </TouchableOpacity>
                  {/* Tombol Increment */}
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      const updatedItem = { ...item, kualitas: item.kualitas + 1 };
                      onSaveKinerja(updatedItem);
                    }}
                  >
                    <Text style={styles.arrowText}>+</Text>
                  </TouchableOpacity>

                  {/* Satuan */}
                  <Text style={styles.inputSuffix}>           %</Text>
                </View>
                {item.kualitas <= 0 && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )}              
              </View>

              {/* Kolom kanan */}
              <View style={styles.rightColumn}>
                <Text style={styles.expandedText}>Waktu: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.waktu?.toString()}
                    onChangeText={(value) => {
                      const updatedItem = { ...item, waktu: value };
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.inputSuffix}>BULAN</Text>
                </View>
                {item.waktu <= 0 && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )}              

                <Text style={styles.expandedText}>WPT: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.wpt?.toString()}
                    onChangeText={(value) => {
                      const updatedItem = { ...item, wpt: value };
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                </View>     

                <Text style={styles.expandedText}>Bobot: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.bobot?.toString()}
                    onChangeText={(value) => {
                      const updatedItem = { ...item, bobot: value };
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                </View>
                {item.bobot <= 0 && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )}              

                <Text style={styles.expandedText}>Status: </Text>
                <View style={styles.statusSection}>
                {item.kuantitas <= 0 || item.kualitas <= 0 || item.waktu <= 0 || item.bobot <= 0 || item.wpt <= 0 ? (
                  <View style={styles.statusBadgeDanger}>
                    <Ionicons name="alert" size={16} color="white" />
                    <Text style={styles.statusText}>LENGKAPI DATA</Text>
                  </View>
                  ) : item.total_target === null ? (
                  <View style={styles.statusBadgeWarning}>
                    <Ionicons name="clock-alert" size={16} color="white" />
                    <Text style={styles.statusText}>BELUM BREAKDOWN</Text>
                  </View>
                  ) : (
                  <View style={styles.statusBadgeSuccess}>
                    <Ionicons name="check-circle" size={16} color="white" />
                    <Text style={styles.statusText}>LENGKAP</Text>
                  </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEdit(item)}>
                <Ionicons name="create" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item)}>
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>              
            </View>
          </View>
        )}
      </View>
    );
  };
 


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/sikaresoi.png')}
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
      <View>
        <Text style={styles.headerTitle}>Kontrak Kinerja</Text>
        <Text style={styles.headerSubtitle}>User • Kontrak Kinerja</Text>
      </View>

      {userJabatanData && <GetAktifCard data={userJabatanData} />}

      {/* Loading Indicator */}
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
      <IndikatorKinerja />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
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
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
    marginBottom: 4, 
    marginTop: 10,
  },
  headerSubtitle: {
    color: "#000",
    marginLeft: 20,
    marginBottom: 4,
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
  salinkontrakButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 8, 
    backgroundColor: '#3699ff', 
    borderRadius: 5,
    marginRight: 5,
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
    fontSize: 14,
    color: '#555',
    marginTop: 7,
  },
  expandedTextDetail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555', // Warna teks detail
    marginBottom: 5,
  },
  expandedLinkText: {
    color: 'blue',
    marginBottom: 5,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  arrowButton: {
    backgroundColor: '#e2e8f0',
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
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeWarning: {
    backgroundColor: '#D69E2E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeSuccess: {
    backgroundColor: '#38A169',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    width: 80,
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
});

export default KontrakKinerjaScreen;
