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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

export default function UangMakan() {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isTambahModalVisible, setTambahModalVisible] = useState(false);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [selectedBatasAtas, setSelectedBatasAtas] = useState(new Date());
  const [selectedBatasBawah, setSelectedBatasBawah] = useState(new Date());
  const [selectedPotongan, setSelectedPotongan] = useState('');
  const [selectedUpdatedAt, setSelectedUpdatedAt] = useState('');
  const [showBatasAtas, setShowBatasAtas] = useState(false);
  const [showBatasBawah, setShowBatasBawah] = useState(false);

  const [selectedGolongan, setSelectedGolongan] = useState('');
  const [selectedNominal, setSelectedNominal] = useState('');

  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  const fetchData = async (page, display) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.163:8000/api/v1/pemotongan_pulang_awal/index',
        {page, display},
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1ODY2NzQ0LCJleHAiOjE3MzU4NzQxNDEsIm5iZiI6MTczNTg3MDU0MSwianRpIjoibHQwZ1Brb0FHNDFSS0l3VCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.q2Z3-VD91YxOwZNeUOJQrjHOcZ0nyQM8wA4O-fPJyiM',
          },
        },
      );
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (uuid, navigation) => {
    try {
      // Validasi UUID
      if (!uuid || typeof uuid !== 'string') {
        console.error('UUID tidak valid:', uuid);
        Alert.alert('Error', 'UUID tidak valid.');
        return;
      }
  
      // Permintaan data dari API
      const response = await axios.get(
        `http://192.168.60.163:8000/api/v1/pemotongan_pulang_awal/${uuid}/edit`,
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9sb2dpbiIsImlhdCI6MTczNTg2Njc0NCwiZXhwIjoxNzM1ODcwMzQ0LCJuYmYiOjE3MzU4NjY3NDQsImp0aSI6ImxDaXd5U0h5clltZjQ1OG8iLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.IzGyPGqDX4bRj-Nj54RvBQgqhnQMtIdr-Ubov23Smng',
          },
        }
      );
  
      const data = response.data.data;
  
      // Validasi data yang diterima
      if (!data || !data.batas_atas || !data.batas_bawah || !data.potongan) {
        console.error('Data tidak lengkap:', data);
        Alert.alert('Error', 'Data tidak valid untuk diedit.');
        return;
      }
  
      console.log('Data edit yang di-fetch:', data);
  
      // Navigasi ke halaman edit dengan parameter data
      navigation.navigate('EditPa', {
        initialPotongan: data.potongan,
        initialBatasAtas: data.batas_atas,
        initialBatasBawah: data.batas_bawah,
        uuid: data.uuid,
      });
    } catch (error) {
      // Menangani error permintaan API
      const errorMessage =
        error.response?.data?.message || 'Terjadi kesalahan saat mengambil data.';
      console.error('Error fetch data edit:', error.response || error);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleCreate = async (navigation, potongan, batasAtas, batasBawah) => {
    try {
      // Validasi data yang akan dikirim
      if (!potongan || !batasAtas || !batasBawah) {
        console.error('Data tidak valid:', { potongan, batasAtas, batasBawah });
        Alert.alert('Error', 'Pastikan semua data telah diisi.');
        return;
      }
  
      // Data default yang akan digunakan untuk halaman TambahPa
      const payload = {
        potongan,
        batas_atas: batasAtas,
        batas_bawah: batasBawah,
      };
  
      console.log('Navigasi ke TambahPa dengan data:', payload);
  
      // Navigasi ke halaman TambahPa dengan parameter
      navigation.navigate('TambahPa', {
        initialPotongan: payload.potongan,
        initialBatasAtas: payload.batas_atas,
        initialBatasBawah: payload.batas_bawah,
      });
    } catch (error) {
      console.error('Error navigating to TambahPa:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengarahkan ke halaman Tambah.');
    }
  };
  
  
  

  const submitHapus = async () => {
    try {
      await axios.delete(
        `http://192.168.60.163:8000/api/v1/pemotongan_pulang_awal/${selectedUuid}/delete`,
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1ODY2NzQ0LCJleHAiOjE3MzU4NzQxNDEsIm5iZiI6MTczNTg3MDU0MSwianRpIjoibHQwZ1Brb0FHNDFSS0l3VCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.q2Z3-VD91YxOwZNeUOJQrjHOcZ0nyQM8wA4O-fPJyiM',
          },
        },
      );
      Alert.alert('Berhasil', 'Data berhasil dihapus.');
      setHapusModalVisible(false);
      fetchData(currentPage);
    } catch (error) {
      console.error('Error during delete:', error);
      if (error.response) {
        console.error('Response:', error.response);
        Alert.alert(
          'Error',
          `Gagal menghapus data: ${error.response.data.message}`,
        );
      } else {
        Alert.alert('Error', 'Gagal menghapus data.');
      }
    }
  };

  const handleHapus = uuid => {
    setSelectedUuid(uuid);
    setHapusModalVisible(true); // Menampilkan modal konfirmasi hapus
  };

  const handleCloseTambahModal = () => {
    setSelectedGolongan('');
    setSelectedNominal('');
    setTambahModalVisible(false);
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
      <View style={styles.tambahContainer}>
      <TouchableOpacity
  style={styles.tambahButton}
  onPress={() => handleCreate(navigation, '10%', '18:00', '08:00')}>
  <FontAwesome name="plus" size={20} color="#fff" style={styles.icon} />
  <Text style={styles.tambahText}>Tambah</Text>
</TouchableOpacity>

      </View>
      <View style={styles.filterContainer}>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>Display</Text>
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>Batas Bawah</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Batas Atas</Text>
        <Text style={[styles.headerCell, styles.discountCell]}>Potongan</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.batas_bawah || '-'}
          </Text>
          <Text style={[styles.tableCell, styles.statusCell]}>
            {item.batas_atas || '-'}
          </Text>
          <Text style={[styles.tableCell, styles.discountCell]}>
            {item.potongan || '-'}
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
            <Text style={styles.expandedText}>
              Batas Bawah: {item.batas_bawah || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Batas Atas: {item.batas_atas || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Potongan: {item.potongan || '-'}
            </Text>
            <View style={styles.actionContainer}>
            <TouchableOpacity
      style={styles.editButton}
      onPress={() => handleEdit(item.uuid, navigation)}>
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}></View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
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

      {/* Hapus Uang Makan Modal */}
      <Modal
        visible={isHapusModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setHapusModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hapus Data</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setHapusModalVisible(false)}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, styles.approveButton]}
                onPress={submitHapus}>
                <Text style={styles.buttonText}>Setujui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingLeft: -5,
    width: 20,
  },
  numberCell: {
    width: 35,
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
  discountCell: {
    textAlign: 'right',
    flex: 1,
    paddingHorizontal: -10,
    paddingLeft: 5,
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
    marginBottom: 15,
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
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
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
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
    backgroundColor: '#3699FF',
    width: 90,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
});
