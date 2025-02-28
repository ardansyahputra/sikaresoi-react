import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Modal, ActivityIndicator, ScrollView,
  Image, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import Icon from 'react-native-vector-icons/Ionicons'; // Pastikan Anda telah menginstal react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import useApiClient from '../../../../src/api/apiClient';
import { toastConfig, Toast } from '../../../../src/utils/CustomToast';
import {API_URL} from '@env';


const KontrakKerja = () => {
  const [postData, setPostData] = useState({ tahun_id: '' });
  const [listTahun, setListTahun] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [userJabatanData, setUserJabatanData] = useState(null);
  const navigation = useNavigation();
  const apiClient = useApiClient();
  const showToast = (type, text1, text2) => {
        Toast.show({
          type,
          text1,
          text2,
        });
      };

  useEffect(() => {
      fetchYears();
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
            setSelectedYear(null);
            setPdfUrl('');
          } else {
            console.error('Failed to load year options:', response);
            showToast('erro','Error', 'Gagal memuat data tahun.');
          }
        } catch (error) {
          console.error('Error fetching years:', error);
          showToast('error', 'Error',  'Gagal memuat data tahun')
        } finally {
          setLoading(false);
        }
      };

  const handleSelectTahun = (value) => {
    setSelectedYear(value); // Update selectedYear with the selected year ID
    setPdfUrl('');
    if (value) {
      generatePdfUrl(value);
    }
  };

  const generatePdfUrl = (value) => {
    const url = `${API_URL}report/kontrak_kinerja/${userJabatanData.uuid}?type=stream&keuangan=0&tahun_id=${value}`;
    setPdfUrl(url);
  };
  
  const downloadAndOpenPdf = async () => {
    if (!pdfUrl) {
      showToast('error', 'Error', 'Tidak ada file PDF untuk diunduh.');
      return;
    }
  
    const fileName = `kontrak_kinerja_${selectedYear}.pdf`; // Use selectedYear instead of postData.tahun_id
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
  
    try {
      setLoading(true);
  
      const response = await fetch(pdfUrl, { method: 'GET' });
  
      if (!response.ok) {
        showToast('error', 'Gagal', response.status);
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
        showToast('succes', 'Sukses', response.data.message);
        FileViewer.open(filePath);
      };
  
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error downloading file:", error);
      showToast('error', 'Error', error.message);
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
        <Text style={styles.headerTitle}>Laporan Kontrak Kerja</Text>
      </View>
      </View>

      

      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Pilih Tahun <Text style={styles.required}>*</Text>:
              </Text>
              {/* <Dropdown
                          style={styles.dropdown}
                          data={yearOptions}
                          labelField="label"
                          valueField="value"
                          value={selectedYear}
                          onChange={item => setSelectedYear(item.value)}
                        /> */}
              <Dropdown
                data={listTahun}
                labelField="label"
                valueField="value"
                value={selectedYear}
                onChange={(item) => handleSelectTahun(item.value)}
                placeholder="-- PILIH TAHUN --"
                style={styles.dropdown}
                labelStyle={styles.dropdownLabel}
                selectedTextStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                itemTextStyle={styles.dropdownItemText}
                itemStyle={styles.dropdownItemText}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : pdfUrl ? (
              <TouchableOpacity
                onPress={downloadAndOpenPdf}
                style={styles.downloadButtonContainer}>
                <Text style={styles.downloadButtonText}>Unduh PDF</Text>
              </TouchableOpacity>
            ) : (
             selectedYear && <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan.</Text>
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
