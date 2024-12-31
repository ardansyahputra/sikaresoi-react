import React, { useState, useEffect } from 'react';
import {
View,Text,StyleSheet,Linking,TouchableOpacity,Modal,Image,ScrollView,}
from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Laporan() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonthReport, setSelectedMonthReport] = useState(null);
  const [selectedYearReport, setSelectedYearReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isMonthYearOpenTugas, setIsMonthYearOpenTugas] = useState(false); // State untuk toggle dropdown Tugas
  const [isMonthYearOpenCapaian, setIsMonthYearOpenCapaian] = useState(false); // State untuk toggle dropdown Capaian Kinerja

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

  useEffect(() => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setSelectedMonthReport(null);
    setSelectedYearReport(null);
  }, []);

  const handleDownload = async () => {
    if (!selectedMonth && !selectedYear && !selectedMonthReport && !selectedYearReport) {
      setModalMessage('Harap pilih bulan dan tahun untuk salah satu laporan!');
      setIsModalVisible(true);
      return;
    }

    let capaianKinerjaUrl = '';
    let rekapitulasiUrl = '';

    // Jika bulan dan tahun "Laporan Rekapitulasi Tugas Tambahan" diisi
    if (selectedMonth && selectedYear) {
      capaianKinerjaUrl = `http://192.168.61.163:8000/report/admin/tugas_tambahan/${selectedMonth}/${selectedYear}`;
    } if (selectedMonthReport && selectedYearReport) {
      rekapitulasiUrl = `http://192.168.61.163:8000/report/admin/rekapitulasi/${selectedMonthReport}/${selectedYearReport}`;
    } if (!capaianKinerjaUrl && !rekapitulasiUrl) {
      setModalMessage('Harap pilih bulan dan tahun untuk laporan yang ingin di-download!');
      setIsModalVisible(true);
      return;
    } return { capaianKinerjaUrl, rekapitulasiUrl };
};

const onPressDownload = async (type) => {
    const urls = await handleDownload();
    if (urls) {
      // Pilih API yang akan dipanggil berdasarkan parameter 'type'
      const url = type === 'rekapitulasi' ? urls.rekapitulasiUrl : urls.capaianKinerjaUrl;

      if (url) {
        Linking.openURL(url);
      } else {
        setModalMessage('Tidak ada laporan yang dapat didownload');
        setIsModalVisible(true);
      }
    }
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Breadcrumbs */}
      <View style={styles.breadcrumbsContainer}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.boldText}>Admin</Text> {'-'} Report
        </Text>
      </View>

      <View style={styles.containers}>
  <View style={styles.content}>
        <Text style={styles.laporanjudul}>
          Laporan
        </Text>

    {/* Dropdown untuk Laporan Rekapitulasi Tugas Tambahan */}
    <View style={styles.dropdownWrapperTitle}>
      <TouchableOpacity
        onPress={() => setIsMonthYearOpenTugas(!isMonthYearOpenTugas)}
        style={styles.titleWrapper}>
        <Text style={styles.reportTitle}>
          Laporan Rekapitulasi Tugas Tambahan
        </Text>
        <Icon
          name={isMonthYearOpenTugas ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="black"
          style={styles.iconStyle}
        />
      </TouchableOpacity>
      {isMonthYearOpenTugas && (
        <View style={styles.formContainer}>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Pilih Bulan *</Text>
            <Dropdown
              style={styles.dropdown}
              data={monthData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              value={selectedMonth}
              onChange={item => setSelectedMonth(item.value)}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Pilih Tahun *</Text>
            <Dropdown
              style={styles.dropdown}
              data={yearData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Tahun"
              value={selectedYear}
              onChange={item => setSelectedYear(item.value)}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => onPressDownload('capaianKinerja')}>
            <Text style={styles.downloadButtonText}>
              Download Laporan Capaian Kinerja
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    <View style={styles.dropdownWrapperTitle}>
      <TouchableOpacity
        onPress={() => setIsMonthYearOpenTugas(!isMonthYearOpenTugas)}
        style={styles.titleWrapper}>
        <Text style={styles.reportTitle}>
          Renumerasi
        </Text>
        <Icon
          name={isMonthYearOpenTugas ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="black"
          style={styles.iconStyle}
        />
      </TouchableOpacity>
      {isMonthYearOpenTugas && (
        <View style={styles.formContainer}>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Pilih Bulan *</Text>
            <Dropdown
              style={styles.dropdown}
              data={monthData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              value={selectedMonth}
              onChange={item => setSelectedMonth(item.value)}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Pilih Tahun *</Text>
            <Dropdown
              style={styles.dropdown}
              data={yearData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Tahun"
              value={selectedYear}
              onChange={item => setSelectedYear(item.value)}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => onPressDownload('capaianKinerja')}>
            <Text style={styles.downloadButtonText}>
              Download Laporan Capaian Kinerja
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    
    {/* Dropdown untuk Report Rekapitulasi Capaian Kinerja */}
    <View style={styles.dropdownWrapperTitle}>
      <TouchableOpacity
        onPress={() => setIsMonthYearOpenCapaian(!isMonthYearOpenCapaian)}
        style={styles.titleWrapper}>
        <Text style={styles.reportTitle}>
          Report Rekapitulasi Capaian Kinerja
        </Text>
        <Icon
          name={isMonthYearOpenCapaian ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="black"
          style={styles.iconStyles}
        />
      </TouchableOpacity>
      {isMonthYearOpenCapaian && (
        <View style={styles.formContainer}>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Pilih Bulan *</Text>
            <Dropdown
              style={styles.dropdown}
              data={monthData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              value={selectedMonthReport}
              onChange={item => setSelectedMonthReport(item.value)}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>

          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Pilih Tahun *</Text>
            <Dropdown
              style={styles.dropdown}
              data={yearData}
              labelField="label"
              valueField="value"
              placeholder="Pilih Tahun"
              value={selectedYearReport}
              onChange={item => setSelectedYearReport(item.value)}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => onPressDownload('rekapitulasi')}>
            <Text style={styles.downloadButtonText}>
              Download Laporan Rekapitulasi Excel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
</View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E7E9F1'},
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  containers:  {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    marginTop: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  breadcrumbsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8, 
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: -15,
  },
  breadcrumbText: {
    fontSize: 14  ,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',  // Menambahkan bold di sini
  },
  laporanjudul: {
    fontWeight: 'bold',  // Menambahkan bold di sini
    fontSize: 24,
    marginBottom:20,
    marginTop:-20
  },
  content: {flex: 1, paddingHorizontal: 1, paddingVertical: 30},
  dropdownWrapperTitle: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  iconStyle: {
    marginLeft: 10,
  },
  iconStyles: {
    marginLeft: 30,
  },
  formContainer: {marginTop: 10},
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dropdownWrapper: {
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#888',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  dropdownStyle: {
    borderRadius: 8,
    padding: 10,
  },
  downloadButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#f76c6c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});