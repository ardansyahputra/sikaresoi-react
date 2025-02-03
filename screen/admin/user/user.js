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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import * as Keychain from 'react-native-keychain';
import {BarIndicator} from 'react-native-indicators';

export default function User() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isHapusModalVisible, setHapusModalVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk search query
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const apiClient = useApiClient();
  const navigation = useNavigation();

  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  useFocusEffect(
    React.useCallback(() => {
      // Refresh data when screen is focused
      fetchData(currentPage);
    }, [currentPage]),
  );

  const fetchData = async page => {
    try {
      setIsLoading(true);
      console.log('Mengambil data dari server...');
      const response = await apiClient.post('/user_master/index', {page});

      // Data dari server
      console.log('Data dari API:', response.data);

      const usersData = response.data.data;
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);

      setData(usersData); // Perbarui state langsung dari API
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async uuid => {
    try {
      // Jangan set loading menjadi true di sini
      const userResponse = await apiClient.get(`/user_master/${uuid}/edit`);

      if (userResponse.data.status) {
        const userData = userResponse.data.data;

        const groupResponse = await apiClient.get(`/user_master/get_group`);
        if (groupResponse.data.status) {
          const groups = groupResponse.data.data;

          // Langsung navigasi ke halaman edit tanpa mengubah loading state
          navigation.navigate('Edituser', {
            user: userData,
            groups: groups,
          });

          return; // Hentikan eksekusi agar tidak masuk ke blok `finally`
        } else {
          Alert.alert('Error', 'Gagal mendapatkan data grup pengguna.');
        }
      } else {
        Alert.alert('Error', 'Gagal mendapatkan data pengguna.');
      }
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat mengambil data edit pengguna.',
      );
    }
  };

  const handleHapus = uuid => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus pengguna ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: async () => {
            try {
              await apiClient.delete(`/user_master/${uuid}/delete`);
              Alert.alert('Berhasil', 'Pengguna berhasil dihapus.');
              fetchData(currentPage);
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus pengguna.');
            }
          },
        },
      ],
    );
  };

  const handleResetPassword = async uuid => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mereset password pengguna ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              const response = await apiClient.post(`/password/${uuid}/reset`);

              if (response.data.status) {
                Alert.alert('Sukses', response.data.data);
                fetchData(currentPage); // Tambahkan ini agar otomatis refresh setelah reset
              } else {
                Alert.alert('Gagal', 'Reset password gagal.');
              }
            } catch (error) {
              Alert.alert('Error', 'Terjadi kesalahan saat mereset password.');
            }
          },
        },
      ],
    );
  };

  // Mengambil status dari Keychain saat komponen dimuat
  const getStatusFromKeychain = async uuid => {
    try {
      const storedStatus = await Keychain.getGenericPassword({service: uuid});
      return storedStatus ? parseInt(storedStatus.password) : null;
    } catch (error) {
      console.error('Error getting status from Keychain', error);
      return null;
    }
  };

  // Menyimpan status ke Keychain
  const saveStatusToKeychain = async (uuid, status) => {
    try {
      await Keychain.setGenericPassword(uuid, String(status), {service: uuid});
    } catch (error) {
      console.error('Error saving status to Keychain', error);
    }
  };

  // Mengubah status dan menyimpannya ke Keychain
  const handleSwitchToggle = async (uuid, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic update: Perbarui UI secara instan
    setData(prevData =>
      prevData.map(user =>
        user.uuid === uuid ? {...user, status: newStatus} : user,
      ),
    );

    try {
      // Kirim perubahan status ke API
      const response = await apiClient.get(`/user_master/${uuid}/changeAktif`);
      console.log('Response API setelah mengubah status:', response.data);

      if (!response.data.status) {
        // Jika API gagal, kembalikan UI ke keadaan sebelumnya
        console.error('Gagal mengubah status di API');
        setData(prevData =>
          prevData.map(user =>
            user.uuid === uuid ? {...user, status: currentStatus} : user,
          ),
        );
        Alert.alert('Gagal', 'Tidak dapat mengubah status.');
      } else {
        // Jika API berhasil, simpan status baru ke Keychain (jika diperlukan)
        await saveStatusToKeychain(uuid, newStatus);
        console.log(`Setelah toggle: UUID ${uuid}, Status ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Jika terjadi error, kembalikan UI ke keadaan sebelumnya
      setData(prevData =>
        prevData.map(user =>
          user.uuid === uuid ? {...user, status: currentStatus} : user,
        ),
      );
      Alert.alert('Error', 'Terjadi kesalahan saat mengubah status.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const updatedData = await Promise.all(
        data.map(async user => {
          const storedStatus = await getStatusFromKeychain(user.uuid);
          return {
            ...user,
            aktif: storedStatus !== null ? storedStatus : user.aktif,
          };
        }),
      );
      setData(updatedData); // Perbarui data di state
    };

    if (data.length > 0) {
      loadData();
    }
  }, []);

  const handleTambah = async () => {
    try {
      const groupResponse = await apiClient.get(`/user_master/get_group`);
      if (groupResponse.data.status) {
        const groups = groupResponse.data.data;

        navigation.navigate('Tambahuser', {
          groups: groups,
        });
      } else {
        Alert.alert('Error', 'Gagal mendapatkan data grup pengguna.');
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat mengambil data grup pengguna.',
      );
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
        <Text style={[styles.headerCell, styles.nameCell]}>Nip/Nrp</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Aktif</Text>
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
          <Text style={[styles.tableCell, styles.nameCell]}>
            {item.nip || '-'}
          </Text>

          <View style={[styles.tableCell, styles.switchCell]}>
            <Switch
              value={item.status === 1} // Gunakan item.status untuk mengontrol switch
              onValueChange={() => handleSwitchToggle(item.uuid, item.status)}
              trackColor={{
                false: '#d3d3d3', // Warna track ketika OFF (abu-abu)
                true: '#add8e6', // Warna track ketika ON (biru muda)
              }}
              thumbColor={item.status === 1 ? '#ffffff' : '#f4f4f4'} // Thumb putih
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}} // Opsional: Perbesar Switch
            />
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
            <Text style={styles.expandedText}>Nama: {item.name || '-'}</Text>
            <Text style={styles.expandedText}>Level: {item.level || '-'}</Text>
            <Text style={styles.expandedText}>
              Pangkat/Gol: {item.pangkat?.nm_pangkat || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Group: {item.user_group_name || '-'}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => handleResetPassword(item.uuid)}
                style={styles.iconButton} // Gunakan style khusus untuk ikon
              >
                <FontAwesome name="refresh" size={20} color="#808080" />
                {/* Warna abu-abu */}
              </TouchableOpacity>
              {/* Tombol Edit (Hanya Ikon Abu-Abu) */}
              <TouchableOpacity
                onPress={() => handleEdit(item.uuid)}
                style={styles.iconButton} // Gunakan style khusus untuk ikon
              >
                <FontAwesome name="pencil" size={20} color="#808080" />
                {/* Warna abu-abu */}
              </TouchableOpacity>

              {/* Tombol Hapus (Tetap Sama) */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleHapus(item.uuid)}>
                <FontAwesome name="trash" size={20} color="#808080" />
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
    padding: 20,
  },
  tableHeader: {
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
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
    marginBottom: 15,
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

  iconButton: {
    padding: 6, // Sesuaikan padding jika diperlukan
    backgroundColor: 'transparent', // Hapus background
    marginHorizontal: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
