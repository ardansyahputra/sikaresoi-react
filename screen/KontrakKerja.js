import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import { WebView } from 'react-native-webview';

const KontrakKerja = () => {
  const [postData, setPostData] = useState({ tahun_id: '' });
  const [listTahun, setListTahun] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // Bearer token
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIxNjo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM3NTk1Mjc1LCJleHAiOjE3Mzc2MDEzNzEsIm5iZiI6MTczNzU5Nzc3MSwianRpIjoidFZJcWVaemNPU3poQzhWOSIsInN1YiI6MjAsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5OWVhHXNu5_Gl47GhFzADVl2YKeeoDei1uNlGQm1LVA'; // Ganti dengan token yang sesuai

  useEffect(() => {
    // Data tahun sebagai contoh
    const tahunData = [
      { id: 2020, tahun: '2020' },
      { id: 2021, tahun: '2021' },
      { id: 2022, tahun: '2022' },
      { id: 2023, tahun: '2023' },
      { id: 2024, tahun: '2024' },
      { id: 2025, tahun: '2025' },
    ];
    setListTahun(tahunData);
  }, []);

  const handleSelectTahun = (value) => {
    setPostData((prevData) => ({ ...prevData, tahun_id: value }));
    setPdfUrl(''); // Reset PDF URL saat memilih tahun baru
    if (value) {
      getDataKontrakKerja(value);
    }
  };

  const getDataKontrakKerja = async (tahunId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://192.168.60.216:8000/user/laporan/kontrak_kerja', // Ganti URL jika perlu
        {
          params: { tahun: tahunId },
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data && response.data.pdf_url) {
        setPdfUrl(response.data.pdf_url);
      } else {
        throw new Error('PDF tidak ditemukan untuk tahun ini.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan saat memuat data.');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              style={styles.dropdown}
            />
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Memuat data...</Text>
          ) : pdfUrl ? (
            <WebView source={{ uri: pdfUrl }} style={styles.pdfView} />
          ) : (
            postData.tahun_id && <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan.</Text>
          )}
        </View>
      </View>

      {/* AwesomeAlert */}
      <AwesomeAlert
        show={alertVisible}
        showProgress={false}
        title="Pemberitahuan"
        message={errorMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default KontrakKerja;
