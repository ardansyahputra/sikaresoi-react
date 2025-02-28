import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import GetAktifCard from './GetAktif';
import KirimKontrak from './KirimKontrak';
import axios from 'axios';
import { toastConfig, Toast } from '../../../src/utils/CustomToast';
import SkpStatus from './SkpStatus';

const KontrakKinerjaScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [userJabatanData, setUserJabatanData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [skpStatus, setSkpStatus] = useState(null);
  const showToast = (type, text1, text2) => {
      Toast.show({
        type,
        text1,
        text2,
      });
    };

  const apiClient = useApiClient();

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
    fetchYears();
    fetchUserJabatanData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchKontrak(currentPage, selectedYear, selectedDisplay);
    }
  }, [currentPage, selectedYear, selectedDisplay]);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
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
      const response = await apiClient.get('tahun/show');
      if (response?.data?.data) {
        const years = response.data.data.map(year => ({
          label: year.tahun.toString(),
          value: year.id,
        }));
        setYearOptions(years);

        // Set default year to the current year
        const currentYear = new Date().getFullYear();
        const defaultYear = years.find(
          year => year.label === currentYear.toString(),
        );
        setSelectedYear(defaultYear ? defaultYear.value : years[0]?.value);
      } else {
        console.error('Failed to load year options:', response);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKontrak = async (page, year) => {
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
        let totalBobot = 0;
        let totalWpt = 0;
        response.data.data.forEach(item => {
          if (item.bobot != null) {
            totalBobot += item.bobot;
          }
          totalWpt += item.wpt;
        });
        setTotalBobot(totalBobot);
        setTotalWpt(totalWpt);

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

  const onSaveKinerja = async updatedItem => {
    try {
      const payload = {
        kinerja: kinerja,
        list: {
          id: updatedItem.id,
          uraian_id: updatedItem.uraian.id,
          angka: updatedItem.angka || 0,
          kuantitas: updatedItem.kuantitas || 0,
          kualitas: updatedItem.kualitas || 0,
          waktu: updatedItem.waktu || 0,
          bobot: updatedItem.bobot || 0,
          wpt: updatedItem.wpt || 0,
          tgs_tambahan: updatedItem.tgs_tambahan || 0,
          uraian_point: updatedItem.uraian_point || 0,
          target_point: updatedItem.target_point || 0,
        },
      };
      console.log('Payload:', JSON.stringify(payload, null, 2)); // Debugging payload sebelum dikirim
      const response = await apiClient.post('user/kinerja/list/save', payload);
      console.log('Response:', response.data);
      fetchKontrak(currentPage, selectedYear, selectedDisplay); // Refresh data setelah menyimpan
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal menyimpan data.',
      );
    }
  };

  const handleDelete = async uuid => {
    setModalVisible(false);
    try {
      await apiClient.delete(`user/kinerja/list/${uuid}/delete`, {});
      Alert.alert('Sukses', 'Data berhasil dihapus.');
      fetchKontrak(currentPage, selectedYear, selectedDisplay) // Refresh data setelah penghapusan
    } catch (error) {
      console.error(
        'Error deleting data',
        error.response?.data || error.message,
      );
      Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus data.');
    }
  };

  const handleKumulatif = (item) => {
    navigation.navigate('Kumulatif', { item });
  };

  const confirmDelete = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const Footer = ({ kinerja, userJabatanData }) => (
    <View style={styles.footer}>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Total WPT Jenis Kegiatan Tupoksi = {totalWpt} Jam (xx %){'\n'}
          <Text>Total Bobot = {totalBobot} %</Text>
        </Text>
        <View style={styles.footerContainer2}>
          {/* Include the KirimKontrak component here */}
          <KirimKontrak kinerja={kinerja} dataAktif={userJabatanData} />
        </View>
      </View>
    </View>
  );

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
        </View>

        {/*Button Kinerja */}
        <View style={styles.buttonRightContainer}>
          <TouchableOpacity
            style={styles.listkinerjaButton}
            onPress={() => navigation.navigate('MasterKinerja')}>
            <FontAwesome name="plus" size={15} color="white" />
            <Text style={styles.buttonText}>LIST KINERJA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.salinkontrakButton}
            onPress={() => navigation.navigate('SalinKontrak')}>
            <FontAwesome name="copy" size={15} color="white" />
            <Text style={styles.buttonText}>SALIN KONTRAK</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]} align="center">
          Nomor
        </Text>
        <Text style={[styles.headerCell, styles.nameCell]}>
          Indikator Kinerja
        </Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    return (
      <View>
        {/* Tampilan Ringkas */}
        <View style={styles.tableRow}>
          <TouchableOpacity
            style={styles.rowHeader}
            onPress={() => toggleExpand(item.id)}>
            <Text style={[styles.tableCell, styles.numberCell]}>
              {index + 1}
            </Text>
            <Text style={[styles.tableCell, styles.nameCell]}>
              {item.uraian.nm_uraian || '-'}
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
              {/* Kolom kiri */}
              <View style={styles.leftColumn}>
                <Text style={styles.expandedText}>Biaya: </Text>
                <View style={styles.inputWrapper} pointerEvents='none'>
                  <Text style={styles.inputSuffixBiaya}>Rp.</Text>
                  <TextInput 
                    style={styles.input}
                    value= {item.uraian.biaya.toString()}
                  />  
                </View>

                <Text style={styles.expandedText}>AK: </Text>
                <View style={styles.inputWrapper} pointerEvents='none'>
                  <TextInput 
                    style={styles.input}
                    value= {item.uraian.angka_kredit.toString()}
                  />  
                </View>
              </View>
              <View style={styles.rightColumn}>
              <Text style={styles.expandedText}>Waktu: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.waktu?.toString()}
                    onChangeText={value => {
                      const updatedItem = {...item, waktu: value};
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
                    onChangeText={value => {
                      const updatedItem = {...item, wpt: value};
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>
            
            <Text style={styles.expandedText}>Kuantitas: </Text>
                <View style={styles.inputWrapper}>
                  {/* Input Angka */}
                  <TextInput
                    style={styles.input}
                    value={item.kuantitas?.toString()}
                    onChangeText={value => {
                      const numericValue = parseInt(value) || 1; // Pastikan minimal 1
                      const updatedItem = {...item, kuantitas: numericValue};
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
                        const updatedItem = {
                          ...item,
                          kuantitas: Number(item.kuantitas) - 1,
                        };
                        onSaveKinerja(updatedItem);
                      }
                    }}>
                    <Text style={styles.arrowText}>-</Text>
                  </TouchableOpacity>
                  {/* Tombol Increment */}
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      const updatedItem = {
                        ...item,
                        kuantitas: Number(item.kuantitas) + 1,
                      };
                      onSaveKinerja(updatedItem);
                    }}>
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
                    onChangeText={value => {
                      const numericValue = parseInt(value) || 1; // Pastikan minimal 1
                      const updatedItem = {...item, kualitas: numericValue};
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
                        const updatedItem = {
                          ...item,
                          kualitas: Number(item.kualitas) - 1,
                        };
                        onSaveKinerja(updatedItem);
                      }
                    }}>
                    <Text style={styles.arrowText}>-</Text>
                  </TouchableOpacity>
                  {/* Tombol Increment */}
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      const updatedItem = {
                        ...item,
                        kualitas: Number(item.kualitas) + 1,
                      };
                      onSaveKinerja(updatedItem);
                    }}>
                    <Text style={styles.arrowText}>+</Text>
                  </TouchableOpacity>

                  {/* Satuan */}
                  <Text style={styles.inputSuffix}> %</Text>
                </View>
                {item.kualitas <= 0 && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )}

            <View style={styles.splitContainer}>
              <View style={styles.leftColumn2}>
              <Text style={styles.expandedText}>Bobot: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.bobot?.toString()}
                    onChangeText={value => {
                      const updatedItem = {...item, bobot: value};
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

              </View>
              {/* Kolom kanan */}
              <View style={styles.rightColumn2}>
                <Text style={styles.expandedText}>Status: </Text>
                <View style={styles.statusSection}>
                  {item.kuantitas <= 0 ||
                  item.kualitas <= 0 ||
                  item.waktu <= 0 ||
                  item.bobot <= 0
                  ? (
                    <View style={styles.statusBadgeDanger}>
                      <Ionicons name="alert-circle" size={16} color="white" />
                      <Text style={styles.statusText}> LENGKAPI DATA</Text>
                    </View>
                  ) : item.total_target === null ? (
                    <View style={styles.statusBadgeWarning}>
                      <Ionicons name="time" size={16} color="white" />
                      <Text style={styles.statusText}> BELUM BREAKDOWN</Text>
                    </View>
                  ) : (
                    <View style={styles.statusBadgeSuccess}>
                      <Ionicons name="checkmark-circle" size={16} color="white" />
                      <Text style={styles.statusText}> LENGKAP</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  if (
                    item.kuantitas <= 0 ||
                    item.kualitas <= 0 ||
                    item.waktu <= 0 ||
                    item.bobot <= 0
                  ) {
                    showToast('error', 'Peringatan', 'Mohon isi data yang kosong atau NOL (0)');
                  } else {
                    handleKumulatif(item);
                  }
                }}>
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
        <TouchableOpacity onPress={() => navigation.navigate('DASHBOARD')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Kontrak Kinerja</Text>
        </View>
      </View>
      
      <SkpStatus alert={kinerja.alert} />
      {userJabatanData && <GetAktifCard data={userJabatanData} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Peringatan </Text>
            <Ionicons name="alert-circle-outline" size={100} color="#ffab09" />
            <Text style={styles.modalText}>
              Apakah Anda yakin ingin menghapus data ini?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={() => handleDelete(selectedItem.uuid)}>
                <Text style={styles.modalButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <FlatList
  scrollEnabled={false}
  ListHeaderComponent={TableHeader}
  data={data}
  renderItem={renderItem}
  keyExtractor={item => item.id.toString()}
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
      <Footer kinerja={kinerja} dataAktif={userJabatanData} />
    </View>
  }
/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  footerContainer: {
    width: '60%',
  },
  footerContainer2: {
    marginVertical: 10,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    textAlign: 'left',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
    padding: 0,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingRight: 18,
    paddingLeft: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: '#000',
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: '#000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 15,
    margin: 0,
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
    padding: 10,
  },
  listkinerjaButton: {
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
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
  },
  headerCell: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
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
  leftColumn2: {
    flex: 1,
    marginRight: 10,
    marginTop: 5,
  },
  rightColumn2: {
    flex: 1,
    marginLeft: 10,
    marginTop: 5,
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
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeWarning: {
    backgroundColor: '#ffa800',
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
  modalActions: {
    flexDirection: 'column',
    textAlignVertical: 'top',
  },
  modalButton: {
    flex: 1,
    maxWidth: 10,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 120,
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
    alignItems: 'center',
    backgroundColor: '#3699FF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 1,
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
    borderRadius: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  customFont: {
    color: 'white',
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

export default KontrakKinerjaScreen;
