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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

export default function RealisasiNext({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showDetails, setShowDetails] = useState({});  // Track details visibility for each item
  const [isRevisiVisible, setIsRevisiVisible] = useState(false);




  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      const payload = {
        bulan_id: 1,
        tahun_id: 3,
        user_jabatan_id: 101,
      };
  
      const response = await axios.post(
        'http://192.168.60.176:8000/api/v1/user/kinerja/list/target/realisasi/index',
        payload, // Kirim payload di sini
        {
          headers: {
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE3Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM3NTA4NDQwLCJleHAiOjE3Mzc1MTI5NDUsIm5iZiI6MTczNzUwOTM0NSwianRpIjoiWmtHaWpESUhUTFRsN3J6diIsInN1YiI6OCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.dq5LhVdmRfwk9TmSW3zZkBKvgzI9_Too_DH_K1UKGCE',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );
  
      console.log('API Response:', response.data);
  
      if (response.data && response.data.utama) {
        setData(response.data.utama);
      } else {
        Alert.alert('Error', 'Data tidak valid.');
        console.error('Invalid response structure:', response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      } else if (error.request) {
        console.error('Error Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      Alert.alert('Error', 'Gagal mengambil data.');
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  revisiContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },

  errorText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
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
  },
  

  buttonText: {
    color: '#fff', // Warna teks putih
    fontSize: 16,
    fontWeight: 'bold',
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },

  backButton: {
    marginRight: 16,
  },

  headerImage: {
    width: '45%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
    marginBottom: 4, 
    marginTop: 10,
  },

  headerSubtitle: {
    color: "#000",
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
