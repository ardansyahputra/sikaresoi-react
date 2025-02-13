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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import useApiClient from '../src/api/apiClient';
import DocumentPicker from 'react-native-document-picker';

export default function RealisasiNext({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showDetails, setShowDetails] = useState({});  // Track details visibility for each item
  const [isRevisiVisible, setIsRevisiVisible] = useState(false);
  const apiClient = useApiClient();





  useEffect(() => {
    fetchData();
  }, [currentPage]); // Tambahkan currentPage sebagai dependensi

  const fetchData = async () => {
    try {
      setLoading(true);

      const payload = {
        bulan_id: 1,
        tahun_id: 3,
        user_jabatan_id: 101,
      };

      const response = await apiClient.post('user/kinerja/list/target/realisasi/index', payload);

      console.log('API Response:', response.data);

      if (response.data && response.data.utama) {
        setData(response.data.utama);
      } else {
        console.error('Invalid response structure:', response.data);
        Alert.alert('Error', 'Data tidak valid dari server.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        Alert.alert('Server Error', `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Error Request:', error.request);
        Alert.alert('Error', 'Tidak ada respons dari server.');
      } else {
        console.error('Error Message:', error.message);
        Alert.alert('Error', 'Terjadi kesalahan saat mengambil data.');
      }
    } finally {
      setLoading(false);
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

  const toggleExpand = id => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const renderItem = ({ item, index }) => {
    const isExpanded = expandedId === item.id;

    // Uraian Kegiatan
    const uraianKegiatan =
      item.target?.list_kinerja?.uraian?.nm_uraian || 'Tidak tersedia';

    // Biaya
    const biaya = item.target?.list_kinerja?.uraian?.biaya ?? 0;

        // Usulan Kuantitas and Kualitas from the item
    const usulanKuantitas = item.usulan_kuantitas || 'Tidak tersedia';
    const usulanKualitas = item.usulan_kualitas || 'Tidak tersedia';

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}
        >
          <Text style={[styles.tableCell, styles.numberCell]}>
            {index + 1}
          </Text>

          {/* Display Uraian Kegiatan */}
          <Text style={[styles.tableCell, styles.nameCell]}>
            {uraianKegiatan}
          </Text>

          {/* Display Biaya */}
          <Text style={[styles.tableCell, styles.nameCell]}>
            {biaya}
          </Text>

          <View style={styles.expandIconCell}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#000"
            />
          </View>
        </TouchableOpacity>
  
        {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Display AK */}
          <Text style={styles.expandedText}>
            AK: {item.target?.list_kinerja?.uraian?.angka_kredit ?? 'Tidak tersedia'}
          </Text>

          {/* Display Kuantitas */}
          <Text style={styles.expandedText}>
            Kuantitas: {item.kuantitas || '-'}
          </Text>

          {/* Display Kualitas */}
          <Text style={styles.expandedText}>
            Kualitas: {item.kualitas || '-'}
          </Text>

          {/* Display BOBOT */}
          <Text style={styles.expandedText}>
            BOBOT: {item.target?.list_kinerja?.bobot || '-'}
          </Text>

          {/* Display STATUS */}
          <Text style={styles.expandedText}>
            STATUS: {item.status ? 'Aktif' : 'Tidak Aktif'}
          </Text>

             {/* Button Realisasi */}
             <TouchableOpacity
            style={styles.realisasiButton}
            onPress={() => setShowDetails(!showDetails)} // Tampilkan/matikan detail saat tombol ditekan
          >
            <Text style={styles.buttonText}>REALISASI</Text>
          </TouchableOpacity>

          {/* Detail tambahan untuk Realisasi */}
          {showDetails && (
            <View style={styles.realisasiDetails}>
              <Text style={styles.detailsText}>
                Usulan Kuantitas: {usulanKuantitas} Laporan
              </Text>
              <Text style={styles.detailsText}>
                Persetujuan Kuantitas: {usulanKuantitas} Laporan
              </Text>
              <Text style={styles.detailsText}>
                Usulan Kualitas: {usulanKualitas}%
              </Text>
              <Text style={styles.detailsText}>
                Persetujuan Kualitas: {usulanKualitas}%
              </Text>
              <Text style={styles.detailsText}>File 1: Download Berkas</Text>
              <Text style={styles.detailsText}>File 2: Download Berkas</Text>
            </View>
          )}
        </View>
      )}
      </View>
      );
    };
  

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Image
            source={require('./assets/images/sikaresoi.png')}
            style={styles.headerImage}
          />
        </View>
        {/* Loading Indicator */}
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
                <Text style={styles.pageInfo}>
                  Showing page {currentPage} of {lastPage}
                </Text>
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
                {/* Footer */}
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
                          Belum Ada Catatan Dari HASTUTY BACHTIAR
                        </Text>
                      </View>
                      <View style={styles.revisiSection}>
                        <Text style={styles.revisiTitle}>
                          Catatan Untuk HASTUTY BACHTIAR:
                        </Text>
                        <Text style={styles.revisiContent}>
                          Anda Belum Memberikan Revisi.
                        </Text>
                        <TextInput
                          style={styles.revisiInput}
                          placeholder="Type your text here..."
                          multiline
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
                          onPress={() => setIsRevisiVisible(false)}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '85%', // Slightly wider modal for better presentation
    backgroundColor: '#fff',
    borderRadius: 15, // Increased corner radius for smooth rounded edges
    padding: 25,
    elevation: 5, // Adds shadow for depth
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow direction
    shadowOpacity: 0.3, // Subtle shadow opacity
    shadowRadius: 10, // More blur to the shadow
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600', // Slightly lighter weight for a modern feel
    color: '#333', // Darker text for contrast
  },
  closeIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', // Subtle background for close button
  },
  modalText: {
    fontSize: 16,
    color: '#555', // Soft gray for text color
    marginBottom: 20,
    lineHeight: 24, // Increase line height for readability
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  hapusButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#04d60b', // Red background for cancel
    borderRadius: 8, // Rounded edges for buttons
    alignItems: 'center', // Centered text
    width: '48%',
  },
  hapusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500', // Lighter font weight for a modern touch
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#d60404', // Red background for cancel
    borderRadius: 8, // Rounded edges for buttons
    alignItems: 'center', // Centered text
    width: '48%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500', // Lighter font weight for a modern touch
  },
  
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3498db', // Blue background for confirm
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 5,
  },

  deleteButtonText: {
    color: '#fff', // White text to stand out on darker button
    fontSize: 16,
    fontWeight: '600', // Slightly bold to make it prominent
    textTransform: 'uppercase', // Capitalized for emphasis
    letterSpacing: 1.2, // Adds space between letters for a sleek look
    textAlign: 'center', // Centers the text
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
    fontFamily: 'Poppins-Regular',
  },
  revisiInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
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
  confirmButton: {
    backgroundColor: '#00a79d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
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
    backgroundColor: '#ffffff', // Keep the white background for a clean look
    padding: 20, // Increased padding for a more spacious look
    borderRadius: 12, // Larger border radius for a modern, rounded effect
    borderWidth: 1, // Border width for definition
    borderColor: '#e0e0e0', // Lighter border color for a subtle look
    marginTop: 15, // Increased margin for better separation from other content
    shadowColor: '#000', // Shadow color for a more 3D effect
    shadowOffset: { width: 0, height: 4 }, // Slight shadow offset for better depth
    shadowOpacity: 0.1, // Reduced opacity for a subtle shadow effect
    shadowRadius: 6, // Blurring the shadow for a smoother look
    elevation: 5, // Shadow effect on Android
  },
  
  detailsText: {
    fontSize: 16, // Slightly larger font size for better readability
    fontWeight: '500', // Make the text a bit bolder for emphasis
    color: '#333', // Dark gray color for the text
    marginBottom: 12, // Increased spacing between lines
    lineHeight: 24, // Improved line height for better readability
    textAlign: 'left', // Left-aligned text for better consistency
    fontFamily: 'Poppins-SemiBold',
  },
  

  buttonText: {
    color: '#fff', // Warna teks putih
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
    fontFamily: 'Poppins-SemiBold',
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
    marginTop:1,
    marginLeft:3,
    marginRight:1,
    opacity: 0.4,
  },

  headerTitle: {
    fontSize: 18,
    color: "#000",
    marginLeft: 20,
    marginBottom: 4, 
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
  },

  headerSubtitle: {
    color: "#000",
    marginLeft: 20,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
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
    maxWidth: '60%', // Batas lebar maksimal
    marginLeft: 'auto', // Sejajar ke kanan jika diperlukan
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
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
    maxWidth: '20%', // Sesuaikan lebar maksimal untuk Display
    marginRight: 10,
  },

  displayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'left', // Teks sejajar kiri
    color: '#000',
    width: '100%', // Isi lebar penuh kontainer
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
