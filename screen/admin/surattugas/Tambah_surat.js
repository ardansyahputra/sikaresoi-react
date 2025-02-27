import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import Header from '../../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import CalendarPicker from 'react-native-calendar-picker';
import {Dropdown} from 'react-native-element-dropdown';

const TambahSuratTugas = ({navigation}) => {
  const [selectedNamaSatuan, setSelectedNamaSatuan] = useState('');
  const apiClient = useApiClient();
  const [focusState, setFocusState] = useState({
    nomorSKP: false,
    dasar: false,
    untuk: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isCalendarRange, setCalendarRange] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [jabatanList, setJabatanList] = useState([]);
  const [pickJabatanOptions, setPickJabatanOptions] = useState(null);
  const [sptDate, setSptDate] = useState(null);
  const [nomorSKP, setNomorSKP] = useState('');
  const [isLoadingJabatan, setIsLoadingJabatan] = useState(false);
  const [isSKPEnabled, setIsSKPEnabled] = useState(false); // State untuk Switch
  const [dasar, setDasar] = useState('');
  const [untuk, setUntuk] = useState('');

  useEffect(() => {
    // Simulasi proses awal sebelum input bisa diisi
    fetchJabatanData();
    fetchUserData();
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/surat-tugas/user');
      const formattedUsers = response.data.data.map(user => ({
        label: user.name,
        value: user.id,
      }));
      setUserList(formattedUsers);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data user.');
    }
  };

  const fetchJabatanData = async () => {
    try {
      setIsLoadingJabatan(true);
      const response = await apiClient.get('/surat-tugas/jabatan');
      const formattedJabatan = response.data.data.map(jabatan => ({
        label: jabatan.nm_jabatan,
        value: jabatan.id.toString(),
      }));
      setJabatanList(formattedJabatan);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data jabatan.');
    } finally {
      setIsLoadingJabatan(false);
    }
  };

  const submitTambah = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/surat-tugas/create', {
        dasar: dasar,
        untuk: untuk,
        setNoSpt: isSKPEnabled,
        tahun: null,
        tembusan: ['1'],
        tgl_spt: formatDateToString(sptDate),
        tgl_tugas: `${formatDateToString(startDate)}/${formatDateToString(
          endDate,
        )}`,
        user: ['2'],
      });

      navigation.goBack();
      // Reset form setelah berhasil
      setSelectedNamaSatuan('');
      setDasar('');
      setUntuk('');
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

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  const formatDateToString = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tambahkan '0' jika kurang dari 10
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = date => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Tambah Satuan" />
      {/* Pindahkan switchContainer ke sini */}
      <View style={styles.switchContainer}>
        <Switch
          value={isSKPEnabled}
          onValueChange={setIsSKPEnabled}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isSKPEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
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
            {/* Tampilkan No SKP hanya jika Switch diaktifkan */}
            {isSKPEnabled && (
              <>
                <Text style={[GlobalStyle.SemiBold, styles.label]}>NO SKP</Text>
                <View style={styles.skpContainer}>
                  <Text style={styles.staticText}>ST-POLTEKPELB-</Text>
                  <TextInput
                    style={[
                      GlobalStyle.SemiBold,
                      styles.inputskp,
                      focusState.nomorSKP && styles.inputFocused,
                      nomorSKP && styles.inputFilled,
                    ]}
                    placeholder="Masukkan NO SKP"
                    value={nomorSKP}
                    onChangeText={setNomorSKP}
                    placeholderTextColor="#B0B0B0"
                    onFocus={() =>
                      setFocusState({...focusState, nomorSKP: true})
                    }
                    onBlur={() =>
                      setFocusState({...focusState, nomorSKP: false})
                    }
                  />
                </View>
              </>
            )}

            {/* Input yang bisa diklik untuk menampilkan kalender */}
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Tanggal SPT
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCalendarVisible(true)}>
              <Text style={GlobalStyle.Regular}>
                {sptDate ? formatDisplayDate(sptDate) : 'Pilih Tanggal'}
              </Text>
            </TouchableOpacity>

            {/* Modal untuk menampilkan kalender */}
            <Modal
              visible={isCalendarVisible}
              transparent={true}
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <CalendarPicker
                    startFromMonday={true}
                    minDate={new Date(2024, 0, 1)}
                    maxDate={new Date(2025, 11, 31)}
                    todayBackgroundColor="#ffcc00"
                    selectedDayColor="#007bff"
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={date => {
                      setSptDate(date);
                      setCalendarVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setCalendarVisible(false)}>
                    <Text style={styles.closeButtonText}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Input untuk memilih tanggal */}
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Tanggal Tugas
            </Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setCalendarRange(true)}>
              <Text style={GlobalStyle.Regular}>
                {startDate && endDate
                  ? `${formatDateToString(startDate)}/${formatDateToString(
                      endDate,
                    )}`
                  : 'Pilih Tanggal'}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={isCalendarRange}
              transparent={true}
              animationType="slide">
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

            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>User</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedUser && styles.inputFocused,
                selectedUser && styles.inputFilled,
              ]}
              data={userList}
              labelField="label"
              valueField="value"
              placeholder={isLoading ? 'Loading...' : 'Pilih User'}
              value={selectedUser}
              disable={isLoading || userList.length === 0}
              onFocus={() => handleFocus('selectedUser')}
              onBlur={() => handleBlur('selectedUser')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              onChange={item => {
                setSelectedUser(item.value);
              }}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />

            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Jabatan
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pickJabatanOptions && styles.inputFocused,
                pickJabatanOptions && styles.inputFilled,
              ]}
              data={jabatanList}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              onFocus={() => handleFocus('pickJabatanOptions')}
              onBlur={() => handleBlur('pickJabatanOptions')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={pickJabatanOptions}
              onChange={item => setPickJabatanOptions(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            {/* Input untuk Dasar */}
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Dasar</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.dasar && styles.inputFocused,
                dasar && styles.inputFilled,
              ]}
              placeholder="Masukkan Dasar"
              value={dasar}
              onChangeText={setDasar}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('dasar')}
              onBlur={() => handleBlur('dasar')}
            />

            {/* Input untuk Untuk */}
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Untuk</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.untuk && styles.inputFocused,
                untuk && styles.inputFilled,
              ]}
              placeholder="Masukkan Untuk"
              value={untuk}
              onChangeText={setUntuk}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('untuk')}
              onBlur={() => handleBlur('untuk')}
            />
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={submitTambah}>
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
  label: {marginTop: 20, fontSize: 14, color: '#313131'},
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
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownuser: {
    // Gantilah namanya jika ingin lebih deskriptif
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginBottom: 20,
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
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    position: 'absolute', // Posisikan secara absolut
    top: 10, // Jarak dari atas
    right: 20, // Jarak dari kanan
    zIndex: 1, // Pastikan Switch berada di atas komponen lain
  },
  skpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0ECEC',
    borderRadius: 5,
    backgroundColor: '#F0ECEC',
    marginBottom: 20,
  },
  staticText: {
    padding: 10,
    fontSize: 14,
    color: '#313131',
    backgroundColor: '#F0ECEC',
    borderRightWidth: 1,
    borderRightColor: '#CCC',
  },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginBottom: 10,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
  },
  inputskp: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: '#313131',
    backgroundColor: '#F0ECEC',
  },
});

export default TambahSuratTugas;
