import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import useApiClient from '../src/api/apiClient';
import DocumentPicker from 'react-native-document-picker';

export default function RealisasiNext({ navigation, route }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showDetails, setShowDetails] = useState({});
  const [documents, setDocuments] = useState([]);
  const [isRevisiVisible, setIsRevisiVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const apiClient = useApiClient();
  const [revisiText, setRevisiText] = useState('');
  const { id: uuid, selectedBulanId, tahunId, userJabatanId, name } = route.params || {};
  const [catatanRevisi, setCatatanRevisi] = useState('');
  const [pemberiRevisi, setPemberiRevisi] = useState('');
  const [namaPengguna, setNamaPengguna] = useState(name || "Nama Tidak Diketahui");

  useEffect(() => {
    console.log("✅ Params diterima di RealisasiNext:", {
      uuid,
      selectedBulanId,
      tahunId,
      userJabatanId,
      name,
    });
  
    if (name) {
      setNamaPengguna(name);
    }
  }, []);
  
  
  

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleKonfirmasi = async () => {
    if (!uuid) {
      Alert.alert('Error', 'UUID tidak ditemukan.');
      return;
    }
  
    try {
      const payload = {
        revisi: revisiText,
        bulan_id: selectedBulanId,
        tahun_id: tahunId,
        user_jabatan_id: userJabatanId,
        name: namaPengguna, // Kirim name ke API
      };
  
      console.log("📤 Mengirim Data Konfirmasi:", JSON.stringify(payload, null, 2));
  
      const response = await apiClient.post(
        `/user/kinerja/${uuid}/konfirmasi_realisasi`,
        payload
      );
  
      if (response.data?.status) {
        Alert.alert('Sukses', 'Data berhasil dikonfirmasi');
        setIsRevisiVisible(false);
        setRevisiText('');
      } else {
        Alert.alert('Gagal', 'Konfirmasi gagal, coba lagi.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengonfirmasi data.');
    }
  };
  
  
  const fetchData = async () => {
    console.log("=== MULAI FETCH DATA ===");
    console.log("Selected Bulan ID:", selectedBulanId);
    console.log("Selected Tahun ID:", tahunId);
    console.log("User Jabatan ID:", userJabatanId);
  
    if (!selectedBulanId || !tahunId || !userJabatanId) {
      Alert.alert("Error", "Data tidak lengkap. Mohon pilih bulan dan tahun.");
      return;
    }
  
    try {
      setLoading(true);
  
      const payload = {
        bulan_id: selectedBulanId,
        tahun_id: tahunId,
        user_jabatan_id: userJabatanId,
      };
  
      console.log("📤 Mengirim Payload ke API:", JSON.stringify(payload, null, 2));
  
      const response = await apiClient.post(
        "user/kinerja/list/target/realisasi/index",
        payload
      );
  
      console.log("✅ API Response:", response.data);
  
      if (response.data) {
        setData([...response.data.utama, ...response.data.tambahan]);
  
        // Jangan ganti nama jika API tidak memberikan data
        if (response.data.kinerja?.user_jabatan?.user?.name) {
          setNamaPengguna(response.data.kinerja.user_jabatan.user.name);
          console.log("✅ Nama berhasil diambil dari API:", response.data.kinerja.user_jabatan.user.name);
        } else {
          console.log("⚠️ Nama tidak ditemukan dalam API, menggunakan nama dari navigasi.");
        }
      } else {
        Alert.alert("Error", "Data tidak valid dari server.");
      }
    } catch (error) {
      console.error("⛔ ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      console.log("=== SELESAI FETCH DATA ===");
    }
  };
  
  

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
      <Text style={[styles.headerCell, styles.nameCell]}>Uraian Kegiatan</Text>
      <Text style={[styles.headerCell, styles.tableStatusCell]}>Biaya</Text>
      <View style={styles.expandIconCell} />
    </View>
  );

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const addDocument = () => {
    const nextFileNumber = documents.length + 1;
    setDocuments([...documents, { name: `File ${nextFileNumber}` }]);
  };
  

  const handleDeleteDocument = () => {
    const newDocuments = documents.filter((_, i) => i !== documentToDelete);
    setDocuments(newDocuments);
    setIsDeleteModalVisible(false);
  };

  const renderItem = ({ item, index }) => {
    const isExpanded = expandedId === item.id;

    const uraianKegiatan = item.target?.list_kinerja?.uraian?.nm_uraian || 'Tidak tersedia';
    const biaya = item.target?.list_kinerja?.uraian?.biaya ?? 0;
    const usulanKuantitas = item.usulan_kuantitas || 'Tidak tersedia';
    const usulanKualitas = item.usulan_kualitas || 'Tidak tersedia';
    const jenisTugas = item.target?.list_kinerja?.tgs_tambahan === 1 ? 'Tugas Tambahan' : 'Tugas Utama';



    return (
      <View style={styles.tableRow}>
        <TouchableOpacity style={styles.rowHeader} onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text style={[styles.tableCell, styles.nameCell]}>{uraianKegiatan}</Text>
          <Text style={[styles.tableCell, styles.nameCell]}>{biaya}</Text>
          <View style={styles.expandIconCell}>
            <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedText}>
              AK: {item.target?.list_kinerja?.uraian?.angka_kredit ?? 'Tidak tersedia'}
            </Text>
            <Text style={styles.expandedText}>Kuantitas: {item.kuantitas || '-'}</Text>
            <Text style={styles.expandedText}>Kualitas: {item.kualitas || '-'}</Text>
            <Text style={styles.expandedText}>BOBOT: {item.target?.list_kinerja?.bobot || '-'}</Text>
            <Text style={styles.expandedText}>STATUS: {item.status ? 'Aktif' : 'Tidak Aktif'}</Text>
            <Text style={styles.expandedText}>
              Jenis Tugas: {jenisTugas}
            </Text>

            <TouchableOpacity
              style={styles.realisasiButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Text style={styles.buttonText}>REALISASI</Text>
            </TouchableOpacity>

            {showDetails && (
              <View style={styles.realisasiDetails}>
                <Text style={styles.detailsText}>Usulan Kuantitas: {usulanKuantitas} Laporan</Text>
                <Text style={styles.detailsText}>Persetujuan Kuantitas: {usulanKuantitas} Laporan</Text>
                <Text style={styles.detailsText}>Usulan Kualitas: {usulanKualitas}%</Text>
                <Text style={styles.detailsText}>Persetujuan Kualitas: {usulanKualitas}%</Text>
                <TouchableOpacity style={styles.addDocumentButton} onPress={addDocument}>
                  <Text style={styles.addDocumentButtonText}>Tambah Dokumen</Text>
                </TouchableOpacity>
              </View>
            )}

            {documents.length > 0 && (
              <View style={styles.documentList}>
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Text style={styles.documentText}>{doc.name}</Text>
                    <TouchableOpacity
                      style={styles.chooseFileButton}
                      onPress={async () => {
                        try {
                          const result = await DocumentPicker.pickSingle({
                            type: [DocumentPicker.types.allFiles],
                          });

                          if (result) {
                            const newDocuments = [...documents];
                            newDocuments[index] = { name: result.name, uri: result.uri };
                            setDocuments(newDocuments);
                          }
                        } catch (err) {
                          if (DocumentPicker.isCancel(err)) {
                            console.log('User cancelled the picker');
                          } else {
                            console.error('Document Picker Error:', err);
                            Alert.alert('Error', 'Gagal memilih dokumen.');
                          }
                        }
                      }}
                    >
                      <Text style={styles.chooseFileText}>Choose File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        setDocumentToDelete(index);
                        setIsDeleteModalVisible(true);
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('PersetujuanRealisasi')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('./assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          ListHeaderComponent={TableHeader}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.card}
          ListFooterComponent={
            <View>
              <Text style={styles.pageInfo}>Showing page {currentPage} of {lastPage}</Text>
              <View style={styles.paginationContainer}>
                <View style={styles.paginationButtons}>
                  <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    disabled={currentPage === 1}
                    onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <Text style={styles.pageButtonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pageButton, currentPage === lastPage && styles.disabledButton]}
                    disabled={currentPage === lastPage}
                    onPress={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                  >
                    <Text style={styles.pageButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  Data Sudah Di{' '}
                  <Text style={styles.approvedButtonText}>DISETUJUI ?</Text>
                </Text>
                {isRevisiVisible ? (
                  <View style={styles.revisiContainer}>
                  <View style={styles.revisiSection}>
                    <Text style={styles.revisiTitle}>Catatan Dari:</Text>
                    <Text style={styles.revisiContent}>
                      {catatanRevisi ? catatanRevisi : `Belum Ada Catatan Dari ${namaPengguna}`}
                    </Text>
                  </View>
                  <View style={styles.revisiSection}>
                    <Text style={styles.revisiTitle}>Catatan Untuk {namaPengguna}:</Text>
                    <Text style={styles.revisiContent}>
                      {revisiText ? revisiText : 'Anda Belum Memberikan Revisi.'}
                    </Text>
                    <TextInput
                      style={styles.revisiInput}
                      placeholder="Tulis revisi Anda..."
                      multiline
                      value={revisiText}
                      onChangeText={setRevisiText}
                    />
                  </View>
                <View style={styles.revisiButtons}>
                  <TouchableOpacity
                    style={styles.revisiCancelButton}
                    onPress={() => setIsRevisiVisible(false)}
                  >
                    <Text style={styles.revisiCancelText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleKonfirmasi}
                  >
                    <Text style={styles.confirmButtonText}>KONFIRMASI</Text>
                  </TouchableOpacity>
                </View>
              </View>               
                ) : (
                  <TouchableOpacity
                    style={styles.revisiButton}
                    onPress={() => setIsRevisiVisible(true)}
                  >
                    <Text style={styles.revisiButtonText}>REVISI DATA</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          }
        />
      )}

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Apakah Anda yakin ingin menghapus dokumen ini?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.hapusButton}
                onPress={handleDeleteDocument}
              >
                <Text style={styles.hapusButtonText}>Hapus</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  hapusButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#04d60b',
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  hapusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#d60404',
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  addDocumentButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    alignItems: 'center',
  },
  addDocumentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  documentList: {
    marginTop: 10,
    color: '#000',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
  },
  documentText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  chooseFileButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  chooseFileText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  revisiContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  revisiSection: {
    marginBottom: 20,
  },
  revisiTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 10,
  },
  revisiContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  revisiInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  revisiButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  revisiCancelButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  revisiCancelText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  revisiButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  revisiButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  approvedButton: {
    borderWidth: 2,
    borderColor: '#00a79d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  approvedButtonText: {
    color: '#00a79d',
    fontFamily: 'Poppins-SemiBold',
  },
  errorText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  realisasiButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  realisasiDetails: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  detailsText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
    textAlign: 'left',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  yearContainer: {
    flex: 1,
    marginRight: 10,
  },
  monthContainer: {
    flex: 1,
  },
  separatorLine: {
    height: 3,
    backgroundColor: '#000',
    marginVertical: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Regular',
  },
  expandedLinkText: {
    color: 'blue',
    marginBottom: 5,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    fontFamily: 'Poppins-SemiBold',
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
    marginTop: 1,
    marginLeft: 3,
    marginRight: 1,
    opacity: 0.4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
    marginBottom: 4,
    marginTop: 10,
  },
  headerSubtitle: {
    color: '#000',
    marginLeft: 20,
    marginBottom: 4,
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    maxWidth: '60%',
    marginLeft: 'auto',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    color: '#000',
  },
  filterHeader: {
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  displayContainer: {
    flex: 1,
    maxWidth: '20%',
    marginRight: 10,
  },
  displayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'left',
    color: '#000',
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  dropdownTahun: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  dropdownBulan: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  customFont: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
});