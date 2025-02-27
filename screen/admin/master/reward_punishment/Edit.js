import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import Toast from 'react-native-toast-message';
const {width} = Dimensions.get('window');
import {BarIndicator} from 'react-native-indicators';

const EditRewardPunishment = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [bulanOptions, setBulanOptions] = useState([]);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [Tanggal, setTanggal] = useState('');
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [focusState, setFocusState] = useState({});

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
    try {
      setIsLoading(true);
      await apiClient.post(`/reward_punishment/${editData.uuid}/update`, {
        tanggal: Tanggal,
        bulan_id: editData.bulan_id,
        tahun_id: editData.tahun_id,
      });
      console.log('Berhasil', 'Data berhasil diperbarui.');
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal memperbarui data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(`/reward_punishment/${uuid}/edit`);
      const responseData = response.data.data;
      // Pastikan tanggal diatur dalam format 'YYYY/MM/DD'
      if (responseData.tanggal) {
        const formattedDate = responseData.tanggal.replace(/-/g, '/');
        setTanggal(formattedDate);
      }
      setEditData(responseData);
      setTanggal(responseData.tanggal || ''); // Fix: Use responseData instead of undefined data
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const handleDateChange = date => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggal(formattedDate);
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev); // Toggle visibility
  };

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit Reward & Punishment" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Bulan</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.bulan_id && styles.inputFocused, // Fokus jika dropdown user aktif
                editData.bulan_id && styles.inputFilled, // Jika user dipilih, gunakan inputFilled
              ]}
              data={bulanOptions}
              labelField="label"
              valueField="value"
              placeholder="Bulan"
              onFocus={() => handleFocus('bulan_id')} // Fokus pada "user"
              onBlur={() => handleBlur('bulan_id')} // Blur pada "user"
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              value={editData.bulan_id} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item => setEditData(prev => ({...prev, bulan_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text
                  style={[
                    GlobalStyle.SemiBold,
                    styles.dropdownItem,
                    {fontSize: 14}, // Samakan dengan selectedTextStyle
                  ]}>
                  {item.label}
                </Text>
              )}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Tahun</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.tahun_id && styles.inputFocused, // Fokus jika dropdown user aktif
                editData.tahun_id && styles.inputFilled, // Jika user dipilih, gunakan inputFilled
              ]}
              data={tahunOptions}
              labelField="label"
              valueField="value"
              placeholder="Tahun"
              onFocus={() => handleFocus('tahun_id')} // Fokus pada "user"
              onBlur={() => handleBlur('tahun_id')} // Blur pada "user"
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              value={editData.tahun_id} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item => setEditData(prev => ({...prev, tahun_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text
                  style={[
                    GlobalStyle.SemiBold,
                    styles.dropdownItem,
                    {fontSize: 14}, // Samakan dengan selectedTextStyle
                  ]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Tanggal Pelanggaran
            </Text>
            <TouchableOpacity
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.Tanggal && styles.inputFocused, // Tambahkan efek focus
                Tanggal && styles.inputFilled, // Tambahkan efek jika sudah terisi
              ]}
              onPress={toggleDatePicker}
              activeOpacity={0.7} // Beri efek saat ditekan
              onPressIn={() => handleFocus('Tanggal')} // Simulasikan fokus saat ditekan
              onPressOut={() => handleBlur('Tanggal')} // Simulasikan blur saat dilepas
            >
              <Text
                style={[
                  GlobalStyle.SemiBold, // Pastikan teks memiliki style SemiBold
                  {color: Tanggal ? '#333' : '#B0B0B0'}, // Warna teks sesuai kondisi
                ]}>
                {Tanggal || 'Pilih Tanggal'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DatePicker
                mode="calendar"
                onDateChange={handleDateChange}
                current={
                  Tanggal ||
                  new Date().toISOString().split('T')[0].replace(/-/g, '/')
                }
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
});

export default EditRewardPunishment;
