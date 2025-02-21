import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const TambahUnitKerja = ({navigation}) => {
  const [selectedUnitKerja, setSelectedUnitKerja] = useState(null);
  const [pickUnitKerjaOptions, setPickUnitKerjaOptions] = useState([]);
  const [unitKerjaOptions, setUnitKerjaOptions] = useState([]);
  const [isMaster, setIsMaster] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = useApiClient();

  useEffect(() => {
    fetchUnitKerjaOptions();
  }, []);

  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownTranslateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (isSub) {
      Animated.parallel([
        Animated.timing(dropdownOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownTranslateY, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSub]);

  const fetchUnitKerjaOptions = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/unit_kerja/get_unit_kerja');
      setUnitKerjaOptions(
        response.data.data.map(item => ({
          label: `${item.kd_unit_kerja} - ${item.nm_unit_kerja}`,
          value: item.kd_unit_kerja,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      console.log('Error', 'Gagal memuat data jabatan.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitTambah = async () => {
    const payload = {
      nm_unit_kerja: selectedUnitKerja,
      master: isMaster ? 1 : 0,
      sub_master: isSub,
      code: pickUnitKerjaOptions,
    };

    console.log(payload);

    try {
      setIsLoading(true);
      await apiClient.post('/unit_kerja/create', {
        payload,
      });

      console.log('Data berhasil dikirim.');
      Alert.alert('Berhasil', 'Data berhasil ditambahkan.');
      setTambahModalVisible(false);
      navigation.goBack();
      fetchData(currentPage); // Refresh data

      // Reset form setelah berhasil
      setSelectedUnitKerja('');
      setUnitKerjaOptions('');
      setIsMaster(false);
      setIsSub(false);
      console.log('Form telah direset.');
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
      <Header title="Tambah Unit Kerja" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Grade</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedUnitKerja && styles.inputFocused,
                selectedUnitKerja && styles.inputFilled,
              ]}
              placeholder="Nama Unit Kerja"
              multiline
              value={selectedUnitKerja}
              onChangeText={setSelectedUnitKerja}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedUnitKerja')}
              onBlur={() => handleBlur('selectedUnitKerja')}
            />

            {/* Switch untuk Master */}
            <View style={styles.switchContainer}>
              <Text style={[GlobalStyle.SemiBold, styles.switchLabel]}>
                Master
              </Text>
              <Switch
                value={isMaster}
                onValueChange={value => {
                  setIsMaster(value); // Perbarui Master
                  if (value) {
                    setIsSub(false); // Nonaktifkan Sub jika Master aktif
                  }
                }}
                trackColor={{
                  false: '#BEC2D5',
                  true: '#ADD8E6',
                }}
                thumbColor={isMaster ? '#ffffff' : '#f4f4f4'}
                style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              />
            </View>

            {/* Switch untuk Sub */}
            <View style={styles.switchContainer}>
              <Text style={[GlobalStyle.SemiBold, styles.switchLabel]}>
                Sub
              </Text>
              <Switch
                value={isSub}
                onValueChange={value => {
                  setIsSub(value); // Perbarui Sub
                  if (value) {
                    setIsMaster(false); // Nonaktifkan Master jika Sub aktif
                  }
                }}
                trackColor={{
                  false: '#BEC2D5',
                  true: '#ADD8E6',
                }}
                thumbColor={isSub ? '#ffffff' : '#f4f4f4'}
                style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              />
            </View>

            {isSub && (
              <Animated.View
                style={[
                  styles.animatedDropdown,
                  {
                    opacity: dropdownOpacity,
                    transform: [{translateY: dropdownTranslateY}],
                  },
                ]}>
                <Text style={[GlobalStyle.SemiBold, styles.label]}>
                  Jabatan Sub
                </Text>
                <Dropdown
                  style={[
                    GlobalStyle.SemiBold,
                    styles.input,
                    focusState.pickUnitKerjaOptions && styles.inputFocused,
                    pickUnitKerjaOptions && styles.inputFilled,
                  ]}
                  data={unitKerjaOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Jabatan"
                  onFocus={() => handleFocus('pickUnitKerjaOptions')}
                  onBlur={() => handleBlur('pickUnitKerjaOptions')}
                  placeholderStyle={{
                    ...GlobalStyle.SemiBold,
                    color: '#B0B0B0',
                    fontSize: 14,
                  }}
                  selectedTextStyle={{
                    ...GlobalStyle.SemiBold,
                    fontSize: 14,
                    color: '#313131',
                  }}
                  value={pickUnitKerjaOptions}
                  onChange={item => setPickUnitKerjaOptions(item.value)}
                  renderItem={item => (
                    <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                      {item.label}
                    </Text>
                  )}
                />
              </Animated.View>
            )}

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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#313131',
  },
});

export default TambahUnitKerja;
