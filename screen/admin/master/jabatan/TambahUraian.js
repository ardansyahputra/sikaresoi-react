import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import CustomCheckbox from '../../../components/CustomCheckbox';
import {Dropdown} from 'react-native-element-dropdown';

const TambahUraianPeta = ({navigation, route}) => {
  const {uuid, jabatan_id, tahun_id} = route.params;
  const [selectedPersentase, setSelectedPersentase] = useState('');
  const [selectedPangkat, setSelectedPangkat] = useState(null);
  const apiClient = useApiClient();
  const [isChecked, setIsChecked] = useState(false);
  const [editData, setEditData] = useState({});
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
    fetchCheckData();
  }, []);

  const submitTambah = async () => {
    setIsLoading(true);
    console.log(isChecked, jabatan_id, selectedPersentase, tahun_id   , selectedPangkat  );
    try {
      await apiClient.post(`uraian/jabatan/${uuid}/tambah`, {
        is_nominal: isChecked,
        jabatan_id: jabatan_id,
        tahun_id: tahun_id,
        persentase: selectedPersentase,
        type: selectedPangkat,
      });

      navigation.goBack();
      // Reset form setelah berhasil
      setSelectedNamaSatuan('');
    } catch (error) {
      Alert.alert('Gagal', 'Gagal menambahkan data.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCheckData = async () => {
    try {
      const response = await apiClient.get(
        `/uraian/jabatan/${uuid}/check?jabatan_id=${jabatan_id}&tahun_id=${tahun_id}`,
      );

      setEditData(response.data.data); // Simpan data edit di state
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  const Uraian = [
    {label: 'Tanggung Renteng', value: 'tanggung renteng'},
    {label: 'Otomatis', value: 'otomatis'},
  ];

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
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPangkat && styles.inputFocused,
                selectedPangkat && styles.inputFilled,
              ]}
              data={Uraian}
              labelField="label"
              valueField="value"
              placeholder="Pilih"
              onFocus={() => handleFocus('selectedPangkat')}
              onBlur={() => handleBlur('selectedPangkat')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
               selectedTextStyle={[
                GlobalStyle.SemiBold,
                {color: '#313131', fontSize: 14}, // Tambahkan fontSize agar sama
              ]}
              value={selectedPangkat}
              onChange={item => setSelectedPangkat(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            {isChecked && (
              <>
                <Text style={[GlobalStyle.SemiBold, styles.label]}>
                  Target
                </Text>
                <TextInput
                  style={[
                    GlobalStyle.SemiBold,
                    styles.input,
                    focusState.sisa && styles.inputFocused,
                    editData.sisa && styles.inputFilled,
                  ]}
                  placeholder="Nominal"
                  value={editData.sisa || ''}
                  onChangeText={text =>
                    setEditData(prev => ({...prev, sisa: text}))
                  }
                  placeholderTextColor="#B0B0B0"
                  onFocus={() => handleFocus('sisa')}
                  onBlur={() => handleBlur('sisa')}
                  keyboardType="numeric"
                  editable={false}
                />
              </>
            )}
            <View style={styles.inputContainer}>
              <View style={styles.checkbox}>
                <CustomCheckbox
                  checked={isChecked}
                  onPress={() => setIsChecked(!isChecked)}
                />
              </View>
              <TextInput
                style={[
                  GlobalStyle.SemiBold,
                  styles.inputPersen,
                  focusState.selectedPersentase && styles.inputFocused,
                  selectedPersentase && styles.inputFilled,
                ]}
                placeholder="Ex. 100"
                multiline
                value={selectedPersentase}
                onChangeText={setSelectedPersentase}
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
                onFocus={() => handleFocus('selectedPersentase')}
                onBlur={() => handleBlur('selectedPersentase')}
              />
              )
            </View>

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
    marginBottom: 15,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f3f6f9',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputPersen: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
  },
  checkbox: {
    marginLeft: 10,
    marginRight: 3,
  },
});

export default TambahUraianPeta;
