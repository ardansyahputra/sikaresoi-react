import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const SettingJabatan = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const baseURL = 'http://192.168.60.230:8000/api/v1';
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2ODIxMzMyLCJleHAiOjE3MzY4MzIxMDgsIm5iZiI6MTczNjgyODUwOCwianRpIjoiR05leGF5a2FEemY0MDJLTCIsInN1YiI6MzAsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.UKZmY2qspjU_uSwttNjt1I1j5obnYUrkZjnRVEx_Nzc';

  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/user/jabatan/index`,
        {},
        { headers: { Authorization: token } }
      );
      setData(response.data.data || []);
      setCurrentPage(response.data.current_page || []);
      setLastPage(response.data.last_page || []);
    } catch (error) {
      console.error('Error fetching data', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigation.navigate('FormJabatan', { type: 'create' });
  };

  const handleEdit = (item) => {
    navigation.navigate('FormJabatan', { type: 'edit', uuid: item.uuid });
  };
  
  const changeAktif = async (uuid , status) => {
    try {
      const response = await axios.put(
        `${baseURL}/user/jabatan/${uuid}/change-aktif`,
        { aktif: status },
        { headers: { Authorization: token } }
      );
      Alert.alert('Sukses', 'Status berhasil diubah');
      fetchData();
    } catch (error) {
      console.error('Error merubah status', error.response?.data || error.message);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengubah status')
    }
  }

  const handleDelete = async (id) => {
    setModalVisible(false);
    try {
      await axios.delete(`${baseURL}/user/jabatan/${id}/delete`, {
        headers: { Authorization: token },
      });
      Alert.alert('Sukses', 'Data berhasil dihapus.');
      fetchData(); // Refresh data setelah penghapusan
    } catch (error) {
      console.error('Error deleting data', error.response?.data || error.message);
      Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus data.');
    }
  };

  const confirmDelete = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
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
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <FontAwesome name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>TAMBAH</Text>
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
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name='search' size={20} color='#888' style={styles.searchIcon} />
          </View>
      </View> 
          
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Pimpinan</Text>
          <Text style={[styles.headerCell, styles.detailCell]}>Detail</Text>
          <View style={styles.expandIconCell} />
        </View>
    </View>
  );
  
  const renderItem = ({ item, index }) => {
    const isExpanded = expandedId === item.id;
  
    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}
        >
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.detail_pimpinan || '-'}
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
              Detail Jabatan: <Text style={styles.expandedTextDetail}> {item.detail_jabatan || '-'}</Text>
            </Text>
            <Text style={styles.expandedText}>
              Pimpinan: <Text style={styles.expandedTextDetail}> {item.detail_pimpinan || '-'}</Text>
            </Text>
            <Text style={styles.expandedText}>
              Periode: <Text style={styles.expandedTextDetail}>{item.periode || '-'}</Text>
            </Text>
            <View style={styles.actionContainer}>
              <Switch
                value={item.aktif}
                onValueChange={(value) => changeAktif(item.id, value)}
              />
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/images/sikaresoi.png')}
            style={styles.logo}
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ddd" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
  
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Peringatan </Text>
            <Text style={styles.modalText}>Apakah Anda yakin ingin menghapus data ini?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={() => handleDelete(selectedItem.id)}
              >
                <Text style={styles.modalButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={TableHeader}
          renderItem={renderItem}
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
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F7F8FB', // Tetap sesuai dengan warna default Anda
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  searchContainer: {
    width: 150,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    position: 'relative',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 12,
    paddingRight: 40, 
    color: '#000',
  },
  searchIcon: {
    position: 'absolute',
    right: 10, 
    top: '50%',
    transform: [{ translateY: -10 }],
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
    width: 120,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 10, 
    backgroundColor: '#007bff', 
    borderRadius: 5,
    marginRight: 20,
  },
  addButtonText: { 
    fontWeight: 'bold',
    color: 'white', 
    marginLeft: 8, 
  },
  tableHeader: {
    flexDirection: 'row',
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#E0E0E0',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  tableRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderBottomWidth: 0,
    borderColor: '#ddd',
    bottomRightRadius: 5,
    bottomLeftRadius: 5,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F0F0', // Memberi warna netral untuk header baris
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333', // Warna teks header
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
  },
  numberCell: {
    flex: 1,
    textAlign: 'center',
  },
  nameCell: {
    flex: 3,
    overflow: 'hidden', // Untuk menjaga tampilan saat teks panjang
  },
  detailCell: {
    flex: 1,
    textAlign: 'right',
  },
  dateCell: {
    flex: 2,
    textAlign: 'center',
  },
  expandIconCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  expandedText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  expandedTextDetail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555', // Warna teks detail
    marginBottom: 5,
  },
  expandedLinkText: {
    color: 'blue', // Teks berwarna biru untuk link
    fontSize: 14,
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3699ff',
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
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 13,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 2 },
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

export default SettingJabatan;
