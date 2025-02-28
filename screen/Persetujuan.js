import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../src/api/apiClient';

export default function Persetujuan({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(10);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [pickUraianOptions, setPickUraianOptions] = useState(6);
  const apiClient = useApiClient();

  useEffect(() => {
    fetchData(currentPage);
    fetchTahun();
  }, [currentPage]);

  const fetchTahun = async () => {
    try {
      const response = await apiClient.get('/tahun/show');

      if (Array.isArray(response.data.data)) {
        setTahunOptions(
          response.data.data.map(item => ({
            label: item.tahun ? item.tahun : 'Unknown',
            value: item.id ? item.id : 'Unknown',
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching tahun options:', error);
    }
  };

  const fetchData = async tahun_id => {
    try {
      setLoading(true);
      console.log('Aku ngirim ini 💕😘👌', {
        page: currentPage,
        tahun_id: tahun_id ?? pickUraianOptions,
        per: selectedDisplay,
        search: searchQuery,
      });
      const response = await apiClient.post('/user/kinerja/azril', {
        page: currentPage,
        tahun_id: tahun_id ?? pickUraianOptions,
        per: selectedDisplay,
        search: searchQuery,
      });

      console.log(response.data);
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApprove = (userJabatanId, tahunId) => {
    navigation.navigate('Bacakontrak', {userJabatanId, tahunId});
  };

  const getStatusStyle = status => {
    // switch (status?.toUpperCase()) {
    //   case 'DISETUJUI':
    //     return styles.approvedStatus;
    //   case 'BELUM DIBACA':
    //     return styles.rejectedStatus;
    //   case 'MENUNGGU':
    //     return styles.pendingStatus;
    //   default:
    //     return styles.defaultStatus;
    // }
  };

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const TableHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.tahun}>Tahun</Text>
            <Dropdown
              style={styles.dropdownTahun}
              data={tahunOptions}
              labelField="label"
              valueField="value"
              placeholder="2025"
              value={pickUraianOptions}
              onChange={item => {
                console.log('Dropdown 😊👌😁👍🙌❤️', item);
                setPickUraianOptions(_ => item.value);
                fetchData(item.value);
              }}
              renderItem={item => (
                <Text
                  style={[
                    styles.dropdownItem,
                    styles.customFont,
                    {color: '#333'},
                  ]}>
                  {item.label}
                </Text>
              )}
            />
          </View>

          <View style={styles.filterGroup}>
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
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>
          Detail Pengirim
        </Text>
        <Text style={[styles.headerCell, styles.detailCell]}>Status</Text>
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
            {item.user_jabatan?.user?.name || '-'}
          </Text>
          <View style={styles.statusCellContainer}>
            <Text
              style={[
                styles.tableCell,
                styles.statusCell,
                getStatusStyle(item.status),
              ]}>
              {item.status_class || '-'}
            </Text>
          </View>
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
              Detail pengirim: {item.user_jabatan?.user?.name_nip || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Jabatan: {item.user_jabatan?.jab_unit || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Periode: {item.user_jabatan?.periode || '-'}
            </Text>
            <Text
              style={[styles.expandedText, item.status_class === 'DISETUJUI']}>
              Status: {item.status_class || '-'}
            </Text>

            <Text style={styles.expandedText}>
              Status revisi: {item.revisi_class || '-'}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() =>
                  handleApprove(item.user_jabatan_id, item.tahun_id)
                }>
                <Ionicons name="eye" size={20} color="white" />
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
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
      <Text style={styles.headerTitle}>Persetujuan Kontrak Kinerja</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB', // Tetap sesuai dengan warna default Anda
  },
  
  backButton: {
    marginTop: 7,
    marginLeft: 3,
    marginRight: 1,
    opacity: 0.4,
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
  filtersContainer: {
    flexDirection: 'column',
    marginRight: 20,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    width: 150,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  tahunContainer: {
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
    width: 50, // Fixed width for alignment
  },
  tahun: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    marginRight: 8,
    textAlign: 'center',
    color: '#3f4254',
    width: 50, // Fixed width for alignment
  },
  dropdown: {
    width: 60,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  dropdownTahun: {
    width: 85,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 13,
    color: '#333',
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
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3699ff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
