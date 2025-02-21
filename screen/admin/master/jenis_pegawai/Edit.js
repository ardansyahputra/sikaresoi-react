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
import useApiClient from '../../../../src/api/apiClient';
const {width} = Dimensions.get('window');
import {BarIndicator} from 'react-native-indicators';
import Toast from 'react-native-toast-message';
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const EditJenisPegawai = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [uraianOptions, setUraianOptions] = useState([]);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [focusState, setFocusState] = useState({});

  useEffect(() => {
    if (uuid) {
      fetchEditData(uuid); // Panggil fungsi untuk fetch data edit berdasarkan UUID
    }
  }, [uuid]);

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/jenis_pegawai/${editData.uuid}/update`, {
        jenis: editData.jenis,
        persen_bayar: editData.persen_bayar,
      });
      console.log('Berhasil', 'Data berhasil diperbarui.');
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal memperbarui data.',
      });
    }
    setIsLoading(false);
  };

  const fetchEditData = async uuid => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/jenis_pegawai/${uuid}/edit`);
      setEditData(response.data.data); // Simpan data edit di state
    } catch (error) {
      console.error('Error fetching edit data:', error);
      console.log('Error', 'Gagal mengambil data untuk diedit.');
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
      <Header title="Edit Jenis Pegawai" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Jenis</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.jenis && styles.inputFocused,
                editData.jenis && styles.inputFilled,
              ]}
              placeholder="Jenis"
              value={editData.jenis || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, jenis: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('jenis')}
              onBlur={() => handleBlur('jenis')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Persentase Dibayar
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.persen_bayar && styles.inputFocused,
                editData.persen_bayar !== '' &&
                editData.persen_bayar !== null &&
                editData.persen_bayar !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              placeholder="Persentase Dibayar"
              value={
                editData.persen_bayar !== null &&
                editData.persen_bayar !== undefined
                  ? String(editData.persen_bayar)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, persen_bayar: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('persen_bayar')}
              onBlur={() => handleBlur('persen_bayar')}
            />

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

export default EditJenisPegawai;
