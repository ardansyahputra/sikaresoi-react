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
import Toast from 'react-native-toast-message';
const {width} = Dimensions.get('window');

const EditPa3 = ({navigation, route}) => {
  const {jenisAlasan, batasToleransi, potongan, uuid} = route.params || {};
  const [selectedJenisCuti, setSelectedJenisCuti] = useState(jenisAlasan || '');
  const [selectedBatasToleransi, setSelectedBatasToleransi] = useState(batasToleransi || '0',);
  const [selectedPotongan, setSelectedPotongan] = useState(potongan || '0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [focusState, setFocusState] = useState({});
  const apiClient = useApiClient(); // Panggil useApiClient untuk mendapatkan instance

  useEffect(() => {
    console.log('Route Params:', route.params);
  }, [route.params]);

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

  const handleSave = async () => {
    setIsLoading(true);

    if (!selectedJenisCuti || !selectedBatasToleransi || !selectedPotongan) {
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Please fill in all fields before saving.',
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      jenis_alasan: selectedJenisCuti,
      batas_toleransi: selectedBatasToleransi,
      potongan: selectedPotongan,
    };

    console.log('Sending Payload:', payload);

    try {
      const response = await apiClient.post(
        `/pemotongan_tidak_hadir/${uuid}/update`,
        payload,
      );

      if (response.status === 200 && response.data.status) {
        console.log('Server Response:', response.data);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Data has been updated successfully.',
        });
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
    const filteredText = text.replace(/[^0-9.]/g, ''); // Allow only numbers and dot
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
      <Header title="Edit Pemotongan Tidak Hadir" />
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
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Jenis Cuti</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedJenisCuti && styles.inputFocused,
                selectedJenisCuti && styles.inputFilled,
              ]}
              value={selectedJenisCuti}
              onChangeText={text => setSelectedJenisCuti(text)}
              placeholder="Masukkan Jenis Cuti"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedJenisCuti')}
              onBlur={() => handleBlur('selectedJenisCuti')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Batas Toleransi
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedBatasToleransi && styles.inputFocused,
                selectedBatasToleransi && styles.inputFilled,
              ]}
              value={
                selectedBatasToleransi ? String(selectedBatasToleransi) : ''
              }
              onChangeText={text =>
                handleTextChange(text, setSelectedBatasToleransi)
              }
              keyboardType="numeric"
              placeholder="Masukkan Batas Toleransi (angka)"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedBatasToleransi')}
              onBlur={() => handleBlur('selectedBatasToleransi')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Potongan (%)
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPotongan && styles.inputFocused,
                selectedPotongan && styles.inputFilled,
              ]}
              value={selectedPotongan}
              onChangeText={text => handleTextChange(text, setSelectedPotongan)}
              keyboardType="numeric"
              placeholder="Masukkan Potongan (%)"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPotongan')}
              onBlur={() => handleBlur('selectedPotongan')}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  label: {fontSize: 14, color: '#313131'},
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#F0ECEC',
    borderWidth: 1,
    borderColor: 'transparent',
    color: '#313131',
  },
  inputFocused: {
    borderRadius: 5,
    borderColor: '#75BAFF',
    borderWidth: 1.5,
  },
  inputFilled: {
    backgroundColor: '#F2F8FF',
    borderRadius: 5,
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditPa3;
