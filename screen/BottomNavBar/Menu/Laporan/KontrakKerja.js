import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Modal,  ScrollView,
  Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import Icon from 'react-native-vector-icons/Ionicons'; // Pastikan Anda telah menginstal react-native-vector-icons
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const KontrakKerja = ({ navigation }) => {
  const [postData, setPostData] = useState({ tahun_id: '' });
  const [listTahun, setListTahun] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    const tahunData = [
      { id: 1, tahun: '2020' },
      { id: 2, tahun: '2021' },
      { id: 3, tahun: '2022' },
      { id: 4, tahun: '2023' },
      { id: 5, tahun: '2024' },
      { id: 6, tahun: '2025' },
    ];
    setListTahun(tahunData);
  }, []);

  const handleSelectTahun = (value) => {
    setPostData((prevData) => ({ ...prevData, tahun_id: value }));
    setPdfUrl('');
    if (value) {
      generatePdfUrl(value);
    }
  };

  const generatePdfUrl = (tahunId) => {
    const url = `http://192.168.60.176:8000/report/kontrak_kinerja/0a4df7b9-7962-457c-bd47-23ce9a50a02d?type=stream&keuangan=0&tahun_id=${tahunId}`;
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

      const downloadResult = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: filePath,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Unduh PDF ${progress.toFixed(2)}% selesai.`);
        },
      }).promise;

      if (downloadResult.statusCode === 200) {
              setSuccessModalVisible(true); // Menampilkan modal sukses
              FileViewer.open(filePath);
            } else {
              throw new Error(`Gagal mengunduh file. Kode status: ${downloadResult.statusCode}`);
            }
          } catch (error) {
            setErrorMessage(error.message || 'Terjadi kesalahan saat mengunduh file.');
          } finally {
            setLoading(false);
          }
        };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={26} color="#000" />
            </TouchableOpacity>
            <Image
              source={require('../../../assets/images/sikaresoi.png')}
              style={styles.headerImage}
            />
    </View>

    <View style={{ flex: 1, padding: 20 }}>
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
              onChange={(item) => handleSelectTahun(item.id)}
              placeholder="-- PILIH TAHUN --"
              placeholderStyle={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}
              style={styles.dropdown}
              labelStyle={{ fontFamily: 'Poppins-Regular', fontSize: 14 }} // Apply Poppins font to label
              itemTextStyle={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}
            />
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Memuat data...</Text>
          ) : pdfUrl ? (
            <Button title="Unduh PDF" onPress={downloadAndOpenPdf} />
          ) : (
            postData.tahun_id && <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan.</Text>
          )}
        </View>
      </View>

      {/* Modal Loading */}
      <Modal transparent={true} visible={loading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Sedang Memuat...</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={successModalVisible} animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Icon name="checkmark-circle" size={64} color="green" />
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
    flexGrow: 1,
    padding: 0,
    backgroundColor: "#f7f7f7",
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-SemiBold',
  },
  dropdownText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 20,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
  },
  noDataText: {
    marginTop: 20,
    color: '#4B5563',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
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
    padding: 80,
    borderRadius: 10,
    alignItems: 'center',
  },

  successText: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
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
});

export default KontrakKerja;