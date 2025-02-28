// Code modification for improved modal and animations

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import useApiClient from '../../../src/api/apiClient';
import RNFS from 'react-native-fs';
import Header from '../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Toast from 'react-native-toast-message';

export default function TugasTambahan({navigation}) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [tanggalPelanggaran, setTanggalPelanggaran] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const apiClient = useApiClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
    {label: 'Januari', value: 1},
    {label: 'Februari', value: 2},
    {label: 'Maret', value: 3},
    {label: 'April', value: 4},
    {label: 'Mei', value: 5},
    {label: 'Juni', value: 6},
    {label: 'Juli', value: 7},
    {label: 'Agustus', value: 8},
    {label: 'September', value: 9},
    {label: 'Oktober', value: 10},
    {label: 'November', value: 11},
    {label: 'Desember', value: 12},
  ];

  const yearData = [
    {label: '2020', value: '2020'},
    {label: '2021', value: '2021'},
    {label: '2022', value: '2022'},
    {label: '2023', value: '2023'},
    {label: '2024', value: '2024'},
    {label: '2025', value: '2025'},
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
      console.log('File berhasil disimpan ke:', filePath);

      setModalMessage('Laporan berhasil diunduh ke perangkat');
      Toast.show({
        type: 'success',
        text1: 'Sukses',
        text2: 'Laporan berhasil diunduh ke perangkat',
      });

      try {
        const canOpen = await Linking.canOpenURL(`file://${filePath}`);
        if (canOpen) {
          await Linking.openURL(`file://${filePath}`);
        } else {
          const fileUri = `content://com.android.providers.downloads.documents/document/raw:${filePath}`;
          await Linking.openURL(fileUri);
        }
      } catch (openError) {
        console.error('Gagal membuka file:', openError);
        setModalMessage(
          'Laporan berhasil diunduh tetapi gagal dibuka secara otomatis. Silakan buka file secara manual dari folder Download.',
        );
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setModalMessage('Terjadi kesalahan saat mengunduh laporan');
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Terjadi kesalahan saat mengunduh laporan',
      });
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

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.container}>
      <Header title="Download Laporan" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        {/* Card Download Laporan */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={[GlobalStyle.SemiBold, styles.cardTitle]}>
              Download Laporan Absensi
            </Text>
          </View>
          <View style={styles.cardDivider}></View>

          <TouchableOpacity
            style={[
              GlobalStyle.SemiBold,
              styles.input,
              focusState.tanggalPelanggaran && styles.inputFocused, // Tambahkan efek focus
              tanggalPelanggaran && styles.inputFilled,
              styles.input,
            ]}
            onPress={toggleDatePicker}
            activeOpacity={0.7} // Beri efek saat ditekan
            onPressIn={() => handleFocus('tanggalPelanggaran')} // Simulasikan fokus saat ditekan
            onPressOut={() => handleBlur('tanggalPelanggaran')} // Simulasikan blur saat dilepas
          >
            <Text
              style={[
                GlobalStyle.SemiBold,
                {color: tanggalPelanggaran ? '#333' : '#B0B0B0'},
              ]}>
              {tanggalPelanggaran || 'Pilih Tanggal'}
            </Text>
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
            <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
              Download Laporan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Laporan Perbulan */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={[GlobalStyle.SemiBold, styles.cardTitle]}>
              Laporan Perbulan
            </Text>
          </View>
          <View style={styles.cardDivider}></View>

          <Text style={[GlobalStyle.SemiBold, styles.label]}>
            Pilih Bulan *
          </Text>
          <Dropdown
            style={[
              GlobalStyle.SemiBold,
              styles.dropdown,
              focusState.selectedMonth && styles.inputFocused, // Tambahkan efek focus
              selectedMonth && styles.inputFilled, // Tambahkan efek jika sudah terisi
            ]}
            data={monthData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Bulan"
            placeholderStyle={{
              ...GlobalStyle.SemiBold,
              color: '#B0B0B0',
              fontSize: 14,
            }}
            selectedTextStyle={[
              GlobalStyle.SemiBold,
              {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
            ]}
            itemTextStyle={{...GlobalStyle.SemiBold, fontSize: 14}}
            value={selectedMonth}
            onChange={item => {
              setSelectedMonth(item.value);
              console.log('Bulan yang dipilih:', item.value);
            }}
          />

          <Text style={[GlobalStyle.SemiBold, styles.label]}>
            Pilih Tahun *
          </Text>
          <Dropdown
            style={[
              GlobalStyle.SemiBold,
              styles.dropdown,
              focusState.selectedYear && styles.inputFocused, // Tambahkan efek focus
              selectedYear && styles.inputFilled, // Tambahkan efek jika sudah terisi
            ]}
            data={yearData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tahun"
            placeholderStyle={{
              ...GlobalStyle.SemiBold,
              color: '#B0B0B0',
              fontSize: 14,
            }}
            selectedTextStyle={[
              GlobalStyle.SemiBold,
              {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
            ]}
            itemTextStyle={{...GlobalStyle.SemiBold, fontSize: 14}}
            value={selectedYear}
            onChange={item => {
              setSelectedYear(item.value);
              console.log('Tahun yang dipilih:', item.value);
            }}
          />

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadLaporan}>
            <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
              Download Laporan
            </Text>
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
  container: {flex: 1, backgroundColor: '#FFF'},

  content: {flex: 1},
  contentContainer: {padding: 10},
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
  cardTitle: {fontSize: 16},
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
  label: {marginBottom: 8, fontSize: 14, color: '#555'},
  downloadButton: {
    backgroundColor: '#3699FE',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {color: '#FFF', fontSize: 16},
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
  modalMessage: {fontSize: 16, marginBottom: 20},
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {color: '#FFF', fontSize: 16},
  dropdown: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginBottom: 20,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
  },
  inputFocused: {
    borderRadius: 5, // Border radius saat fokus
    borderColor: '#75BAFF',
    borderWidth: 1.5,
  },
  inputFilled: {
    backgroundColor: '#F2F8FF', // Background lebih gelap saat terisi
    borderRadius: 5, // Hilangkan border radius
    padding: 10,
  },
});
