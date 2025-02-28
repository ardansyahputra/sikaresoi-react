import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { toastConfig, Toast } from '../src/utils/CustomToast';
import useApiClient from '../src/api/apiClient';
import { APP_URL } from '@env';

const PencapaianKerja = () => {
  const [postData, setPostData] = useState({ tahun_id: '', bulan_id: '' });
  const [userJabatanData, setUserJabatanData] = useState(null);
  const [listTahun, setListTahun] = useState([]);
  const [listBulan, setListBulan] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const apiClient = useApiClient();
  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };
  const navigation = useNavigation();

  useEffect(() => {
    fetchYears();
    fetchMonths();
    fetchUserJabatanData();
  }, []);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      if (response?.data?.data) {
        setUserJabatanData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
    }
  };

  const fetchYears = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('tahun/show');
      if (response?.data?.data) {
        const years = response.data.data.map(year => ({
          label: year.tahun.toString(),
          value: year.id,
        }));
        setListTahun(years);
      } else {
        console.error('Failed to load year options:', response);
        showToast('error', 'Error', 'Gagal memuat data tahun.');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
      showToast('error', 'Error', 'Gagal memuat data tahun');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonths = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('bulan/show');
      if (response?.data?.data) {
        const months = response.data.data.map(month => ({
          label: month.bulan.toString(),
          value: month.id,
        }));
        setListBulan(months);
      } else {
        Alert.alert('Error', 'Gagal memuat data bulan.');
      }
    } catch (error) {
      console.error('Error fetching month:', error);
      showToast('error','Error', 'Gagal memuat data bulan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTahun = (item) => {
    setPostData((prevData) => ({ ...prevData, tahun_id: item.value }));
  };

  const handleSelectBulan = (item) => {
    setPostData((prevData) => ({ ...prevData, bulan_id: item.value }));
  };

  const generatePdfUrl = (tahunId, bulanId) => {
    const url = `${APP_URL}report/capaian_kinerja?type=stream&bulan_id=${bulanId}&tahun_id=${tahunId}&user_jabatan_id=${userJabatanData.uuid}`;
    setPdfUrl(url);
    return url;
  };

  const downloadAndOpenPdf = async () => {
    const fileUrl = generatePdfUrl(postData.tahun_id, postData.bulan_id);
    if (!fileUrl) {
      showToast('info', 'Peringatan', 'Tidak ada file PDF untuk diunduh');
      return;
    }

    const fileName = `kontrak_kinerja_${postData.tahun_id}.pdf`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      setLoading(true);

      console.log("Downloading:", fileUrl);
      const response = await fetch(fileUrl, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Gagal mengunduh file. Kode status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType.includes('application/pdf')) {
        showToast('info', 'Peringatan', 'Tidak ada file PDF untuk diunduh');
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        await RNFS.writeFile(filePath, base64data, 'base64');
        console.log("File downloaded:", filePath);
        showToast('success', 'Sukses', 'File berhasil diunduh' );
        FileViewer.open(filePath);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error downloading file:", error);
      showToast('error', 'Gagal', error.message);
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
        <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Laporan Capaian Kerja</Text>
      </View>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Pilih Tahun dan Bulan<Text style={styles.required}>*</Text>:
              </Text>

              <View style={styles.dropdownRows}>
                <Dropdown
                  data={listTahun}
                  labelField="label"
                  valueField="value"
                  value={postData.tahun_id}
                  onChange={handleSelectTahun}
                  placeholder="-- PILIH TAHUN --"
                  style={styles.dropdown}
                  labelStyle={styles.dropdownLabel}
                  selectedTextStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  itemTextStyle={styles.dropdownItemText}
                />
                <Dropdown
                  data={listBulan}
                  labelField="label"
                  valueField="value"
                  value={postData.bulan_id}
                  onChange={handleSelectBulan}
                  placeholder="-- PILIH BULAN --"
                  style={styles.dropdown}
                  labelStyle={styles.dropdownLabel}
                  selectedTextStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  itemTextStyle={styles.dropdownItemText}
                />
              </View>
            </View>

            {postData.tahun_id && postData.bulan_id ? (
              <TouchableOpacity style={styles.button} onPress={downloadAndOpenPdf}>
                <Text style={styles.buttonText}>Unduh PDF</Text>
              </TouchableOpacity>
            ) : (
              postData.tahun_id && <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan.</Text>
            )}
          </View>
        </View>
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
    backgroundColor: '#ffffff',
    paddingRight: 18,
    paddingLeft: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: '#000',
  },
  backButton: {
    marginTop:1,
    marginLeft:3,
    marginRight:1,
    opacity: 0.4,
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
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'green',
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  // Tambahkan 
  row: {
    marginBottom: 20,
  },
  dropdownRows: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
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
    flex: 1,
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
    fontFamily: 'Poppins-Regular',
  },
  noDataText: {
    marginTop: 20,
    color: '#4B5563',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  pdfView: {
    marginTop: 20,
    height: 500,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25, // Menambahkan jarak ke kiri
    marginTop: 20,
    marginBottom: -8,
  },

  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#000",
  },

  separatorText: {
    fontSize: 20,
    color: "#000",
    marginBottom: 3,
  },

  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#000",
    marginLeft: 0,
  },
  button: {
    backgroundColor: '#007BFF', // Warna latar belakang tombol
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold', // Menggunakan font Poppins-SemiBold
    fontSize: 16,
    color: '#FFF', // Warna teks tombol
  },
  dropdownRows: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  dropdown: {
    flex: 1,
    marginTop: 10,
    height: 50,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  dropdownLabel: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 16,
    color: '#000', 
  },
  dropdownText: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 15,
    color: '#000', // 
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 14,
    color: '#000',
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#000',
  },
});

export default PencapaianKerja;
