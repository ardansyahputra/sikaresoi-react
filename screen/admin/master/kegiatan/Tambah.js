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
const {width} = Dimensions.get('window');
import {BarIndicator} from 'react-native-indicators';
import Toast from 'react-native-toast-message';
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const TambahKegiatan = ({navigation}) => {
  const [uraianOptions, setUraianOptions] = useState([]);
  const [pickUraianOptions, setPickUraianOptions] = useState(null); // Gunakan null atau undefined
  const [selectedNamaKegiatan, setSelectedNamaKegiatan] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');
  const apiClient = useApiClient();
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUraianShow();
  }, []);

  const submitTambah = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/kegiatan/create', {
        nm_kegiatan: selectedNamaKegiatan,
        point: selectedPoint,
        uraian_id: pickUraianOptions,
      });

      console.log('Berhasil', 'Data berhasil ditambahkan.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal menambahkan data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUraianShow = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/uraian/show', {});
      setUraianOptions(
        response.data.data.map(item => ({
          label: item.nm_uraian,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      console.log('Error', 'Gagal memuat data jabatan.');
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
      <Header title="Tambah Kegiatan" />
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
                focusState.selectedNamaKegiatan && styles.inputFocused,
                selectedNamaKegiatan && styles.inputFilled,
              ]}
              placeholder="Nama Satuan"
              multiline
              value={selectedNamaKegiatan}
              onChangeText={setSelectedNamaKegiatan}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNamaKegiatan')}
              onBlur={() => handleBlur('selectedNamaKegiatan')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Point</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPoint && styles.inputFocused,
                selectedPoint && styles.inputFilled,
              ]}
              placeholder="Nama Satuan"
              multiline
              value={selectedPoint}
              onChangeText={setSelectedPoint}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPoint')}
              onBlur={() => handleBlur('selectedPoint')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Uraian</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.pickUraianOptions && styles.inputFocused,
                pickUraianOptions && styles.inputFilled,
              ]}
              data={uraianOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Jabatan"
              onFocus={() => handleFocus('pickUraianOptions')}
              onBlur={() => handleBlur('pickUraianOptions')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              value={pickUraianOptions}
              onChange={item => setPickUraianOptions(item.value)}
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

export default TambahKegiatan;
