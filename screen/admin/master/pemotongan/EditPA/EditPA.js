import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';
import GlobalStyle from '../../../../../src/utils/GlobalStyle';
import Header from '../../../../components/Header';
const {width} = Dimensions.get('window');

const EditPage = ({navigation, route}) => {
  const {initialPotongan, initialBatasAtas, initialBatasBawah, id, uuid} =
    route.params;

  const [selectedPotongan, setSelectedPotongan] = useState(initialPotongan);
  const [selectedBatasAtas, setSelectedBatasAtas] = useState(
    initialBatasAtas || '00:00:00',
  );
  const [selectedBatasBawah, setSelectedBatasBawah] = useState(
    initialBatasBawah || '00:00:00',
  );
  const [showDropdownAtas, setShowDropdownAtas] = useState(false);
  const [showDropdownBawah, setShowDropdownBawah] = useState(false);
  const [currentTimeType, setCurrentTimeType] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [tempSelectedTime, setTempSelectedTime] = useState(null);
  const [focusState, setFocusState] = useState({});
  const apiClient = useApiClient(); // Panggil useApiClient untuk mendapatkan instance
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardOpen(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOpen(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSave = async (
    uuid,
    selectedPotongan,
    selectedBatasAtas,
    selectedBatasBawah,
    navigation,
  ) => {
    setIsLoading(true);

    const finalBatasAtas =
      tempSelectedTime && currentTimeType === 'batasAtas'
        ? tempSelectedTime
        : selectedBatasAtas;
    const finalBatasBawah =
      tempSelectedTime && currentTimeType === 'batasBawah'
        ? tempSelectedTime
        : selectedBatasBawah;

    if (!selectedPotongan || !finalBatasAtas || !finalBatasBawah) {
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Please fill in all fields before saving.',
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      batas_bawah: finalBatasBawah,
      batas_atas: finalBatasAtas,
      potongan: selectedPotongan,
    };

    console.log('Sending Payload:', payload);

    try {
      const response = await apiClient.post(
        `/pemotongan_pulang_awal/${uuid}/update`,
        payload,
      );

      if (response.status === 200 && response.data.status) {
        console.log('Server Response:', response.data);

        setSelectedPotongan(response.data.potongan || selectedPotongan);
        setSelectedBatasAtas(response.data.batas_atas || finalBatasAtas);
        setSelectedBatasBawah(response.data.batas_bawah || finalBatasBawah);

        console.log('Success', 'Data has been updated successfully.');
        navigation.goBack();
      } else {
        console.error('Failed to update ', response.status);
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Failed to update data. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error during API request:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text, setState) => {
    const filteredText = text.replace(/[^0-9:]/g, '');
    setState(filteredText);
  };
  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit PA" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Potongan</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPotongan && styles.inputFocused,
                selectedPotongan && styles.inputFilled,
              ]}
              value={selectedPotongan}
              onChangeText={text => handleTextChange(text, setSelectedPotongan)}
              keyboardType="default"
              placeholder="Masukkan Potongan (angka atau ':')"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPotongan')}
              onBlur={() => handleBlur('selectedPotongan')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Batas Atas</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedBatasAtas && styles.inputFocused,
                selectedBatasAtas && styles.inputFilled,
              ]}
              value={selectedBatasAtas}
              onChangeText={text =>
                handleTextChange(text, setSelectedBatasAtas)
              }
              keyboardType="default"
              placeholder="Masukkan Batas Atas (angka atau ':')"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedBatasAtas')}
              onBlur={() => handleBlur('selectedBatasAtas')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Batas Bawah
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedBatasBawah && styles.inputFocused,
                selectedBatasBawah && styles.inputFilled,
              ]}
              value={selectedBatasBawah}
              onChangeText={text =>
                handleTextChange(text, setSelectedBatasBawah)
              }
              keyboardType="default"
              placeholder="Masukkan Batas Bawah (angka atau ':')"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedBatasBawah')}
              onBlur={() => handleBlur('selectedBatasBawah')}
            />
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() =>
                  handleSave(
                    uuid,
                    selectedPotongan,
                    selectedBatasAtas,
                    selectedBatasBawah,
                    navigation,
                  )
                }>
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

export default EditPage;
