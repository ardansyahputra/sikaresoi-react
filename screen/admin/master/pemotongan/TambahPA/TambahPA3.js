import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import useApiClient from '../../../../../src/api/apiClient';
import Header from '../../../../components/Header';
import GlobalStyle from '../../../../../src/utils/GlobalStyle';
import {BarIndicator} from 'react-native-indicators';
const {width} = Dimensions.get('window');
import Toast from 'react-native-toast-message';

const TambahPage = ({navigation}) => {
  const [jenisAlasan, setJenisAlasan] = useState('');
  const [jenisCuti, setJenisCuti] = useState('');
  const [batasToleransi, setBatasToleransi] = useState('0');
  const [potongan, setPotongan] = useState('00.0');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const apiClient = useApiClient();
  const [focusState, setFocusState] = useState({});
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

  const handleSave = async () => {
    console.log('Jenis Cuti:', jenisCuti);
    console.log('Batas Toleransi:', batasToleransi);
    console.log('Potongan:', potongan);

    setIsLoading(true);

    if (!jenisCuti || !batasToleransi || !potongan) {
      console.log('Error', 'Please fill in all fields before saving.');
      setIsLoading(false);
      return;
    }

    // Update payload field names to match the API expectations
    const payload = {
      jenis_alasan: jenisCuti, // change from jenis_cuti to jenis_alasan
      batas_toleransi: batasToleransi,
      potongan: potongan,
    };

    try {
      const response = await apiClient.post(
        '/pemotongan_tidak_hadir/create',
        payload,
      );

      if (response.status === 200 && response.data.status) {
        console.log('Success', 'Data has been created successfully.');
        navigation.goBack();
      } else {
        console.log('Error', 'Failed to create data. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Gagal menambahkan data.',
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
      <Header title="Tambah PA 3" />
      <View style={styles.container}>
        {isLoading ? (
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
                focusState.jenisCuti && styles.inputFocused,
                jenisCuti && styles.inputFilled,
              ]}
              value={jenisCuti}
              onChangeText={text => setJenisCuti(text)}
              keyboardType="default"
              placeholder="Masukkan Jenis Cuti"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('jenisCuti')}
              onBlur={() => handleBlur('jenisCuti')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Batas Toleransi
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.batasToleransi && styles.inputFocused,
                batasToleransi && styles.inputFilled,
              ]}
              value={batasToleransi}
              onChangeText={text => setBatasToleransi(text)}
              keyboardType="default"
              placeholder="Masukkan Batas Toleransi"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('batasToleransi')}
              onBlur={() => handleBlur('batasToleransi')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Potongan (%)
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.potongan && styles.inputFocused,
                potongan && styles.inputFilled,
              ]}
              value={potongan}
              onChangeText={text => setPotongan(text)}
              keyboardType="numeric"
              placeholder="Masukkan Potongan (%)"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('potongan')}
              onBlur={() => handleBlur('potongan')}
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

export default TambahPage;
