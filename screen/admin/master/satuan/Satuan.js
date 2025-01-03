import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';

export default function Satuan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isTambahModalVisible, setTambahModalVisible] = useState(false);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [selectedNamaSatuan, setSelectedNamaSatuan] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  const fetchData = async page => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.123:8000/api/v1/satuan/index',
        {page},
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjE5NzMxLCJleHAiOjE3ODk2MzMxMTgsIm5iZiI6MTczNTYxOTczOCwianRpIjoiZE5Jck1EdG9qMDZGOURJeCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vZ9Wi3ZtLJIIIZK3mhVZPOnl3Mw9iJw8B64iFOb55kU',
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

  const submitEdit = async () => {
    try {
      await axios.post(
        `http://192.168.60.123:8000/api/v1/satuan/${editData.uuid}/update`,
        {
          nm_satuan: editData.nm_satuan,
        },
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjE5NzMxLCJleHAiOjE3ODk2MzMxMTgsIm5iZiI6MTczNTYxOTczOCwianRpIjoiZE5Jck1EdG9qMDZGOURJeCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vZ9Wi3ZtLJIIIZK3mhVZPOnl3Mw9iJw8B64iFOb55kU',
          },
        },
      );
      Alert.alert('Berhasil', 'Data berhasil diperbarui.');
      setEditModalVisible(false);
      fetchData(currentPage); // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui data.');
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await axios.get(
        `http://192.168.60.123:8000/api/v1/satuan/${uuid}/edit`,
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjE5NzMxLCJleHAiOjE3ODk2MzMxMTgsIm5iZiI6MTczNTYxOTczOCwianRpIjoiZE5Jck1EdG9qMDZGOURJeCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vZ9Wi3ZtLJIIIZK3mhVZPOnl3Mw9iJw8B64iFOb55kU',
          },
        },
      );

      console.log('Respons data yang diterima:', response.data); // Cetak semua respons data
      console.log('Data yang akan disimpan ke state:', response.data.data); // Cetak bagian data untuk state

      setEditData(response.data.data); // Simpan data edit di state
      setEditModalVisible(true); // Tampilkan modal edit
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const handleEdit = uuid => {
    fetchEditData(uuid);
  };

  const handleHapus = uuid => {
    setSelectedUuid(uuid);
    setHapusModalVisible(true);
  };

  const submitHapus = async () => {
    try {
      await axios.delete(
        `http://192.168.60.123:8000/api/v1/satuan/${selectedUuid}/delete`,
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjE5NzMxLCJleHAiOjE3ODk2MzMxMTgsIm5iZiI6MTczNTYxOTczOCwianRpIjoiZE5Jck1EdG9qMDZGOURJeCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vZ9Wi3ZtLJIIIZK3mhVZPOnl3Mw9iJw8B64iFOb55kU',
          },
        },
      );
      Alert.alert('Berhasil', 'Penolakan berhasil.');
      setHapusModalVisible(false);
      fetchData(currentPage); // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Gagal menolak data.');
    }
  };

  const handleTambah = () => {
    setTambahModalVisible(true);
  };

  const submitTambah = async () => {
    try {
      await axios.post(
        'http://192.168.60.123:8000/api/v1/satuan/create',
        {
          nm_satuan: selectedNamaSatuan,
        },
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjE5NzMxLCJleHAiOjE3ODk2MzMxMTgsIm5iZiI6MTczNTYxOTczOCwianRpIjoiZE5Jck1EdG9qMDZGOURJeCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vZ9Wi3ZtLJIIIZK3mhVZPOnl3Mw9iJw8B64iFOb55kU',
          },
        },
      );
      Alert.alert('Berhasil', 'Data berhasil ditambahkan.');
      setTambahModalVisible(false);
      fetchData(currentPage); // Refresh data

      // Reset form setelah berhasil
      setSelectedNamaSatuan('');

      } catch (error) {
      console.error('Error saat mengirim data:', error);
      Alert.alert('Error', 'Gagal menambahkan data.');
    }
  };

  const handleCloseTambahModal = () => {
    setSelectedNamaSatuan('');
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
        <TouchableOpacity style={styles.tambahButton} onPress={handleTambah}>
          <FontAwesome name="plus" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.tambahText}>TAMBAH</Text>
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
        <Text style={[styles.headerCell, styles.nameCell]}>Nama Pangkat</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>
          Aksi
        </Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.tableRow}>
        <View 
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.nm_satuan || '-'}
          </Text>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item.uuid)}>
              <FontAwesome name="pencil" size={16} color="#fff" />
              <Text style={styles.customFont}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleHapus(item.uuid)}>
              <FontAwesome name="trash" size={16} color="#fff" />
              <Text style={styles.customFont}>Hapus</Text>
            </TouchableOpacity>
          </View>  
        </View>
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

      {/* Edit Pangkat Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Data</Text>
            <Text style={styles.modalLabel}>Nama Satuan</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nama Satuan"
              value={editData.nm_satuan || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, nm_satuan: text}))
              }
              placeholderTextColor={'#B6B9CA'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitEdit} // Fungsi untuk menyimpan perubahan
              >
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tambah Pangkat Modal */}
      <Modal
        visible={isTambahModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setTambahModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Satuan Data</Text>
            <Text style={styles.modalLabel}>Nama Satuan</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nama Satuan"
              multiline
              value={selectedNamaSatuan}
              onChangeText={setSelectedNamaSatuan}
              placeholderTextColor={'#B6B9CA'}
            />

            {/* Tombol Modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCloseTambahModal()}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  submitTambah(); // Tutup modal setelah menyimpan
                }}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hapus Pangkat Modal */}
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
    fontSize: 12,
  },
  tableStatusCell: {
    textAlign: 'center',
    flex: 1,
    paddingLeft: 0,
  },
  numberCell: {
    width: 30,
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
    width: 80, 
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
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 5,
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
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 5,
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
