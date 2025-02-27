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
import Toast from 'react-native-toast-message';
const {width} = Dimensions.get('window');
import {BarIndicator} from 'react-native-indicators';
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const EditDewas = ({navigation, route}) => {
  const {uuid} = route.params;
  const apiClient = useApiClient();
  const [ptkpOptions, setPtkpOptions] = useState([]);
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [focusState, setFocusState] = useState({});

  useEffect(() => {
    if (uuid) {
      fetchAllData(uuid);
    }
  }, [uuid]);

  const fetchAllData = async uuid => {
    setIsLoading(true); // Set loading ke true sebelum fetch data
    try {
      const [editResponse, pangkatResponse, ptkpResponse] = await Promise.all([
        apiClient.get(`/user/dewas/${uuid}/edit`),
        apiClient.get('/pangkat/show'),
        apiClient.get('/pajak_ptkp/show'),
      ]);

      // Simpan data edit
      setEditData(editResponse.data.data);

      // Simpan data pangkat
      setPangkatOptions(
        pangkatResponse.data.data.map(item => ({
          label: `${item.nm_pangkat} - (${item.golongan}/${item.ruang})`,
          value: item.id,
        })),
      );

      // Simpan data PTKP
      setPtkpOptions(
        ptkpResponse.data.data.map(item => ({
          label: item.ptkp,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal memuat data.',
      });
    } finally {
      setIsLoading(false); // Pastikan loading dihentikan
    }
  };

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/user/dewas/${editData.uuid}/update`, {
        created_at: editData.created_at,
        id: editData.id,
        jabatan: editData.jabatan,
        master_ptkp_id: editData.master_ptkp_id,
        name: editData.name,
        nip: editData.nip,
        no_rek: editData.no_rek,
        pangkat_id: editData.pangkat_id,
        percent: editData.percent,
        updated_at: editData.updated_at,
        uuid: editData.uuid,
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
      setIsLoading(true);
    }
  };

  const jabatan = [
    {label: 'KETUA DEWAN PENGAWAS', value: 'KETUA DEWAN PENGAWAS'},
    {label: 'ANGGOTA', value: 'ANGGOTA'},
    {label: 'SEKRETARIS', value: 'SEKRETARIS'},
  ];

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit Dewan Pengawas" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>NIP / NRP</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.nip && styles.inputFocused,
                editData.nip && styles.inputFilled,
              ]}
              placeholder="NIP / NRP"
              value={editData.nip || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text => setEditData(prev => ({...prev, nip: text}))}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('nip')}
              onBlur={() => handleBlur('nip')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Nama</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.name && styles.inputFocused,
                editData.name && styles.inputFilled,
                {textAlignVertical: 'center'},
              ]}
              placeholder="Nama"
              value={editData.name || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, name: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Persentase</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.percent && styles.inputFocused,
                editData.percent !== '' &&
                editData.percent !== null &&
                editData.percent !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              placeholder="Persentase"
              value={
                editData.percent !== null && editData.percent !== undefined
                  ? String(editData.percent)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, percent: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('percent')}
              onBlur={() => handleBlur('percent')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              No. Rekening
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.no_rek && styles.inputFocused,
                editData.no_rek && styles.inputFilled,
              ]}
              placeholder="No Rekening"
              value={editData.no_rek || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, no_rek: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('no_rek')}
              onBlur={() => handleBlur('no_rek')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Jabatan</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.jabatan && styles.inputFocused,
                editData.jabatan && styles.inputFilled,
              ]}
              data={jabatan}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              onFocus={() => handleFocus('jabatan')}
              onBlur={() => handleBlur('jabatan')}
              value={editData.jabatan} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item => setEditData(prev => ({...prev, jabatan: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
                  {item.label}
                </Text>
              )}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Pangkat/Gol. Ruang
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pangkat_id && styles.inputFocused,
                editData.pangkat_id && styles.inputFilled,
              ]}
              data={pangkatOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              onFocus={() => handleFocus('pangkat_id')}
              onBlur={() => handleBlur('pangkat_id')}
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              value={editData.pangkat_id} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item => setEditData(prev => ({...prev, pangkat_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
              }
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Status PTKP
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.master_ptkp_id && styles.inputFocused,
                editData.master_ptkp_id && styles.inputFilled,
              ]}
              data={ptkpOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              onFocus={() => handleFocus('master_ptkp_id')}
              onBlur={() => handleBlur('master_ptkp_id')}
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'}, // Lebih ringan dari daftar
              ]}
              value={editData.master_ptkp_id} // Menggunakan `jabatan_id` sebagai value
              onChange={
                item =>
                  setEditData(prev => ({...prev, master_ptkp_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
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

export default EditDewas;
