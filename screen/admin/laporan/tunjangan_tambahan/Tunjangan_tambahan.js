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
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import useApiClient from '../../../../src/api/apiClient';
import {APP_URL} from '@env';

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
      setModalMessage('Harap pilih bulan dan tahun untuk laporan!');
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Report Tunjangan Tambahan</Text>
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
            <Text style={styles.modalMessage}>
              Apakah anda yakin akan mendownload file ke perangkat anda?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsConfirmationVisible(false)}>
                <Text style={styles.modalButtonText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDownload}>
                <Text style={styles.modalButtonText}>Ya</Text>
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
  container: {flex: 1, backgroundColor: '#E7E9F1'},
  header: {
    backgroundColor: '#FFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold'},
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {fontSize: 20, fontWeight: 'bold'},
  cardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 15,
  },
  label: {fontSize: 14, color: '#333', marginBottom: 5},
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  downloadButton: {
    backgroundColor: '#28c4ac',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  loadingContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  modalMessage: {fontSize: 16, color: '#333', textAlign: 'center'},
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
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
  },
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  cardHeader: {marginBottom: 15},
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: -5,
  },
  closeButtonText: {color: '#FFF', fontWeight: 'bold'},
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
