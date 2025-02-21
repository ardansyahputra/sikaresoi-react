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
import DatePicker from 'react-native-modern-datepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const TambahRewardPunishment = ({navigation}) => {
  const [pickBulanOptions, setPickBulanOptions] = useState([]);
  const [pickTahunOptions, setPickTahunOptions] = useState({id: '', value: ''}); // Default kosong
  const [Tanggal, setTanggal] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bulanOptions, setBulanOptions] = useState([]);
  const [tahunOptions, setTahunOptions] = useState([]);
  const apiClient = useApiClient();
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Tampilkan loading sebelum fetch data
      await Promise.all([fetchBulan(), fetchTahun()]); // Ambil data bulan & tahun secara paralel
      setIsLoading(false); // Hilangkan loading setelah data berhasil di-load
    };

    fetchData();
  }, []); // Gunakan array kosong agar hanya dipanggil sekali

  const submitTambah = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/reward_punishment/create', {
        bulan_id: pickBulanOptions, // ID bulan
        tahun_id: pickTahunOptions.id, // ID tahun
        tanggal: Tanggal, // Tanggal yang dipilih
      });
      console.log('Berhasil', 'Data berhasil ditambahkan.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal menambahkan data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBulan = async () => {
    try {
      const response = await apiClient.get('/bulan/show', {});
      setBulanOptions(
        response.data.data.map(item => ({
          label: item.bulan,
          value: item.id,
          id: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching bulan options:', error);
      Alert.alert('Error', 'Gagal memuat data bulan.');
    }
  };

  const fetchTahun = async () => {
    try {
      const response = await apiClient.get('/tahun/show', {});
      setTahunOptions(
        response.data.data.map(item => ({
          label: item.tahun,
          value: item.tahun,
          id: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching tahun options:', error);
      Alert.alert('Error', 'Gagal memuat data tahun.');
    }
  };

  const getCurrentDate = () => {
    if (pickTahunOptions.value && pickBulanOptions) {
      // Gunakan tahun sebenarnya dan bulan untuk DatePicker
      return `${pickTahunOptions.value}/${String(pickBulanOptions).padStart(
        2,
        '0',
      )}/01`;
    }
    // Default ke tanggal hari ini jika belum dipilih
    return new Date().toISOString().split('T')[0].replace(/-/g, '/');
  };

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev); // Toggle visibility
  };

  const handleDateChange = date => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggal(formattedDate);
    setShowDatePicker(false);
  };

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Tambah Reward & Punishment" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Tahun</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.value && styles.inputFocused,
                pickTahunOptions.value && styles.inputFilled,
              ]}
              data={tahunOptions} // Data sudah memiliki `label`, `value`, dan `id`
              labelField="label" // Tampilan nama tahun
              valueField="value" // Nilai tahun sebenarnya untuk DatePicker
              placeholder="Pilih Tahun"
              onFocus={() => handleFocus('value')}
              onBlur={() => handleBlur('value')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              value={pickTahunOptions.value} // Menampilkan tahun sebenarnya
              onChange={item => {
                // Simpan id dan value ke state
                setPickTahunOptions({id: item.id, value: item.value});
              }}
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

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Bulan</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pickBulanOptions && styles.inputFocused,
                pickBulanOptions && styles.inputFilled,
              ]}
              data={bulanOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Bulan"
              onFocus={() => handleFocus('pickBulanOptions')}
              onBlur={() => handleBlur('pickBulanOptions')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              value={pickBulanOptions}
              onChange={item => setPickBulanOptions(item.value)}
              renderItem={item => (
                <Text
                  style={[
                    GlobalStyle.SemiBold,
                    styles.dropdownItem,
                    {fontSize: 14},
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
                current={getCurrentDate()}
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

export default TambahRewardPunishment;
