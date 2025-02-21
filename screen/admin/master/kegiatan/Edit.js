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
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const EditKegiatan = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [uraianOptions, setUraianOptions] = useState([]);
  const [editData, setEditData] = useState({});
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uuid) {
      fetchAllData(uuid);
    }
  }, [uuid]);

  const fetchAllData = async uuid => {
    setIsLoading(true);
    try {
      const [editResponse, uraianResponse] = await Promise.all([
        apiClient.get(`/kegiatan/${uuid}/edit`),
        apiClient.get('/uraian/show'),
      ]);

      // Set state dengan hasil data yang didapat
      setEditData(editResponse.data.data);
      setUraianOptions(
        uraianResponse.data.data.map(item => ({
          label: item.nm_uraian,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Error', 'Gagal mengambil data.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/kegiatan/${editData.uuid}/update`, {
        nm_kegiatan: editData.nm_kegiatan,
        point: editData.point,
        uraian_id: editData.uraian_id,
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

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit Kegiatan" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Nama Kegiatan
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.nm_kegiatan && styles.inputFocused,
                editData.nm_kegiatan && styles.inputFilled,
              ]}
              place
              placeholder="Kegiatan"
              value={editData.nm_kegiatan || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, nm_kegiatan: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('nm_kegiatan')}
              onBlur={() => handleBlur('nm_kegiatan')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Point</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.point && styles.inputFocused,
                editData.point !== '' &&
                editData.point !== null &&
                editData.point !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              placeholder="Point"
              value={
                editData.point !== null && editData.point !== undefined
                  ? String(editData.point)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, point: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('point')}
              onBlur={() => handleBlur('point')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Uraian</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.uraian_id && styles.inputFocused,
                editData.uraian_id !== '' &&
                editData.uraian_id !== null &&
                editData.uraian_id !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              data={uraianOptions}
              labelField="label"
              valueField="value"
              placeholder="Uraian"
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              onFocus={() => handleFocus('uraian_id')}
              onBlur={() => handleBlur('uraian_id')}
              value={editData.uraian_id} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item => setEditData(prev => ({...prev, uraian_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
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

export default EditKegiatan;
