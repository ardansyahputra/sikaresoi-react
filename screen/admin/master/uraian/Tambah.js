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

const TambahUraian = ({navigation}) => {
  const [selectedNamaUraian, setSelectedNamaUraian] = useState(null);
  const [selectedAngkaCredit, setSelectedAngkaCredit] = useState(null);
  const [selectedWpt, setSelectedWpt] = useState(null);
  const [selectedBiaya, setSelectedBiaya] = useState(null);
  const [pickJabatanOptions, setPickJabatanOptions] = useState(null);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [pickSatuanOptions, setPickSatuanOptions] = useState(null);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = useApiClient();

  useEffect(() => {
    fetchJabatanOptions();
    fetchSatuanOptions();
  }, []); // <- Tambahkan array kosong

  const fetchSatuanOptions = async () => {
    try {
      const response = await apiClient.get('/satuan/show');
      setSatuanOptions(
        response.data.data.map(item => ({
          label: item.nm_satuan,
          value: item.nm_satuan,
        })),
      );
    } catch (error) {
      console.error('Error fetching satuan options:', error);
    }
  };

  const fetchJabatanOptions = async () => {
    try {
      const response = await apiClient.get('/jabatan/show');
      setJabatanOptions(
        response.data.data.map(item => ({
          label: `${item.kd_jabatan} - ${item.nm_jabatan}`,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
    } finally {
      setIsLoading(false); // Pastikan loading berhenti setelah data diambil
    }
  };

  const submitTambah = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/uraian/create', {
        angka_kredit: selectedAngkaCredit,
        biaya: selectedBiaya,
        jabatan_id: pickJabatanOptions,
        nm_uraian: selectedNamaUraian,
        satuan: pickSatuanOptions,
        wpt: selectedWpt,
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
      <Header title="Tambah Uraian" />
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
              Nama Uraian
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNamaUraian && styles.inputFocused,
                selectedNamaUraian && styles.inputFilled,
              ]}
              placeholder="Nama Uraian"
              multiline
              value={selectedNamaUraian}
              onChangeText={setSelectedNamaUraian}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNamaUraian')}
              onBlur={() => handleBlur('selectedNamaUraian')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Jabatan</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pickJabatanOptions && styles.inputFocused,
                pickJabatanOptions && styles.inputFilled,
              ]}
              data={jabatanOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              onFocus={() => handleFocus('jabatanOptions')}
              onBlur={() => handleBlur('jabatanOptions')}
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Angka Kredit
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedAngkaCredit && styles.inputFocused,
                selectedAngkaCredit && styles.inputFilled,
              ]}
              placeholder="Angka Kredit"
              multiline
              value={selectedAngkaCredit}
              onChangeText={setSelectedAngkaCredit}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedAngkaCredit')}
              onBlur={() => handleBlur('selectedAngkaCredit')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>WPT</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedWpt && styles.inputFocused,
                selectedWpt && styles.inputFilled,
              ]}
              placeholder="WPT"
              multiline
              value={selectedWpt}
              onChangeText={setSelectedWpt}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedWpt')}
              onBlur={() => handleBlur('selectedWpt')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Biaya</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedBiaya && styles.inputFocused,
                selectedBiaya && styles.inputFilled,
              ]}
              placeholder="Biaya"
              multiline
              value={selectedBiaya}
              onChangeText={setSelectedBiaya}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedBiaya')}
              onBlur={() => handleBlur('selectedBiaya')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Output</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pickSatuanOptions && styles.inputFocused,
                pickSatuanOptions && styles.inputFilled,
              ]}
              data={satuanOptions}
              labelField="label"
              valueField="value"
              placeholder="Output"
              onFocus={() => handleFocus('pickSatuanOptions')}
              onBlur={() => handleBlur('pickSatuanOptions')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={pickSatuanOptions}
              onChange={item => setPickSatuanOptions(item.value)}
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
                <Text style={(GlobalStyle.SemiBold, styles.buttonText)}>
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

export default TambahUraian;
