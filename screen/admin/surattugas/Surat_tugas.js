import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
import Header from '../../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Toast from 'react-native-toast-message';

export default function Surat_tugas() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isTambahModalVisible, setTambahModalVisible] = useState(false);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [switchStates, setSwitchStates] = useState({});



  const [selectedGolongan, setSelectedGolongan] = useState('');
  const [selectedNominal, setSelectedNominal] = useState('');

  const apiClient = useApiClient();

  useEffect(() => {
    fetchData(currentPage, selectedDisplay, 1);
  }, [currentPage, selectedDisplay]);

  const handleSwitchToggle = async (uuid, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const payload = { terlampir: newStatus.toString() };
  
    console.log(`UUID: ${uuid}, Status Baru: ${newStatus}`);
  
    // Update state lokal terlebih dahulu untuk respons yang lebih cepat
    setSwitchStates(prevState => ({
      ...prevState,
      [uuid]: newStatus,
    }));
  
    try {
      const response = await apiClient.post(
        `/surat-tugas/${uuid}/updateconfirmed`,
        payload
      );
  
      console.log("Response dari server:", response.data);
  
      // Pastikan respons sukses sebelum mempertahankan perubahan
      if (!response.data) {
        throw new Error("Gagal memperbarui status di server");
      }
    } catch (error) {
      console.error("Error:", error.message);
  
      // Jika gagal, kembalikan ke status sebelumnya
      setSwitchStates(prevState => ({
        ...prevState,
        [uuid]: currentStatus,
      }));
    }
  };
  

  const fetchData = async (page, display) => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.post('/surat-tugas/table', {
        page,
        display,
      });
  
      console.log('Surat Tugas Data:', response.data);
  
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleEdit = async (uuid, navigation) => {
    navigation.navigate('EditSuratTugas',{uuid});
  };

  const handleCreate = async (navigation) => {
   navigation.navigate('TambahSuratTugas');
  };

  const handleHapusPress = uuid => {
    setSelectedUuid(uuid);
    setSelectedAction('hapus'); // Tandai bahwa ini aksi hapus
    setModalVisible(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUuid) return;

    setModalVisible(false); // Tutup modal sebelum aksi dijalankan

    try {
      await apiClient.delete(`/pemotongan_pulang_awal/${selectedUuid}/delete`);
      fetchData(currentPage);
      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Data berhasil dihapus.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal menghapus data.',
      });
    }
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
      <View style={styles.headerContainer}>
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
        <TouchableOpacity
          style={styles.tambahButton}
          onPress={() => handleCreate(navigation, '10%', '18:00', '08:00')}>
          <Ionicons name="add" size={18} color="#fff" style={styles.icon} />
          <Text style={[GlobalStyle.SemiBold, styles.tambahText]}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          {String('NO')}
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          {String('NO SKP')}
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          {String('Tanggal SKP')}
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          {String('Lampiran')}
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
              {item.nomor || '-'}
            </Text>
            <Text
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}>
              {item.tgl_spt || '-'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>{isEnabled ? '' : ''}</Text>
      <Switch
        value={switchStates[item.uuid] !== undefined ? switchStates[item.uuid] === 1 : item.switch === 1}
        onValueChange={() => handleSwitchToggle(item.uuid, switchStates[item.uuid] !== undefined ? switchStates[item.uuid] : item.switch)}
        trackColor={{ false: '#d3d3d3', true: '#add8e6' }}
        thumbColor={switchStates[item.uuid] === 1 ? '#ffffff' : '#f4f4f4'}
      />
    </View>
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
                Dasar: {item.dasar || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Tahun: {item.tahun || '-'}
              </Text>
               <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                status: {item.status || '-'}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.iconButton, styles.blueButton]}
                  onPress={() => handleEdit(item.uuid, navigation)}>
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
      {/* Header */}
      <Header title="Surat Tugas" />
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
    textAlign: 'center',
    flex: 0,
    paddingLeft: 0,
  },
  numberCell: {
    width: 45,
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
    paddingVertical: 10,
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

  tambahButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3699FE',
    paddingHorizontal: 15,
    height: 40, // **Samakan tinggi dengan search bar**
    borderRadius: 5,
    marginLeft: 12,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
});