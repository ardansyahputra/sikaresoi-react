import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import DatePicker from 'react-native-modern-datepicker';
import useApiClient from '../../../../src/api/apiClient';
import Toast from 'react-native-toast-message';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import Header from '../../../components/Header';

const TambahPa = ({route, navigation}) => {
  const [user, setUser] = useState(null); // user object is now null initially
  const [signatures, setSignatures] = useState([]);
  const [jenis, setJenis] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tanggalPelanggaran, setTanggalPelanggaran] = useState('');
  const [potongan, setPotongan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [rightSignature, setRightSignature] = useState(null);
  const apiClient = useApiClient();
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {uuid} = route.params || {};

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient(`/user_master/show`);
        const data = response.data || (await response.json());
        if (data && data.res.code === 200) {
          const signatureData = data.data.map(user => ({
            label: user.name,
            value: user.id, // Ensure correct mapping of the user id
          }));
          setSignatures(signatureData);
        }
      } catch (error) {
        console.error('Error fetching signature data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignatures();
  }, []);

  const handleCreate = async () => {
    if (
      !user ||
      !user.value ||
      !jenis ||
      !tanggalPelanggaran ||
      !potongan ||
      !keterangan
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Harap isi semua data sebelum menyimpan.',
      });
      return;
    }

    const payload = {
      user_id: user ? String(user.value) : null, // Ambil hanya ID
      jenis,
      tgl_pelanggaran: tanggalPelanggaran,
      potongan: String(potongan),
      pesan: keterangan,
    };

    try {
      const response = await apiClient.post('/teguran/create', payload);
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Sukses',
          text2: 'Data berhasil disimpan.',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Gagal menyimpan data.',
        });
      }
    } catch (error) {
      console.error(
        'Error saving data:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Terjadi kesalahan saat menyimpan data.',
      });
    }
  };

  const handleDateChange = date => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggalPelanggaran(formattedDate);
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
      <Header title="Tambah Teguran" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>User *</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.user && styles.inputFocused, // Fokus jika dropdown user aktif
                user && styles.inputFilled, // Jika user dipilih, gunakan inputFilled
              ]}
              data={signatures}
              labelField="label"
              valueField="value"
              onFocus={() => handleFocus('user')} // Fokus pada "user"
              onBlur={() => handleBlur('user')} // Blur pada "user"
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              placeholder={user ? user.name : 'User'}
              search
              searchPlaceholder="Cari User"
              value={user ? user.value : null} // Gunakan user.value agar sesuai dengan valueField="value"
              onChange={item => {
                setUser(item); // Langsung set user dengan objek yang dipilih dari dropdown
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

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Jenis</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.jenis && styles.inputFocused,
                jenis && styles.inputFilled,
              ]}
              value={jenis}
              onChangeText={setJenis}
              placeholder="Masukkan Jenis"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('jenis')}
              onBlur={() => handleBlur('jenis')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Tanggal Pelanggaran
            </Text>
            <TouchableOpacity
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.tanggalPelanggaran && styles.inputFocused, // Tambahkan efek focus
                tanggalPelanggaran && styles.inputFilled, // Tambahkan efek jika sudah terisi
              ]}
              onPress={toggleDatePicker}
              activeOpacity={0.7} // Beri efek saat ditekan
              onPressIn={() => handleFocus('tanggalPelanggaran')} // Simulasikan fokus saat ditekan
              onPressOut={() => handleBlur('tanggalPelanggaran')} // Simulasikan blur saat dilepas
            >
              <Text
                style={[
                  GlobalStyle.SemiBold, // Pastikan teks memiliki style SemiBold
                  {color: tanggalPelanggaran ? '#333' : '#B0B0B0'}, // Warna teks sesuai kondisi
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

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Potongan%</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.potongan && styles.inputFocused,
                potongan && styles.inputFilled,
              ]}
              value={potongan}
              onChangeText={setPotongan}
              keyboardType="numeric"
              placeholder="Masukkan Potongan dalam Persen"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('potongan')}
              onBlur={() => handleBlur('potongan')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Keterangan/Pesan
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.keterangan && styles.inputFocused,
                keterangan && styles.inputFilled,
              ]}
              value={keterangan}
              onChangeText={setKeterangan}
              placeholder="Masukkan Keterangan atau Pesan"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('keterangan')}
              onBlur={() => handleBlur('keterangan')}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreate}>
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

export default TambahPa;