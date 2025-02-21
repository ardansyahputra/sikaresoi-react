import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import Header from '../../../components/Header';

const TambahDewas = ({navigation}) => {
  const [selectedNIP, setSelectedNIP] = useState(null);
  const [selectedNama, setSelectedNama] = useState(null);
  const [selectedPersentase, setSelectedPersentase] = useState(null);
  const [selectedNoRek, setSelectedNoRek] = useState(null);
  const [selectedPangkat, setSelectedPangkat] = useState(null);
  const [selectedPtkp, setSelectedPtkp] = useState(null);
  const [pickJabatanOptions, setPickJabatanOptions] = useState(null);
  const [ptkpOptions, setPtkpOptions] = useState([]);
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = useApiClient();

  useEffect(() => {
    fetchAllOptions();
  }, []);

  const fetchAllOptions = async () => {
    setIsLoading(true);
    try {
      const [pangkatResponse, ptkpResponse] = await Promise.all([
        apiClient.get('/pangkat/show'),
        apiClient.get('/pajak_ptkp/show'),
      ]);

      setPangkatOptions(
        pangkatResponse.data.data.map(item => ({
          label: `${item.nm_pangkat} - (${item.golongan}/${item.ruang})`,
          value: item.id,
        })),
      );
      setPtkpOptions(
        ptkpResponse.data.data.map(item => ({
          label: item.ptkp,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching options:', error);
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitTambah = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('user/dewas/create', {
        jabatan: pickJabatanOptions,
        master_ptkp_id: selectedPtkp,
        name: selectedNama,
        nip: selectedNIP,
        no_rek: selectedNoRek,
        pangkat_id: selectedPangkat,
        percent: selectedPersentase,
      });
      console.log('Berhasil', 'Data berhasil ditambahkan.');
      navigation.goBack();
      fetchData(currentPage);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal menambahkan data.',
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

  const jabatan = [
    {label: 'KETUA DEWAN PENGAWAS', value: 'KETUA DEWAN PENGAWAS'},
    {label: 'ANGGOTA', value: 'ANGGOTA'},
    {label: 'SEKRETARIS', value: 'SEKRETARIS'},
  ];

  return (
    <View style={styles.rootContainer}>
      <Header title="Tambah Dewan Pengawas" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>NIP / NRP</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNIP && styles.inputFocused,
                selectedNIP && styles.inputFilled,
              ]}
              placeholder="NIP / NRP"
              multiline
              value={selectedNIP}
              onChangeText={setSelectedNIP}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNIP')}
              onBlur={() => handleBlur('selectedNIP')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Nama</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNama && styles.inputFocused,
                selectedNama && styles.inputFilled,
              ]}
              placeholder="Nama"
              multiline
              value={selectedNama}
              onChangeText={setSelectedNama}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNama')}
              onBlur={() => handleBlur('selectedNama')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Persentase</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPersentase && styles.inputFocused,
                selectedPersentase && styles.inputFilled,
              ]}
              placeholder="Persentase"
              multiline
              value={selectedPersentase}
              onChangeText={setSelectedPersentase}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPersentase')}
              onBlur={() => handleBlur('selectedPersentase')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              No. Rekening
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNoRek && styles.inputFocused,
                selectedNoRek && styles.inputFilled,
              ]}
              placeholder="Ruang"
              multiline
              value={selectedNoRek}
              onChangeText={setSelectedNoRek}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNoRek')}
              onBlur={() => handleBlur('selectedNoRek')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Jabatan
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pickJabatanOptions && styles.inputFocused,
                pickJabatanOptions && styles.inputFilled,
              ]}
              data={jabatan}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              onFocus={() => handleFocus('pickJabatanOptions')}
              onBlur={() => handleBlur('pickJabatanOptions')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={pickJabatanOptions}
              onChange={item => setPickJabatanOptions(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Pangkat/Gol. Ruang
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPangkat && styles.inputFocused,
                selectedPangkat && styles.inputFilled,
              ]}
              data={pangkatOptions} // Menggunakan array data
              labelField="label"
              valueField="value"
              placeholder="Pilih Pangkat"
              onFocus={() => handleFocus('selectedPangkat')}
              onBlur={() => handleBlur('selectedPangkat')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={selectedPangkat} // Tambahkan state untuk menyimpan pilihan
              onChange={item => setSelectedPangkat(item.value)} // Mengatur pilihan ke state
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.modalLabel]}>
              Status PTKP
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPtkp && styles.inputFocused,
                selectedPtkp && styles.inputFilled,
              ]}
              data={ptkpOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Status PTKP"
              onFocus={() => handleFocus('selectedPtkp')}
              onBlur={() => handleBlur('selectedPtkp')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={selectedPtkp} // Tambahkan state untuk menyimpan pilihan
              onChange={item => setSelectedPtkp(item.value)} // Mengatur pilihan ke state
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
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

export default TambahDewas;
