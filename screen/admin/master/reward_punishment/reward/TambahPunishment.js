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
import useApiClient from '../../../../../src/api/apiClient';
import DatePicker from 'react-native-modern-datepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import Header from '../../../../components/Header';
import GlobalStyle from '../../../../../src/utils/GlobalStyle';

const TambahPunishment = ({route, navigation}) => {
  const [pickBulanOptions, setPickBulanOptions] = useState([]);
  const [pickTahunOptions, setPickTahunOptions] = useState({id: '', value: ''}); // Default kosong
  const [Tanggal, setTanggal] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPunishment, setSelectedPunishment] = useState();
  const {reward_punishment_id} = route.params;
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = useApiClient();

  useEffect(() => {
    // Simulasi proses awal sebelum input bisa diisi
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const submitTambah = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/punishment/create', {
        reward_punishment_id: reward_punishment_id,
        tanggal: Tanggal, // Tanggal yang dipilih
        punishment: selectedPunishment,
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
      setIsLoading(false); // Sembunyikan loading setelah selesai
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
      <Header title="Tambah Reward" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Tanggal</Text>
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

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Punishment</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPunishment && styles.inputFocused,
                selectedPunishment && styles.inputFilled,
              ]}
              placeholder="Punishment"
              multiline
              value={selectedPunishment}
              keyboardType="numeric"
              onChangeText={setSelectedPunishment}
              placeholderTextColor={'#B6B9CA'}
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

export default TambahPunishment;
