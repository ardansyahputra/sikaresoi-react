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
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';

export default function BulanTahun() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [editData, setEditData] = useState({});
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isTambahModalVisible, setTambahModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [activeButton, setActiveButton] = useState('bulan');
  const [selectedNamaSatuan, setSelectedNamaSatuan] = useState('');
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);

  useEffect(() => {
    if (activeButton === 'bulan') {
      fetchBulanData(currentPage); // Reset to page 1 when display changes
    } else {
      fetchTahunData(currentPage); // Reset to page 1 when display changes
    }
  }, [currentPage, activeButton, selectedDisplay]);

  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjEyMzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2NDczMjIzLCJleHAiOjE3NDAwNzU1MzIsIm5iZiI6MTczNjQ3NTUzMiwianRpIjoiQ0tBSGpCMWtQSklQQmVqaiIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.qydXAhdK7rnRdB8Pe5tuOcIlMbTr6Axe0M90J0DmGtM';

  const fetchEditData = async uuid => {
    try {
      const endpoint =
        activeButton === 'bulan'
          ? `http://192.168.60.123:8000/api/v1/bulan/${uuid}/edit`
          : `http://192.168.60.123:8000/api/v1/tahun/${uuid}/edit`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization:
            token,
        },
      });

      console.log('Respons data yang diterima:', response.data); // Cetak semua respons data
      console.log('Data yang akan disimpan ke state:', response.data.data); // Cetak bagian data untuk state

      setEditData(response.data.data); // Simpan data edit di state
      setEditModalVisible(true); // Tampilkan modal edit
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const submitEdit = async () => {
    try {
      const endpoint =
        activeButton === 'bulan'
          ? `http://192.168.60.123:8000/api/v1/bulan/${editData.uuid}/update`
          : `http://192.168.60.123:8000/api/v1/tahun/${editData.uuid}/update`;

      const response = await axios.post(
        endpoint,
        {
          bulan: editData.bulan,
        },
        {
          headers: {
            Authorization:
              token,
          },
        },
      );

      if (response.status === 200 || response.status === 204) {
        Alert.alert('Berhasil', 'Data berhasil diperbarui.');
        setEditModalVisible(false);
        activeButton === 'bulan'
          ? fetchBulanData(currentPage)
          : fetchTahunData(currentPage);
      } else {
        Alert.alert(
          'Peringatan',
          'Respons tidak sesuai, tetapi data mungkin berhasil diperbarui.',
        );
      }
    } catch (error) {
      console.error(
        'Error saat menghapus:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Gagal memperbarui data.');
    }
  };

  const fetchTahunData = async page => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.123:8000/api/v1/tahun/index',
        {page, per: selectedDisplay},
        {
          headers: {
            Authorization:
              token,
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

  const fetchBulanData = async page => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.123:8000/api/v1/bulan/index',
        {page, per: selectedDisplay},
        {
          headers: {
            Authorization:
              token,
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

  const submitTambah = async () => {
    try {
      const endpoint =
        activeButton === 'bulan'
          ? `http://192.168.60.123:8000/api/v1/bulan/create`
          : `http://192.168.60.123:8000/api/v1/tahun/create`;
  
      // Sesuaikan payload berdasarkan activeButton
      const payload =
        activeButton === 'bulan'
          ? {bulan: selectedNamaSatuan}
          : {tahun: selectedNamaSatuan};
  
      const response = await axios.post(endpoint, payload, {
        headers: { // Perbaikan penulisan "headers" (bukan "Headers")
          Authorization:
            token,
        },
      });
  
      if (response.status === 200 || response.status === 204) {
        Alert.alert('Berhasil', 'Data berhasil ditambah.');
        setTambahModalVisible(false);
        activeButton === 'bulan'
          ? fetchBulanData(currentPage)
          : fetchTahunData(currentPage); // Refresh data sesuai tombol aktif
      } else {
        Alert.alert(
          'Peringatan',
          'Data mungkin sudah ditambah, tetapi respons tidak sesuai.',
        );
      }
    } catch (error) {
      console.error('Error saat menambah:', error.response?.data || error.message);
      Alert.alert('Error', 'Gagal menambah data.');
    }
  };
  

  const submitHapus = async () => {
    try {
      const endpoint =
        activeButton === 'bulan'
          ? `http://192.168.60.123:8000/api/v1/bulan/${selectedUuid}/delete`
          : `http://192.168.60.123:8000/api/v1/tahun/${selectedUuid}/delete`;

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization:
            token,
        },
      });

      if (response.status === 200 || response.status === 204) {
        // Operasi berhasil
        Alert.alert('Berhasil', 'Data berhasil dihapus.');
        setHapusModalVisible(false);
        fetchBulanData(currentPage);
        fetchTahunData(currentPage); // Refresh data
      } else {
        // Jika respons statusnya tidak seperti yang diharapkan
        Alert.alert(
          'Peringatan',
          'Data mungkin sudah dihapus, tetapi respons tidak sesuai.',
        );
      }
    } catch (error) {
      console.error('Error saat menghapus:', error);
      Alert.alert('Error', 'Gagal menghapus data.');
    }
  };

  const handleHapus = uuid => {
    setSelectedUuid(uuid);
    setHapusModalVisible(true);
  };

  const handleTambah = () => {
    setTambahModalVisible(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => {
        const newPage = prev - 1;
        return newPage;
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(prev => {
        const newPage = prev + 1;
        return newPage;
      });
    }
  };

  const handleCloseTambahModal = () => {
    setSelectedNamaSatuan('');
    setTambahModalVisible(false);
  };

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const handleEdit = uuid => {
    fetchEditData(uuid);
  };

  const handlePress = buttonName => {
    setActiveButton(buttonName); // Atur tombol aktif
    if (buttonName === 'bulan') {
      fetchBulanData(1); // Langsung fetch data saat tombol Bulan dipilih
    } else {
      fetchTahunData(1); // Langsung fetch data saat tombol Tahun dipilih
    }
  };

  const headerText = activeButton === 'bulan' ? 'Nama Bulan' : 'Nama Tahun';

  const TableHeader = () => (
    <View>
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
            onChange={item => {
              setSelectedDisplay(item.value);
              activeButton === 'bulan'
                ? fetchBulanData(currentPage)
                : fetchTahunData(currentPage);
            }}
            renderItem={item => (
              <Text style={[styles.dropdownItem, styles.customFont]}>
                {item.label}
              </Text>
            )}
            placeholderStyle={styles.customFont}
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
        <Text style={[styles.headerCell, styles.nameCell]}>{headerText}</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Status</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const tahunBulanData = activeButton === 'bulan' ? item.bulan : item.tahun;

    return (
      <View style={styles.tableRow}>
        <View style={styles.rowHeader}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {tahunBulanData || '-'}
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
      <View>
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
      </View>

      {/* Card untuk Tombol */}
      <View style={styles.card}>
        <View style={styles.tambahContainer}>
          <TouchableOpacity style={styles.tambahButton} onPress={handleTambah}>
            <FontAwesome
              name="plus"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.tambahText}>TAMBAH</Text>
          </TouchableOpacity>
          <View style={styles.bulanContainer}>
            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                activeButton === 'bulan' && styles.buttonActive,
              ]}
              onPress={() => handlePress('bulan')}>
              <View style={styles.bulanButton}>
                <FontAwesome
                  name="tint"
                  size={24}
                  color={activeButton === 'bulan' ? '#A463FC' : 'gray'}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.buttonText,
                    activeButton === 'bulan' && styles.textActive,
                  ]}>
                  Bulan
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                activeButton === 'tahun' && styles.buttonActive,
              ]}
              onPress={() => handlePress('tahun')}>
              <View style={styles.bulanButton}>
                <FontAwesome
                  name="tint"
                  size={24}
                  color={activeButton === 'tahun' ? '#A463FC' : 'gray'}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.buttonText,
                    activeButton === 'tahun' && styles.textActive,
                  ]}>
                  Tahun
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Tabel */}
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
                    onPress={handlePreviousPage}>
                    <Text style={styles.pageButtonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === lastPage && styles.disabledButton,
                    ]}
                    disabled={currentPage === lastPage}
                    onPress={handleNextPage}>
                    <Text style={styles.pageButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        />
      )}

      {/* Hapus Modal */}
      <Modal
        visible={isHapusModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setHapusModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Setujui Data</Text>
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
              placeholder={
                activeButton === 'bulan' ? 'Nama Bulan' : 'Nama Tahun'
              }
              value={
                activeButton === 'bulan'
                  ? editData.bulan || ''
                  : editData.tahun || ''
              }
              onChangeText={text =>
                setEditData(prev => ({
                  ...prev,
                  [activeButton === 'bulan' ? 'bulan' : 'tahun']: text,
                }))
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

      {/* Tambah Bulan/tahun Modal */}
      <Modal
        visible={isTambahModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setTambahModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Tambah Data {activeButton === 'bulan' ? 'Bulan' : 'Tahun'}
            </Text>
            <Text style={styles.modalLabel}>
              {activeButton === 'bulan' ? 'Bulan' : 'Tahun'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={
                activeButton === 'bulan' ? 'Nama Bulan' : 'Nama Tahun'
              }
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
    fontWeight: 'bold',
  },
  expandIconCell: {
    width: 40,
    alignItems: 'flex-end',
  },
  approvedStatus: {
    backgroundColor: '#C9F7F5',
    color: '#4CAF50',
  },
  rejectedStatus: {
    borderRadius: 5,
    backgroundColor: '#FFE2E5',
    color: '#F44336',
  },
  pendingStatus: {
    color: '#FFC107',
  },
  defaultStatus: {
    color: '#9E9E9E',
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
    minHeight: 40,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dropdownModal: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
  searchContainer: {
    width: 180,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
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
    fontSize: 13,
    color: '#333',
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
  button: {
    height: 40,
    width: 90,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  bulanContainer: {
    flexDirection: 'row',
  },
  bulanButton: {
    flexDirection: 'row',
    gap: 5,
  },
});
