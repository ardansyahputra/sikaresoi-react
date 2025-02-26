import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import {BarIndicator} from 'react-native-indicators';
import CalendarPicker from 'react-native-calendar-picker';
const {width} = Dimensions.get('window');
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../../components/Header';

const EditLock = ({navigation, route}) => {
  const {uuid} = route.params;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarRange, setCalendarRange] = useState(false);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [bulanOptions, setBulanOptions] = useState([]);
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const apiClient = useApiClient();

  useEffect(() => {
    if (uuid) {
      setIsLoading(true);
      Promise.all([fetchEditData(uuid), fetchBulan(), fetchTahun()]).finally(
        () => setIsLoading(false),
      );
    }
  }, [uuid]);

  const fetchBulan = async () => {
    try {
      const response = await apiClient.get('/bulan/show', {});
      setBulanOptions(
        response.data.data.map(item => ({
          label: item.bulan,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const fetchTahun = async () => {
    try {
      const response = await apiClient.get('/tahun/show', {});
      setTahunOptions(
        response.data.data.map(item => ({
          label: item.tahun,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/lock/${editData.uuid}/update`, {
        bulan_id: editData.bulan_id,
        tahun_id: editData.tahun_id,
        jenis: editData.jenis,
        tgl_pengisian: `${formatDateToString(startDate)}/${formatDateToString(
          endDate,
        )}`,
      });
      console.log('Berhasil', 'Data berhasil ditambahkan.');
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal menambahkan data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(`/lock/${uuid}/edit`);
      const responseData = response.data.data;
      // Ambil tgl_pengisian dan pecah jadi start & end date
      let startDate = null;
      let endDate = null;
      if (responseData.tgl_pengisian) {
        const dates = responseData.tgl_pengisian.split(' / ');
        startDate = dates[0] ? new Date(dates[0]) : null;
        endDate = dates[1] ? new Date(dates[1]) : null;
      }

      setStartDate(startDate);
      setEndDate(endDate);
      setEditData(responseData);
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const formatDateToString = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tambahkan '0' jika kurang dari 10
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  const jenis = [
    {label: 'kontrak', value: 'kontrak'},
    {label: 'realisasi', value: 'realisasi'},
  ];

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit Lock" />
      <View style={styles.container}>
        {isLoading ? (
          // Loading Indicator
          <View style={styles.loadingContainer}>
            <BarIndicator color="#D4C6C6" count={5} size={24} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>Jenis</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.jenis && styles.inputFocused,
                editData.jenis && styles.inputFilled,
              ]}
              data={jenis} // Menggunakan array data
              labelField="label"
              valueField="value"
              placeholder="Pilih Jenis"
              onFocus={() => handleFocus('selectedPangkat')}
              onBlur={() => handleBlur('selectedPangkat')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={editData.jenis} // Tambahkan state untuk menyimpan pilihan
              onChange={
                item => setEditData(prev => ({...prev, jenis: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>Tahun</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.tahun_id && styles.inputFocused,
                editData.tahun_id && styles.inputFilled,
              ]}
              data={tahunOptions} // Menggunakan array data
              labelField="label"
              valueField="value"
              placeholder="Pilih Tahun"
              onFocus={() => handleFocus('selectedTahun')}
              onBlur={() => handleBlur('selectedTahun')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={editData.tahun_id}
              onChange={
                item => setEditData(prev => ({...prev, tahun_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>Bulan</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.bulan_id && styles.inputFocused,
                editData.bulan_id && styles.inputFilled,
              ]}
              data={bulanOptions} // Menggunakan array data
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              onFocus={() => handleFocus('selectedBulan')}
              onBlur={() => handleBlur('selectedBulan')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={editData.bulan_id} // Tambahkan state untuk menyimpan pilihan
              onChange={
                item => setEditData(prev => ({...prev, bulan_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Tanggal Pengisian
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCalendarRange(true)}>
              <Text style={GlobalStyle.Regular}>
                {startDate && endDate
                  ? `${formatDateToString(startDate)} / ${formatDateToString(
                      endDate,
                    )}`
                  : 'Pilih Tanggal'}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={isCalendarRange}
              transparent={true}
              animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true} // Mengaktifkan range selection
                    minDate={new Date(2024, 0, 1)}
                    maxDate={new Date(2025, 11, 31)}
                    todayBackgroundColor="#ffcc00"
                    selectedDayColor="#007bff"
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={(date, type) => {
                      if (type === 'START_DATE') {
                        setStartDate(date);
                        setEndDate(null);
                      } else {
                        setEndDate(date);
                        setCalendarRange(false); // Tutup modal setelah memilih rentang tanggal
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setCalendarRange(false)}>
                    <Text style={styles.closeButtonText}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.saveButton} onPress={submitEdit}>
                <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.05,
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '100%',

    marginTop: 37, // Memberikan margin agar konten tidak tumpang tindih dengan header
  },
  label: {fontSize: 14, color: '#313131'},
  input: {
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
  scrollContent: {
    paddingBottom: 10, // Tambahkan padding bawah agar tidak terpotong
  },
  dropdown: {
    position: 'absolute',
    top: 195, // Adjust this value to make sure dropdown is below the input field
    left: 20,
    right: 180,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 5,
    shadowColor: '#000', // Menambahkan bayangan
    shadowOffset: {width: 0, height: 2}, // Menyesuaikan posisi bayangan
    shadowOpacity: 0.3, // Menyesuaikan intensitas bayangan
    shadowRadius: 5, // Menyesuaikan kelembutan bayangan
    elevation: 5, // Memberikan bayangan di perangkat Android
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {backgroundColor: '#187DE4', padding: 15, borderRadius: 5},
  saveButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#3699FE',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {color: '#fff', fontSize: 14},
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: '#313131',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  staticText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dynamicText: {
    fontSize: 16,
    color: '#333',
  },
  calendarText: {
    fontSize: 16,
    color: '#333',
  },
  todayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  calendarHeader: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectedRange: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  selectedDate: {
    fontSize: 15,
    color: '#333',
    marginTop: 1,
    textAlign: 'left', // Ubah dari 'center' ke 'left'
    alignSelf: 'flex-start', // Pastikan teks mengikuti layout ke kiri
    marginLeft: 10, // Tambahkan sedikit margin jika diperlukan
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditLock;
