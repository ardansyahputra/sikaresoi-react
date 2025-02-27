import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import useApiClient from '../../../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
import Header from '../../../../components/Header';

export default function Mesin() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const navigation = useNavigation();
  const apiClient = useApiClient();

  useFocusEffect(
    React.useCallback(() => {
      fetchData(currentPage, selectedDisplay);
    }, [currentPage, selectedDisplay]),
  );

  const fetchData = async (page, display) => {
    try {
      setIsLoading(true); // Set loading state
      const response = await apiClient.post(
        '/fingerprint_machine/index', // API URL
        {page, display},
        {},
      );
      console.log('Full API Response:', response.data); // Log the full response to inspect all data

      // Check if the expected fields are available in response
      const {data: fetchedData, current_page, last_page} = response.data;
      setData(fetchedData); // Update the state
      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const submitHapus = async () => {
    try {
      await apiClient.delete(`/fingerprint_machine/${selectedUuid}/delete`);
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

  const handleCreate = (navigation, value1, value2, value3) => {
    navigation.navigate('Tambahmesin');
  };

  const handleEdit = (uuid, navigation) => {
    navigation.navigate('Editmesin', {uuid});
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
            data={display} // Ensure display options are properly passed
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
        <Text style={[styles.headerCell, styles.numberCell]}>#</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>Nama Mesin</Text>
        <Text style={[styles.headerCell, styles.ipCell]}>IP</Text>{' '}
        {/* IP header */}
        <Text style={[styles.headerCell, styles.portCell]}>Port</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    // Log data yang diterima untuk setiap item
    console.log('Data item:', item);

    const isExpanded = expandedId === item.id;

    // Menentukan ikon berdasarkan status aktif
    const activeIcon =
      item.active === 'Aktif' ? (
        <FontAwesome name="check" size={17} color="green" />
      ) : (
        <FontAwesome name="times" size={17} color="red" />
      );

    // Menentukan ikon berdasarkan status terhubung
    const connectedIcon =
      item.connected === 'Aktif' ? (
        <FontAwesome name="check" size={17} color="green" />
      ) : (
        <FontAwesome name="times" size={17} color="red" />
      );

    // Background warna untuk status aktif
    const activeBackgroundColor =
      item.active === 'Aktif' ? '#c6f3f1' : '#ffe2e5';
    const connectedBackgroundColor =
      item.connected === 'Aktif' ? '#c6f3f1' : '#ffe2e5';

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
            {item.name || '-'}
          </Text>
          <Text style={[styles.tableCell, styles.ipCell]}>
            {item.ip || '-'}
          </Text>
          <Text style={[styles.tableCell, styles.portCell]}>
            {item.port || '-'}
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
              Nama Mesin: {item.name || '-'}
            </Text>
            <Text style={styles.expandedText}>IP: {item.ip || '-'}</Text>
            <Text style={styles.expandedText}>Port: {item.port || '-'}</Text>

            {/* Teks Status Aktif dengan ikon dan background */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.expandedText}>Status Aktif: </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: activeBackgroundColor,
                  paddingVertical: 1,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}>
                <View style={{marginRight: -1}}>{activeIcon}</View>
              </View>
            </View>

            {/* Teks Status Terhubung dengan ikon dan background */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.expandedText}>Status Terhubung: </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: connectedBackgroundColor,
                  paddingVertical: 1,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}>
                <View style={{marginRight: -1}}>{connectedIcon}</View>
              </View>
            </View>

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
      <Header title="Mesin Fingerprint" />

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
    textAlign: 'center', // Center the text horizontally
    marginright: 25,
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
  ipCell: {
    flex: 1, // Ensures the IP column takes up available space equally
    textAlign: 'center', // Center the content within the cell
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  ipCello: {
    flex: 1, // Ensures the IP column takes up available space equally
    marginLeft: 70,
  },
  tableCell: {
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    fontSize: 14,
    marginLeft: 15,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
