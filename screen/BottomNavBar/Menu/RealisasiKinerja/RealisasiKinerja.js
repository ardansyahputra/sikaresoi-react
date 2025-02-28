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
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../../src/api/apiClient';
import axios from 'axios'; // Added missing import
import GetAktifCard from '../../KontrakKinerja/GetAktif';

const RealisasiKinerja = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataUtama, setDataUtama] = useState([]);
  const [dataTambahan, setDataTambahan] = useState([]);
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
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [pimpinanId, setPimpinanId] = useState(null);
  const [bulanId, setBulanId] = useState(null);
  const [listKinerja, setListKinerja] = useState({ utama: [], tambahan: [] });
  const [totalBobot, setTotalBobot] = useState(0);
  const [totalWpt, setTotalWpt] = useState(0);

  const apiClient = useApiClient();

  const [kinerja, setKinerja] = useState({
    totalak: 0,
    totalwpt: 0,
    totalbobot: 0,
    tahun_id: null,
    bulan_id: null,
    user_jabatan_id: null,
    alert: {
      show: false,
    },
  });

  // Initial data loading
  useEffect(() => {
    fetchYears();
    fetchMonth();
    fetchUserJabatanData();
  }, []);

  // Re-fetch data when filters change
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchKontrak(currentPage, selectedYear, selectedMonth);
    }
  }, [currentPage, selectedYear, selectedMonth]);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      
      if (response?.data?.data) {
        setUserJabatanData(response.data.data);
        setPimpinanId(response.data.data.pimpinan_id);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const fetchMonth = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('bulan/show');
      if (response?.data?.data) {
        const months = response.data.data.map(month => ({
          label: month.bulan.toString(),
          value: month.id,
        }));
        setMonthOptions(months);

        // Set default month to current month or first available
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
        const defaultMonth = months.find(
          month => parseInt(month.label) === currentMonth
        );
        setSelectedMonth(defaultMonth ? defaultMonth.value : months[0]?.value);
        setBulanId(defaultMonth ? defaultMonth.value : months[0]?.value);
      } else {
        Alert.alert('Error', 'Gagal memuat data bulan.');
      }
    } catch (error) {
      console.error('Error fetching month:', error);
      Alert.alert('Error', 'Gagal memuat data bulan.');
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
        setYearOptions(years);

        // Set default year to current year or first available
        const currentYear = new Date().getFullYear();
        const defaultYear = years.find(
          year => parseInt(year.label) === currentYear
        );
        setSelectedYear(defaultYear ? defaultYear.value : years[0]?.value);
      } else {
        Alert.alert('Error', 'Gagal memuat data tahun.');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      Alert.alert('Error', 'Gagal memuat data tahun.');
    } finally {
      setLoading(false);
    }
  };

  const fetchKontrak = async (page, year, month) => {
    if (!year || !month) return;
    
    try {
      setLoading(true);
      const response = await apiClient.post('user/kinerja/list/target/realisasi/index', {
        page,
        tahun_id: year,
        bulan_id: month,
      });
  
      if (response?.data) {
        const utamaData = response.data.utama || [];
        const tambahanData = response.data.tambahan || [];
  
        // Set data for main list
        setData(utamaData);
        setCurrentPage(response.data.current_page || 1);
        setLastPage(response.data.last_page || 1);
  
        // Calculate totals
        const totalAK = utamaData.reduce((sum, item) => {
          return sum + (parseFloat(item.target?.list_kinerja?.angka_kredit) || 0);
        }, 0);
        
        const totalWPT = utamaData.reduce((sum, item) => {
          return sum + (parseFloat(item.target?.list_kinerja?.wpt) || 0);
        }, 0);
        
        const totalBobot = utamaData.reduce((sum, item) => {
          return sum + (parseFloat(item.target?.list_kinerja?.bobot) || 0);
        }, 0);
        
        // Update kinerja state with calculated totals
        setKinerja({
          totalak: totalAK,
          totalwpt: totalWPT,
          totalbobot: totalBobot,
          tahun_id: year,
          bulan_id: month,
          user_jabatan_id: userJabatanData?.id,
          alert: {
            show: false,
          },
        });
  
        // Store complete data
        setListKinerja({ utama: utamaData, tambahan: tambahanData });
        setTotalBobot(totalBobot);
        setTotalWpt(totalWPT);
      } else {
        setData([]);
        setListKinerja({ utama: [], tambahan: [] });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error)) {
        console.log('Axios error details:', error.toJSON());
      }
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleTugastambahan = (userJabatanId, tahunId) => {
    navigation.navigate('MasterKinerjaRealisasi', {
      userJabatanId, 
      tahunId,
      bulanId: selectedMonth
    });
  };

  const handleEdit = (item) => {
    setShowDetail(showDetail === item.id ? null : item.id);
  };

  const onSaveKinerja = async (updatedItem) => {
    try {
      // Validate required fields
      if (updatedItem.kuantitas <= 0 || updatedItem.kualitas <= 0) {
        Alert.alert('Validasi Gagal', 'Kuantitas dan Kualitas tidak boleh 0 atau negatif');
        return;
      }

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
      
      const response = await apiClient.post('user/kinerja/list/save', payload);
      
      if (response.data.success) {
        Alert.alert('Sukses', 'Data berhasil disimpan');
        fetchKontrak(currentPage, selectedYear, selectedMonth);
      } else {
        Alert.alert('Gagal', response.data.message || 'Terjadi kesalahan saat menyimpan');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal menyimpan data.',
      );
    }
  };

  const handleDelete = async (uuid) => {
    if (!uuid) {
      Alert.alert('Error', 'ID data tidak valid');
      return;
    }
    
    setModalVisible(false);
    try {
      const response = await apiClient.delete(`user/kinerja/list/${uuid}/delete`);
      
      if (response.data.success) {
        Alert.alert('Sukses', 'Data berhasil dihapus.');
        fetchKontrak(currentPage, selectedYear, selectedMonth);
      } else {
        Alert.alert('Gagal', response.data.message || 'Terjadi kesalahan saat menghapus');
      }
    } catch (error) {
      console.error('Error deleting data', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus data.');
    }
  };

  const confirmDelete = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const TableHeader = () => (
    <View>
      <View style={styles.filterContainer}>
        {/* Tahun & Bulan Selectors */}
        <View style={styles.displayContainer}>
          <Dropdown
            style={styles.dropdown}
            data={yearOptions}
            labelField="label"
            valueField="value"
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
            placeholder="Tahun"
          />
       
          <Dropdown
            style={[styles.dropdown, {marginTop: 8}]}
            data={monthOptions}
            labelField="label"
            valueField="value"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
            placeholder="Bulan"
          />
        </View>
        
        <View style={styles.buttonRightContainer}>
          <TouchableOpacity
            style={styles.listkinerjaButton}
            onPress={() => handleTugastambahan(userJabatanData?.id, selectedYear)}>
            <FontAwesome name="plus" size={15} color="white" />
            <Text style={styles.buttonText}>TUGAS TAMBAHAN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.ubahatasanButton}>
            <FontAwesome name="copy" size={15} color="white" />
            <Text style={styles.buttonText}>UBAH ATASAN</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>Nomor</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>Uraian Kegiatan</Text>
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
              {item.target?.list_kinerja?.uraian.nm_uraian || '-'}
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
                    value={item.target?.list_kinerja?.uraian.biaya?.toString() || "0"}
                    editable={false}
                  />  
                </View>
  
                <Text style={styles.expandedText}>AK: </Text>
                <View style={styles.inputWrapper} pointerEvents='none'>
                  <TextInput 
                    style={styles.input}
                    value={item.target?.list_kinerja?.uraian.angka_kredit?.toString() || "0"}
                    editable={false}
                  />  
                </View>
  
                <Text style={styles.expandedText}>Kuantitas: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.kuantitas?.toString() || item.target?.kuantitas?.toString() || "0"}
                    onChangeText={value => {
                      const numericValue = parseInt(value) || 0;
                      const updatedItem = {...item, kuantitas: numericValue};
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      if ((item.kuantitas || 0) > 1) {
                        const updatedItem = {...item, kuantitas: (item.kuantitas || 1) - 1};
                        onSaveKinerja(updatedItem);
                      }
                    }}>
                    <Text style={styles.arrowText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => {
                      const updatedItem = {...item, kuantitas: (item.kuantitas || 0) + 1};
                      onSaveKinerja(updatedItem);
                    }}>
                    <Text style={styles.arrowText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.inputSuffix}>
                    {item.target?.list_kinerja?.uraian.satuan || ""}
                  </Text>
                </View>
                {(item.kuantitas <= 0) && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )}
  
                <Text style={styles.expandedText}>Kualitas: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.kualitas?.toString() || "0"}
                    onChangeText={value => {
                      const numericValue = parseInt(value) || 0;
                      const updatedItem = {...item, kualitas: numericValue};
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.inputSuffix}> %</Text>
                </View>
                {(item.kualitas <= 0) && (
                  <Text style={styles.errorText}>Tidak boleh 0</Text>
                )}
              </View>
  
              {/* Kolom kanan */}
              <View style={styles.rightColumn}>
                <Text style={styles.expandedText}>Waktu: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.waktu?.toString() || item.target?.list_kinerja?.waktu?.toString() || "0"}
                    onChangeText={value => {
                      const numericValue = parseInt(value) || 0;
                      const updatedItem = {...item, waktu: numericValue};
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.inputSuffix}>BULAN</Text>
                </View>
  
                <Text style={styles.expandedText}>Bobot: </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={item.bobot?.toString() || item.target?.list_kinerja?.bobot?.toString() || "0"}
                    onChangeText={value => {
                      const numericValue = parseFloat(value) || 0;
                      const updatedItem = {...item, bobot: numericValue};
                      onSaveKinerja(updatedItem);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                </View>
  
                <Text style={styles.expandedText}>Status: </Text>
                <View style={styles.statusSection}>
                  {(item.kuantitas <= 0 ||
                    item.kualitas <= 0 ||
                    item.waktu <= 0 ||
                    item.bobot <= 0) ? (
                    <View style={styles.statusBadgeDanger}>
                      <Ionicons name="alert-circle" size={16} color="white" />
                      <Text style={styles.statusText}> LENGKAPI DATA</Text>
                    </View>
                  ) : item.target?.list_kinerja?.total_target === null ? (
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
                onPress={() => handleEdit(item)}>
                <Ionicons name="checkmark-done-sharp" size={20} color="white" />
                <Text style={styles.actionButtonText}>Realisasi</Text>
              </TouchableOpacity>
            </View>
            
            {showDetail === item.id && (
              <View style={styles.detailContainer}>
                {/* First Row */}
                <View style={styles.rowContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      USULAN KUANTITAS <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputs}
                        value={item.usulanKuantitas?.toString() || "0"}
                        onChangeText={(text) => {
                          const numericValue = parseFloat(text.replace(',', '.')) || 0;
                          const updatedItem = {...item, usulanKuantitas: numericValue};
                          onSaveKinerja(updatedItem);
                        }}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity>
                        <Text style={styles.laporanLink}>Laporan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      USULAN KUALITAS <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputs}
                        value={item.usulanKualitas?.toString() || "0"}
                        onChangeText={(text) => {
                          const numericValue = parseFloat(text.replace(',', '.')) || 0;
                          const updatedItem = {...item, usulanKualitas: numericValue};
                          onSaveKinerja(updatedItem);
                        }}
                        keyboardType="numeric"
                      />
                      <Text style={styles.percentageText}>%</Text>
                    </View>
                  </View>
                </View>

                {/* Second Row */}
                <View style={styles.rowContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      PERSETUJUAN KUANTITAS <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputs}
                        value={item.persetujuanKuantitas?.toString() || "0"}
                        onChangeText={(text) => {
                          const numericValue = parseFloat(text.replace(',', '.')) || 0;
                          const updatedItem = {...item, persetujuanKuantitas: numericValue};
                          onSaveKinerja(updatedItem);
                        }}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity>
                        <Text style={styles.laporanLink}>Laporan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      PERSETUJUAN KUALITAS <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputs}
                        value={item.persetujuanKualitas?.toString() || "0"}
                        onChangeText={(text) => {
                          const numericValue = parseFloat(text.replace(',', '.')) || 0;
                          const updatedItem = {...item, persetujuanKualitas: numericValue};
                          onSaveKinerja(updatedItem);
                        }}
                        keyboardType="numeric"
                      />
                      <Text style={styles.percentageText}>%</Text>
                    </View>
                  </View>
                </View>

                {/* Dokumen Link */}
                <View style={styles.dokumenContainer}>
                  <TouchableOpacity>
                    <Text style={styles.dokumenText}>+ Dokumen</Text>
                  </TouchableOpacity>
                </View>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.saveButton} onPress={() => onSaveKinerja(item)}>
                    <Text style={styles.buttonText}>SIMPAN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/images/sikaresoi.png')}
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
        <Text style={styles.headerTitle}>Realisasi Kinerja</Text>
        <Text style={styles.headerSubtitle}>User • Kinerja • Realisasi </Text>
      </View>

      {userJabatanData && <GetAktifCard data={userJabatanData} />}
      
      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Peringatan</Text>
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
                onPress={() => handleDelete(selectedItem?.uuid)}>
                <Text style={styles.modalButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          ListHeaderComponent={TableHeader}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.card}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Tidak ada data</Text>
            </View>
          }
          ListFooterComponent={
            <View>
              {data.length > 0 && (
                <>
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
                        onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                        <Text style={styles.pageButtonText}>Previous</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.pageButton,
                          currentPage === lastPage && styles.disabledButton,
                        ]}
                        disabled={currentPage === lastPage}
                        onPress={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}>
                        <Text style={styles.pageButtonText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          }
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
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
  ubahatasanButton: {
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
    flexDirection: 'column',
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
    backgroundColor: '#1bc5bd',
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
  detailContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
  },
  inputs: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 9,
    padding: 10,
    color: '#333',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});


export default RealisasiKinerja;