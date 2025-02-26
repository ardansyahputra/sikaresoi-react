import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
  ScrollView,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import useApiClient from '../../../../src/api/apiClient';
import {APP_URL} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';


export default function TunjanganTambahan({navigation}) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [taxReduction, setTaxReduction] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');
  const [leftSignature, setLeftSignature] = useState('');
  const [rightSignature, setRightSignature] = useState('');
  const [signatures, setSignatures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedAllowance, setSelectedAllowance] = useState(null);
  const [isP2Pure, setIsP2Pure] = useState(false);
  const [percentage, setPercentage] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await apiClient(`/user_master/show`);
        const data = response.data || (await response.json());

        if (data && data.res.code === 200) {
          const signatureData = data.data.map(user => ({
            label: user.name,
            value: user.id,
          }));
          setSignatures(signatureData);
        }
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

  const taxReductionData = [
    {label: 'Progresif', value: 'PROGRESIF'},
    {label: 'Final', value: 'FINAL'},
  ];

  const allowanceData = [
    {label: '13', value: '13'},
    {label: '14', value: '14'},
    {label: '15', value: '15'},
    {label: '16', value: '16'},
    {label: 'Insentif', value: 'INSENTIF'},
  ];

  const showConfirmationDialog = () => {
    if (!selectedMonth || !selectedYear) {
      setModalMessage('Harap isi kolom dengan lengakp!');
      setIsModalVisible(true);
      return;
    }

    if (!APP_URL) {
      setModalMessage('URL server tidak ditemukan. Periksa konfigurasi!');
      setIsModalVisible(true);
      return;
    }

    setIsConfirmationVisible(true);
  };

  // Fungsi untuk menangani download
  const handleDownload = async () => {
    setIsConfirmationVisible(false);
    setIsLoading(true);

    const downloadUrl = `${APP_URL}/report/admin/tunjangan_tambahan_gaji/${selectedMonth}/${selectedYear}?p=${taxReduction}&kiri=${leftSignature}&kanan=${rightSignature}&tk=${selectedAllowance}&persentase=${percentage}&p2murni=${isP2Pure}`;
    const filePath = `/storage/emulated/0/Download/Tunjangan_Tambahan_${selectedMonth}_${selectedYear}.xlsx`;

    try {
      console.log('Memulai proses download:', downloadUrl);

      const download = RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
        connectionTimeout: 20000,
        readTimeout: 60000,
        progress: res => {
          if (res.contentLength && res.contentLength > 0) {
            const progressPercent = (
              (res.bytesWritten / res.contentLength) *
              100
            ).toFixed(2);
            console.log(`Download progress: ${progressPercent}%`);
          }
        },
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        setModalMessage('Laporan berhasil diunduh!');

        try {
          // Matikan loading sebelum mencoba membuka file
          setIsLoading(false);

          // Coba buka file yang telah diunduh
          const canOpen = await Linking.canOpenURL(`file://${filePath}`);
          if (canOpen) {
            await Linking.openURL(`file://${filePath}`);
          } else {
            // Jika gagal buka langsung, coba dengan content URI
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
      } else {
        setModalMessage('Gagal mengunduh laporan. Coba lagi.');
        setIsLoading(false);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengunduh file:', error);
      if (error.message.includes('timeout')) {
        setModalMessage(
          'Gagal mengunduh laporan: Koneksi timeout. Coba lagi dengan jaringan yang lebih stabil.',
        );
      } else {
        setModalMessage('Terjadi kesalahan saat mengunduh file.');
      }
      setIsLoading(false);
      setIsModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header title="Tunjangan Tambahan" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Report Tunjangan Tambahan</Text>
          </View>
          <Text style={styles.label}>Tanda Tangan Kiri *</Text>
          <Dropdown
            style={styles.dropdown}
            data={signatures}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tanda Tangan Kiri"
            value={leftSignature}
            onChange={item => setLeftSignature(item.value)}
            search
            searchPlaceholder="Cari nama..."
            maxHeight={300}
            renderItem={item => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item.label}</Text>
              </View>
            )}
          />
          <Text style={styles.label}>Tanda Tangan Kanan *</Text>
          <Dropdown
            style={styles.dropdown}
            data={signatures}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tanda Tangan Kanan"
            value={rightSignature}
            onChange={item => setRightSignature(item.value)}
            search
            searchPlaceholder="Cari nama..."
            maxHeight={300}
            renderItem={item => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item.label}</Text>
              </View>
            )}
          />
          <View style={styles.cardDivider}></View>
          <Text style={styles.label}>Pilih Bulan *</Text>
          <Dropdown
            style={styles.dropdown}
            data={monthData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Bulan"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
          />
          <Text style={styles.label}>Pilih Tahun *</Text>
          <Dropdown
            style={styles.dropdown}
            data={yearData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tahun"
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
          />
          <Text style={styles.label}>Potongan Pajak *</Text>
          <Dropdown
            style={styles.dropdown}
            data={taxReductionData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Potongan Pajak"
            value={taxReduction}
            onChange={item => setTaxReduction(item.value)}
          />
          <Text style={styles.label}>Tunjangan Ke *</Text>
          <Dropdown
            style={styles.dropdown}
            data={allowanceData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tunjangan Ke"
            value={selectedAllowance}
            onChange={item => setSelectedAllowance(item.value)}
          />
          <Text style={styles.label}>P2 Murni</Text>
          <Switch
            value={isP2Pure}
            onValueChange={setIsP2Pure}
            trackColor={{false: '#767577', true: '#28c4ac'}}
            thumbColor={isP2Pure ? '#f4f3f4' : '#f4f3f4'}
          />
          <Text style={styles.label}>Persentase :</Text>
          <TextInput
            style={styles.input}
            value={percentage}
            onChangeText={setPercentage}
            keyboardType="numeric"
            placeholder="Masukkan persentase"
          />
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={showConfirmationDialog}>
            <Text style={styles.buttonText}>Download Laporan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Konfirmasi Download Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirmationVisible}
        onRequestClose={() => setIsConfirmationVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apakah Anda Yakin?</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Anda Akan Mendownload Report Berformat Excel, Mungkin
                Membutuhkan Waktu Beberapa Detik!
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsConfirmationVisible(false)}>
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDownload}>
                <Text style={styles.modalButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal animationType="fade" transparent={true} visible={isLoading}>
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#28c4ac" />
            <Text style={styles.loadingText}>Mendownload file...</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Container & Header Styles
  container: {
    flex: 1,
    backgroundColor: '#E7E9F1',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 16, // Ukuran lebih besar
    textAlign: 'center', // Pusatkan teks
    marginLeft: 205,
  },
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginHorizontal: 10,
    marginTop: 20,
    width: 387,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: -5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  downloadButton: {
    backgroundColor: '#28c4ac',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#ccc',
    padding: 20,
    marginHorizontal: -20,
    marginTop: -20,
  },
  modalTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  confirmButton: {
    backgroundColor: '#28c4ac',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  // Loading Modal
  loadingContent: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Close Button
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
});
