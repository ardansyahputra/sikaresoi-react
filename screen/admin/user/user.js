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
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import * as Keychain from 'react-native-keychain';
import {BarIndicator} from 'react-native-indicators';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

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

  const handleHapusPress = uuid => {
    setSelectedUuid(uuid);
    setSelectedAction('hapus'); // Tandai bahwa ini aksi hapus
    setModalVisible(true);
  };

  const handleResetPress = uuid => {
    setSelectedUuid(uuid);
    setSelectedAction('reset'); // Tandai bahwa ini aksi reset password
    setModalVisible(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUuid) return;

    setModalVisible(false); // Tutup modal sebelum aksi dijalankan

    if (selectedAction === 'hapus') {
      try {
        await apiClient.delete(`/user_master/${selectedUuid}/delete`);
        fetchData(currentPage);
        Toast.show({
          type: 'success',
          text1: 'Berhasil',
          text2: 'Pengguna berhasil dihapus.',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Terjadi Kesalahan',
          text2: 'Gagal menghapus pengguna.',
        });
      }
    } else if (selectedAction === 'reset') {
      try {
        const response = await apiClient.post(
          `/password/${selectedUuid}/reset`,
        );
        if (response.data.status) {
          Toast.show({
            type: 'success',
            text1: 'Sukses',
            text2: response.data.data, // Teks dari API
          });
          fetchData(currentPage);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Gagal',
            text2: 'Reset password gagal.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Terjadi Kesalahan',
          text2: 'Terjadi kesalahan saat mereset password.',
        });
      }
    }
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
        <TouchableOpacity style={styles.tambahButton} onPress={handleTambah}>
          <Ionicons name="add" size={18} color="#fff" style={styles.icon} />
          <Text style={[GlobalStyle.SemiBold, styles.tambahText]}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}>
          NIP/NRP
        </Text>
        <Text
          style={[
            GlobalStyle.SemiBold,
            styles.headerCell,
            styles.tableStatusCell,
          ]}>
          AKTIF
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
              {item.nip || '-'}
            </Text>

            <View style={styles.tableCell}>
              <Switch
                value={item.status === 1}
                onValueChange={() => handleSwitchToggle(item.uuid, item.status)}
                trackColor={{
                  false: '#BEC2D5',
                  true: '#add8e6',
                }}
                thumbColor={item.status === 1 ? '#ffffff' : '#f4f4f4'}
                style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
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
                Nama: {item.name || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Level: {item.level || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Pangkat/Gol: {item.pangkat?.nm_pangkat || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Group: {item.user_group_name || '-'}
              </Text>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  onPress={() => handleResetPress(item.uuid)}
                  style={[styles.iconButton, styles.blueButton]} // Gunakan style khusus untuk ikon
                >
                  <Ionicons name="refresh-outline" size={20} color="white" />
                  {/* Warna abu-abu */}
                </TouchableOpacity>
                {/* Tombol Edit (Hanya Ikon Abu-Abu) */}
                <TouchableOpacity
                  onPress={() => handleEdit(item.uuid)}
                  style={[styles.iconButton, styles.blueButton]} // Gunakan style khusus untuk ikon
                >
                  <Ionicons name="pencil" size={20} color="white" />

                  {/* Warna abu-abu */}
                </TouchableOpacity>

                {/* Tombol Hapus (Tetap Sama) */}
                <TouchableOpacity
                  style={[styles.iconButton, styles.redButton]}
                  onPress={() => handleHapusPress(item.uuid)}>
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={[GlobalStyle.SemiBold, styles.modalText]}>
                      {selectedAction === 'hapus'
                        ? 'Apakah Anda yakin ingin menghapus pengguna ini?'
                        : 'Apakah Anda yakin ingin mereset password pengguna ini?'}
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={[GlobalStyle.SemiBold, styles.cancelText]}>
                          Tidak
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.confirmButton]}
                        onPress={handleConfirmAction}>
                        <Text
                          style={[GlobalStyle.SemiBold, styles.confirmText]}>
                          Ya
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
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
      <Header title="Daftar Pegawai" />
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
