import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/Ionicons'; // Pastikan Anda telah menginstal react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const KontrakKerja = () => {
  const [postData, setPostData] = useState({tahun_id: ''});
  const [listTahun, setListTahun] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const tahunData = [
      {id: 1, tahun: '2020'},
      {id: 2, tahun: '2021'},
      {id: 3, tahun: '2022'},
      {id: 4, tahun: '2023'},
      {id: 5, tahun: '2024'},
      {id: 6, tahun: '2025'},
    ];
    setListTahun(tahunData);
  }, []);

  const handleSelectTahun = value => {
    setPostData(prevData => ({...prevData, tahun_id: value}));
    setPdfUrl('');
    if (value) {
      generatePdfUrl(value);
    }
  };

  const generatePdfUrl = tahunId => {
    const url = `http://192.168.60.216:8000/report/kontrak_kinerja/0a4df7b9-7962-457c-bd47-23ce9a50a02d?type=stream&keuangan=0&tahun_id=${tahunId}`;
    setPdfUrl(url);
  };

  const downloadAndOpenPdf = async () => {
    if (!pdfUrl) {
      Alert.alert('Error', 'Tidak ada file PDF untuk diunduh.');
      return;
    }

    const fileName = `kontrak_kinerja_${postData.tahun_id}.pdf`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      setLoading(true);

      const response = await fetch(pdfUrl, {method: 'GET'});

      if (!response.ok) {
        throw new Error(
          `Gagal mengunduh file. Kode status: ${response.status}`,
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType.includes('application/pdf')) {
        setShowNotFoundModal(true);
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        await RNFS.writeFile(filePath, base64data, 'base64');
        console.log('File downloaded:', filePath);
        setSuccessModalVisible(true);
        FileViewer.open(filePath);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error downloading file:', error);
      setErrorMessage(
        error.message || 'Terjadi kesalahan saat mengunduh file.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Laporan Kontrak Kerja</Text>
        <Text style={styles.separatorText}> • </Text>
        <Text style={styles.headerSubtitle}>Kontrak Kerja</Text>
      </View>

      <View style={{flex: 1, padding: 20}}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Pilih Tahun <Text style={styles.required}>*</Text>:
              </Text>
              <Dropdown
                data={listTahun}
                labelField="tahun"
                valueField="id"
                value={postData.tahun_id}
                onChange={item => handleSelectTahun(item.id)}
                placeholder="-- PILIH TAHUN --"
                style={styles.dropdown}
                labelStyle={styles.dropdownLabel} // Label font Poppins
                selectedTextStyle={styles.dropdownText} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
              />
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loader}
              />
            ) : pdfUrl ? (
              <TouchableOpacity
                onPress={downloadAndOpenPdf}
                style={styles.downloadButtonContainer}>
                <Text style={styles.downloadButtonText}>Unduh PDF</Text>
              </TouchableOpacity>
            ) : (
              postData.tahun_id && (
                <Text style={styles.noDataText}>
                  Tidak ada data untuk ditampilkan.
                </Text>
              )
            )}
          </View>
        </View>

        {/* Modal Loading */}
        <Modal transparent={true} visible={loading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{marginTop: 10, fontFamily: 'Poppins-Regular'}}>
                Sedang Memuat...
              </Text>
            </View>
          </View>
        </Modal>

        {/* Modal File Not Found */}
        <Modal
          transparent={true}
          visible={showNotFoundModal}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon name="close-circle-sharp" size={90} color="red" />
              <Text style={styles.succesText}>File tidak ditemukan</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNotFoundModal(false)}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Success */}
        <Modal
          transparent={true}
          visible={successModalVisible}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon name="checkmark-circle-sharp" size={90} color="green" />
              <Text style={styles.successText}>Unduhan Selesai!</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSuccessModalVisible(false)}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: {
    flexDirection: 'column',
  },
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  required: {
    color: 'red',
  },
  dropdown: {
    marginTop: 10,
    height: 50,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 20,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  noDataText: {
    marginTop: 20,
    color: '#4B5563',
    fontSize: 14,
  },
  pdfView: {
    marginTop: 20,
    height: 500,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    fontFamily: 'Poppins-SemiBold',
  },

  succesText: {
    marginTop: 10,
    fontSize: 18,
    color: 'red',
    fontFamily: 'Poppins-SemiBold',
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25, // Menambahkan jarak ke kiri
    marginTop: 20,
    marginBottom: -8,
  },

  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: '#000',
  },

  separatorText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 3,
  },

  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000',
    marginLeft: 0,
  },
  downloadButtonContainer: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular', // Poppins untuk teks item
    fontSize: 14,
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-Regular', // Placeholder font Poppins
    fontSize: 14,
  },

  dropdownLabel: {
    fontFamily: 'Poppins-SemiBold', // Label font Poppins
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Optional: Adjust positioning
  },
});

export default KontrakKerja;
