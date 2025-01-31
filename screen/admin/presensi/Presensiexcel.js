// Code modification for improved modal and animations

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import useApiClient from '../../../src/api/apiClient';
import RNFS from 'react-native-fs';

export default function TugasTambahan({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [tanggalPelanggaran, setTanggalPelanggaran] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const apiClient = useApiClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await apiClient(`/user_master/show`);
        const data = response.data || (await response.json());
        console.log('Received Data:', data);
      } catch (error) {
        console.error('Error fetching signature data:', error);
      }
    };
    fetchSignatures();
  }, []);

  const monthData = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 },
  ];

  const yearData = [
    { label: '2020', value: '2020' },
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  const downloadLaporan = async () => {
    const payload = {
      tanggal: tanggalPelanggaran,
      bulan: selectedMonth,
      tahun: selectedYear,
    };

    console.log('Payload yang dikirim:', payload);

    try {
      const response = await apiClient.post('/laporan/absensi_bulan', payload, {
        responseType: 'arraybuffer',
      });

      const base64Data = arrayBufferToBase64(response.data);

      const filePath = `${RNFS.DownloadDirectoryPath}/Laporan_Absensi_${selectedMonth}_${selectedYear}.xlsx`;

      await RNFS.writeFile(filePath, base64Data, 'base64');

      setModalMessage('Laporan berhasil diunduh ke perangkat');
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error downloading report:', error);
      setModalMessage('Terjadi kesalahan saat mengunduh laporan');
      setIsModalVisible(true);
    }
  };

  const arrayBufferToBase64 = buffer => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleDateChange = date => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggalPelanggaran(formattedDate);
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        {/* Card Download Laporan */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Download Laporan Absensi</Text>
          </View>
          <View style={styles.cardDivider}></View>

          <TouchableOpacity style={styles.input} onPress={toggleDatePicker}>
            <Text>{tanggalPelanggaran || 'Pilih Tanggal'}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DatePicker
              mode="calendar"
              onDateChange={handleDateChange}
              options={{
                textHeaderColor: '#007BFF',
                textDefaultColor: '#333',
                selectedTextColor: '#FFF',
                mainColor: '#007BFF',
                textSecondaryColor: '#B0B0B0',
                borderColor: 'rgba(122, 146, 165, 0.1)',
              }}
            />
          )}

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadLaporan}>
            <Text style={styles.buttonText}>Download Laporan</Text>
          </TouchableOpacity>
        </View>

        {/* Card Laporan Perbulan */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Laporan Perbulan</Text>
          </View>
          <View style={styles.cardDivider}></View>

          <Text style={styles.label}>Pilih Bulan *</Text>
          <Dropdown
            style={styles.dropdown}
            data={monthData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Bulan"
            value={selectedMonth}
            onChange={item => {
              setSelectedMonth(item.value);
              console.log('Bulan yang dipilih:', item.value);
            }}
          />

          <Text style={styles.label}>Pilih Tahun *</Text>
          <Dropdown
            style={styles.dropdown}
            data={yearData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tahun"
            value={selectedYear}
            onChange={item => {
              setSelectedYear(item.value);
              console.log('Tahun yang dipilih:', item.value);
            }}
          />

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadLaporan}>
            <Text style={styles.buttonText}>Download Laporan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal untuk Pesan Sukses/Error */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E7E9F1' },
  header: {
    backgroundColor: '#FFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  contentContainer: { padding: 10 },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  cardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    marginVertical: 10,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    marginBottom: 15,
  },
  label: { marginBottom: 8, fontSize: 14, color: '#555' },
  downloadButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: '#FFF', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  modalMessage: { fontSize: 16, marginBottom: 20 },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: { color: '#FFF', fontSize: 16 },
  dropdown: {
    height: 50,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
