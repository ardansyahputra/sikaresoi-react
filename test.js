import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Linking,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';

export default function PerubahanPresensi() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDisplay, setSelectedDisplay] = useState(null);

  const apiClient = useApiClient();

  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  const fetchData = async (page, per) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/perubahan_absensi/indexadmin', {
        page,
      });
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal mengambil data. Silakan coba lagi!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const handleApprove = uuid => {
    setSelectedUuid(uuid);
    setApproveModalVisible(true);
  };

  const handleDecline = uuid => {
    setSelectedUuid(uuid);
    setModalVisible(true);
  };

  const submitDecline = async () => {
    try {
      await apiClient.post(`/perubahan_absensi/${selectedUuid}/change`, {
        status: '2',
        revisi: declineReason,
      });
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Penolakan Berhasil',
      });
      setModalVisible(false);
      setDeclineReason('');
      fetchData(currentPage, selectedDisplay); // Refresh data
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal menolak data. Silakan coba lagi!',
      });
    }
  };

  const submitApprove = async () => {
    try {
      await apiClient.post(`/perubahan_absensi/${selectedUuid}/change`, {
        status: '1',
        revisi: null,
      });
      Toast.show({
        type: 'success',
        text1: 'Sukses',
        text2: 'Persetujuan Berhasil',
      });
      setApproveModalVisible(false);
      fetchData(currentPage, selectedDisplay); // Refresh data
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Terjadi Kesalahan',
        text2: 'Gagal menyetujui data. Silakan coba lagi!',
      });
    }
  };

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyle = status => {
    switch (status?.toUpperCase()) {
      case 'DISETUJUI':
        return styles.badgeApproved; // Badge biru
      case 'DITOLAK':
        return styles.badgeRejected; // Badge merah
      case 'MENUNGGU':
        return styles.badgePending; // Badge kuning
      default:
        return styles.badgeDefault; // Badge default (abu-abu)
    }
  };

  const stripHtml = html => {
    return html.replace(/<[^>]*>/g, '').trim();
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
      </View>

      <View style={styles.tableHeader}>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.numberCell]}>
          NO
        </Text>
        <Text
          style={[GlobalStyle.SemiBold, styles.headerCell, styles.nameCell]}
          numberOfLines={2} // Bisa disesuaikan sesuai kebutuhan
        >
          NAMA
        </Text>
        <Text
          style={[
            GlobalStyle.SemiBold,
            styles.headerCell,
            styles.tableStatusCell,
          ]}
          numberOfLines={2} // Bisa disesuaikan sesuai kebutuhan
          ellipsizeMode="tail">
          STATUS
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
              style={[GlobalStyle.SemiBold, styles.tableCell, styles.nameCell]}
              numberOfLines={2} // Bisa disesuaikan sesuai kebutuhan
            >
              {item.user?.name || '-'}
            </Text>
            <Text
              style={[
                GlobalStyle.SemiBold,
                styles.tableCell,
                styles.persenCell,
                getStatusStyle(stripHtml(item.status)), // Hapus tag HTML dan ambil status
              ]}>
              {stripHtml(item.status) || '-'} {/* Hapus tag HTML */}
            </Text>
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
              <Text
                style={[GlobalStyle.SemiBold, styles.expandedText]}
                numberOfLines={2} // Bisa disesuaikan sesuai kebutuhan
              >
                Nama: {item.user?.name || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Tanggal: {item.tanggal || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Jam Masuk: {item.jam_masuk || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Jam Keluar: {item.jam_keluar || '-'}
              </Text>
              <Text style={[GlobalStyle.SemiBold, styles.expandedText]}>
                Keterangan: {item.revisi || '-'}
              </Text>
              <View style={styles.filetext}>
                <Text style={GlobalStyle.SemiBold}>File: </Text>
                <Text
                  style={[GlobalStyle.SemiBold, styles.expandedLinkText]}
                  onPress={() => Linking.openURL(item.file)}>
                  Lihat File
                </Text>
              </View>
              <View style={styles.actionContainer}>
                {item.status !== 'DISETUJUI' && item.status !== 'DITOLAK' ? (
                  <>
                    <TouchableOpacity
                      style={[styles.iconButton, styles.greenButton]}
                      onPress={() => handleApprove(item.uuid)}>
                      <Ionicons name="checkmark" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.iconButton, styles.redButton]}
                      onPress={() => handleDecline(item.uuid)}>
                      <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={[GlobalStyle.SemiBold, styles.statusText]}>
                    {item.status}
                  </Text>
                )}
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
      <Header title="Perubahan Absensi" />
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
      <Modal
        visible={isApproveModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setApproveModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.modalText]}>
              Apakah anda yakin ingin menyetujui data?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setApproveModalVisible(false)}>
                <Text style={[GlobalStyle.SemiBold, styles.cancelText]}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={submitApprove}>
                <Text style={[GlobalStyle.SemiBold, styles.confirmText]}>
                  Setujui
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Input Alasan Penolakan */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.modalText]}>
              Tolak Data
            </Text>
            <Text style={[GlobalStyle.SemiBold, styles.modalTolak]}>
              Alasan Penolakan:
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Masukkan alasan"
              placeholderTextColor="#B0B0B0"
              multiline
              value={declineReason}
              onChangeText={setDeclineReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={[GlobalStyle.SemiBold, styles.cancelText]}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmTolak]}
                onPress={submitDecline}>
                <Text style={[GlobalStyle.SemiBold, styles.confirmText]}>
                  Tolak
                </Text>
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
    width: 80,
    textAlign: 'center',
  },
  numberCell: {
    width: 45,
  },
  nameCell: {
    flex: 1,
    overflow: 'hidden',
    flexShrink: 1, // Memungkinkan teks agar tidak memaksa ruang lebih
    paddingHorizontal: 8, // Memberi jarak antar teks
    minWidth: 80, // Mencegah terlalu kecil saat teks panjang
  },
  filetext: {
    flexDirection: 'row',
    alignItems: 'left', // Menjadikan teks sejajar secara vertikal
  },

  expandedLinkText: {
    color: '#9B94E9',
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
  persenCell: {
    fontSize: 12,
  },

  greenButton: {
    backgroundColor: '#1BC5BD', // Warna biru untuk reset & edit
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
    marginBottom: 10,
  },
  modalTolak: {
    fontSize: 16,
    color: '#333',
  },
  modalInput: {
    width: '100%', // Pastikan input menggunakan lebar penuh
    marginVertical: 20, // Tambahkan padding agar tidak di tengah
    paddingHorizontal: 15, // Memberikan ruang pada sisi kiri dan kanan
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#313131',
    fontSize: 14,
    textAlignVertical: 'top', // Pastikan teks dimulai dari atas
    backgroundColor: '#f9f9f9', // Tambahkan warna latar belakang untuk kontras
    borderColor: 'transparent',
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
    backgroundColor: '#1BC5BD',
  },
  confirmTolak: {
    backgroundColor: '#FF536D',
  },
  confirmText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeApproved: {
    backgroundColor: '#C9F7F5', // Biru
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start', // Agar badge tidak melebar
    color: '#1BC5BD',
  },
  badgeRejected: {
    backgroundColor: '#FFE2E5', // Merah
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    color: '#F64E60',
  },
  badgePending: {
    backgroundColor: '#FFF4DE', // Kuning
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    color: '#FFA800',
  },
  badgeDefault: {
    backgroundColor: '#BEC2D5', // Abu-abu
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});
