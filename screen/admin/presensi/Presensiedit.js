import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';
import Header from '../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
const {width} = Dimensions.get('window');
import {BarIndicator} from 'react-native-indicators';
import Toast from 'react-native-toast-message';

const TambahPa = ({route, navigation}) => {
  const [jenisAlasan, setJenisAlasan] = useState([]);
  const [jenis, setJenis] = useState('');
  const [Tanggal, setTanggal] = useState(selectedDate || '');
  const [potongan, setPotongan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [name, setName] = useState('');
  const apiClient = useApiClient();
  const {userId, userName, selectedDate} = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [focusState, setFocusState] = useState({});

  useEffect(() => {
    fetchJenisAlasan();
  }, []);

  const fetchJenisAlasan = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient(`/pemotongan_tidak_hadir/show`);
      const data = response.data || (await response.json());
      if (data && data.res.code === 200) {
        const alasanData = data.data.map(item => ({
          label: item.jenis_alasan,
          value: item.id,
        }));
        setJenisAlasan(alasanData);
      }
    } catch (error) {
      console.error('Error fetching jenis alasan data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const payload = {
      name: userName,
      pemotongan_tidak_hadir_id: jenis,
      tanggal: selectedDate,
      user_id: userId || 2,
    };

    console.log('Payload to be sent:', payload);
    setIsLoading(true);

    try {
      const response = await apiClient.post('/admin/absensi/change', payload);

      console.log('API Response:', response);

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Sukses',
          text2: 'Data berhasil disimpan.',
        });
        navigation.goBack();
      } else {
        console.log('API Response Error:', response.data);
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Gagal menyimpan data.',
        });
      }
    } catch (error) {
      if (error.response) {
        // Error dengan respons dari server
        console.error('API Error Response:', error.response.data);
        console.log('API Error Status:', error.response.status);
      } else if (error.request) {
        // Error karena tidak ada respons dari server
        console.error('API Error Request:', error.request);
      } else {
        // Error lainnya
        console.error('General Error:', error.message);
      }

      console.error('Error Stack Trace:', error.stack);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal menyimpan data.',
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

  return (
    <View style={styles.rootContainer}>
      <Header title="Ubah Presensi" />
      {isLoading ? (
        // Loading Indicator
        <View style={styles.loadingContainer}>
          <BarIndicator color="#D4C6C6" count={5} size={24} />
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.nameContainer}>
              <Text style={[GlobalStyle.SemiBold, styles.userName]}>
                {userName || 'Nama Tidak Ditemukan'}
              </Text>
            </View>
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Jenis Alasan
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.jenis && styles.inputFocused,
                jenis && styles.inputFilled,
              ]}
              data={jenisAlasan}
              labelField="label"
              valueField="value"
              placeholder="Pilih Alasan"
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              itemTextStyle={{...GlobalStyle.SemiBold, fontSize: 14}}
              onFocus={() => handleFocus('jabatan')}
              onBlur={() => handleBlur('jabatan')}
              value={jenis}
              onChange={item => {
                setJenis(item.value);
              }}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
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
  nameContainer: {
    borderRadius: 5,
    marginBottom: 15,
  },
  userName: {
    fontSize: 16,
    color: '#333',
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
