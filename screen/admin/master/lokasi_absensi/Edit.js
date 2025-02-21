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

const EditLokasiAbsensi = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
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
      await apiClient.post(`/lokasiabsensi/${editData.uuid}/update`, {
        name: editData.name,
        lat: editData.lat,
        long: editData.long,
        radius: editData.radius,
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
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/lokasiabsensi/${uuid}/edit`);
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
      <Header title="Edit Lokasi Absensi" />
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
              Nama Lokasi
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.name && styles.inputFocused,
                editData.name && styles.inputFilled,
              ]}
              placeholder="Nama Lokasi"
              value={editData.name || ''} // Pastikan menggunakan default kosong jika null
              onChangeText={text =>
                setEditData(prev => ({...prev, name: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Latitude</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.lat && styles.inputFocused,
                editData.lat && styles.inputFilled,
              ]}
              placeholder="Latitude"
              value={editData.lat || ''}
              onChangeText={text => setEditData(prev => ({...prev, lat: text}))}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('lat')}
              onBlur={() => handleBlur('lat')}
              keyboardType="numeric"
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Longtitude</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.long && styles.inputFocused,
                editData.long && styles.inputFilled,
              ]}
              placeholder="Longtitude"
              value={editData.long || ''}
              onChangeText={text =>
                setEditData(prev => ({...prev, long: text}))
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('long')}
              onBlur={() => handleBlur('long')}
              keyboardType="numeric"
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Radius (M)</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.radius && styles.inputFocused,
                editData.radius !== '' &&
                editData.radius !== null &&
                editData.radius !== undefined
                  ? styles.inputFilled
                  : null,
              ]}
              placeholder="Radius"
              value={
                editData.radius !== null && editData.radius !== undefined
                  ? String(editData.radius)
                  : ''
              } // Konversi angka ke string
              onChangeText={
                text => setEditData(prev => ({...prev, radius: text})) // Tetap simpan sebagai string
              }
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('radius')}
              onBlur={() => handleBlur('radius')}
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

export default EditLokasiAbsensi;
