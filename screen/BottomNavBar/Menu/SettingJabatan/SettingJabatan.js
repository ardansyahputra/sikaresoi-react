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
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import useApiClient from '../../../../src/api/apiClient';

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
  const [filteredData, setFilteredData] = useState([]);
  const apiClient = useApiClient();

  
  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      // Check if 'refresh' is passed as a param
      if (route.params?.refresh) {
        fetchData();
        navigation.setParams({ refresh: false }); // Reset the refresh flag
      }
    }, [route.params])
  );

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.detail_pimpinan?.toLowerCase().includes(lowerCaseQuery) ||
        item.detail_jabatan?.toLowerCase().includes(lowerCaseQuery) ||
        item.periode?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        `/user/jabatan/index`,
        {},
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchData(query, currentPage, selectedDisplay);
  };

  const handleAdd = () => {
    navigation.navigate('FormJabatan', { type: 'create' });
  };

  const handleEdit = (item) => {
    navigation.navigate('FormJabatan', { type: 'edit', item });
  };
  
  const handleChangeAktif = async (item) => {
    try {
      console.log(item)
      
      const response = await apiClient.get(
        `/user/jabatan/${item.uuid}/changeAktif`,
        {
        },
      );
      fetchData();
      Alert.alert('Sukses', 'Status berhasil diubah');
    } catch (error) {
      console.log(item);
      console.error(
        'Error merubah status',
        error.response?.data || error.message,
      );
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengubah status');
    }
  };
  

  const handleDelete = async (id) => {
    setModalVisible(false);
    try {
      await apiClient.delete(`/user/jabatan/${id}/delete`, {
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
              onChangeText={handleSearch}
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
          <View style={styles.expandedRow}>
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
                value={item.aktif === 1}
                onValueChange={() => handleChangeAktif(item)}
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
      <View style={styles.header1}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
            source={require('../../../assets/images/sikaresoi.png')}
            style={styles.headerImage}
        />
      </View>
        <View style={styles.headerTextContainer1}>
          <Text style={styles.headerTitle1}>Setting Jabatan</Text>
          <Text style={styles.separatorText1}> • </Text>
          <Text style={styles.headerSubtitle1}>Jabatan</Text>
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
  
  
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={TableHeader}
          renderItem={renderItem}
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
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backButton: {
    marginTop:1,
    marginLeft:3,
    marginRight:1,
    opacity: 0.4,
  },
  headerTextContainer1: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 13, // Menambahkan jarak ke kiri
    marginTop: 20, 
  },

  headerTitle1: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#000",
  },

  separatorText1: {
    fontSize: 20,
    color: "#000",
    marginBottom: 3,
  },

  headerSubtitle1: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#000",
    marginLeft: 0,
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
    flexDirection: 'row',
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
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    marginLeft: 20,
    marginBottom: 4, 
    marginTop: 10,
  },
  headerSubtitle: {
    color: "#000",
    marginLeft: 20,
    marginBottom: 4,
    fontFamily: "Poppins-SemiBold",
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
  dropdownItem: {
    padding: 10,
    fontSize: 15,
    color: '#333',
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
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
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: '#333', // Warna teks header
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
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
  expandedRow: {
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  expandedText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontFamily: "Poppins-Regular",
  },
  expandedTextDetail: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: '#555', // Warna teks detail
    marginBottom: 5,
  },
  expandedLinkText: {
    color: 'blue', // Teks berwarna biru untuk link
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-SemiBold",
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  paginationText: {
    color: 'white',
    fontFamily: "Poppins-SemiBold",
  },
  pageInfo: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-SemiBold",
    textAlign: 'center',
  },
});

export default SettingJabatan;
