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
import {Dropdown} from 'react-native-element-dropdown';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import Header from '../../../components/Header';
import Toast from 'react-native-toast-message';

const EditUraian = ({navigation, route}) => {
  const {uuid} = route.params;
  const apiClient = useApiClient();
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [editData, setEditData] = useState({});
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uuid) {
      fetchAllData(uuid);
    }
  }, [uuid]);

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/uraian/${editData.uuid}/update`, {
        id: editData.id,
        uuid: editData.uuid,
        created_at: editData.created_at,
        updated_at: editData.updated_at,
        tgs_tambahan: editData.tgs_tambahan,
        biaya: editData.biaya,
        angka_kredit: editData.angka_kredit,
        jabatan_id: editData.jabatan_id,
        nm_uraian: editData.nm_uraian,
        wpt: editData.wpt,
        satuan: editData.satuan,
      });
      console.log({
        id: editData.id,
        uuid: editData.uuid,
        created_at: editData.created_at,
        updated_at: editData.updated_at,
        tgs_tambahan: editData.tgs_tambahan,
        biaya: editData.biaya,
        angka_kredit: editData.angka_kredit,
        jabatan_id: editData.jabatan_id,
        nm_uraian: editData.nm_uraian,
        wpt: editData.wpt,
        satuan: editData.satuan,
      });
      navigation.goBack();
    } catch (error) {
      let message = 'Terjadi kesalahan.';

      if (error.response) {
        // Server memberikan respon error
        const {status, data} = error.response;
        message = `Gagal memperbarui data. \nStatus: ${status} \nPesan: ${
          data.message || message
        }`;
      } else if (error.request) {
        // Tidak ada respons dari server
        message = 'Gagal memperbarui data. Server tidak memberikan respons.';
      } else {
        // Error lain, misalnya konfigurasi
        message = `Gagal memperbarui data. Pesan: ${error.message}`;
      }

      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: message,
      });

      console.error('Error:', message);
    }
  };

  const fetchAllData = async uuid => {
    setIsLoading(true);
    try {
      // Jalankan semua request bersamaan dengan Promise.all()
      const [editResponse, jabatanResponse, satuanResponse] = await Promise.all(
        [
          apiClient.get(`/uraian/${uuid}/edit`),
          apiClient.get('/jabatan/show'),
          apiClient.get('/satuan/show'),
        ],
      );

      // Simpan data edit
      setEditData(editResponse.data.data);

      // Simpan data jabatan
      setJabatanOptions(
        jabatanResponse.data.data.map(item => ({
          label: `${item.kd_jabatan} - ${item.nm_jabatan}`,
          value: item.id,
        })),
      );

      // Simpan data satuan
      setSatuanOptions(
        satuanResponse.data.data.map(item => ({
          label: item.nm_satuan,
          value: item.nm_satuan,
        })),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Error', 'Gagal mengambil data.');
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
      <Header title="Edit Uraian" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Uraian</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.nm_uraian && styles.inputFocused,
                editData.nm_uraian && styles.inputFilled,
                {textAlignVertical: 'center'},
              ]}
              placeholder="Nama Uraian"
              value={editData.nm_uraian || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, nm_uraian: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('nm_uraian')}
              onBlur={() => handleBlur('nm_uraian')}
              multiline={true}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Jabatan</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.jabatan_id && styles.inputFocused,
                editData.jabatan_id && styles.inputFilled,
              ]}
              data={jabatanOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              onFocus={() => handleFocus('jabatan_id')}
              onBlur={() => handleBlur('jabatan_id')}
              value={editData.jabatan_id} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item => setEditData(prev => ({...prev, jabatan_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
                  {item.label}
                </Text>
              )}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Angka Kredit
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.angka_kredit && styles.inputFocused,
                editData.angka_kredit !== '' &&
                editData.angka_kredit !== null &&
                editData.angka_kredit !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              placeholder="Angka Kredit"
              value={
                editData.angka_kredit !== null &&
                editData.angka_kredit !== undefined
                  ? String(editData.angka_kredit)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, angka_kredit: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('angka_kredit')}
              onBlur={() => handleBlur('angka_kredit')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>WPT</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.wpt && styles.inputFocused,
                editData.wpt && styles.inputFilled,
              ]}
              placeholder="WPT"
              value={
                editData.wpt !== null && editData.wpt !== undefined
                  ? String(editData.wpt)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, wpt: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('wpt')}
              onBlur={() => handleBlur('wpt')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Biaya</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.biaya && styles.inputFocused,
                editData.biaya !== '' &&
                editData.biaya !== null &&
                editData.biaya !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              placeholder="Biaya"
              value={
                editData.biaya !== null && editData.biaya !== undefined
                  ? String(editData.biaya)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, biaya: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('biaya')}
              onBlur={() => handleBlur('biaya')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Output
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.satuan && styles.inputFocused,
                editData.satuan && styles.inputFilled,
              ]}
              data={satuanOptions}
              labelField="label"
              valueField="value"
              placeholder="Output"
              onFocus={() => handleFocus('satuan')}
              onBlur={() => handleBlur('satuan')}
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              value={editData.satuan}
              onChange={item =>
                setEditData(prev => ({...prev, satuan: item.value}))
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
                  {item.label}
                </Text>
              )}
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

export default EditUraian;
