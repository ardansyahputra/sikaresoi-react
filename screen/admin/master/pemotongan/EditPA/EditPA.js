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
  Alert,
} from 'react-native';
import {TimerPickerModal} from 'react-native-timer-picker';
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
  const [isVisible, setIsVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [focusState, setFocusState] = useState({});
  const apiClient = useApiClient();
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

  const formatTime = pickedDuration => {
    const {hours, minutes, seconds} = pickedDuration;
    // Mengembalikan format waktu tanpa label HMS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  const showPicker = mode => {
    setPickerMode(mode);
    setIsVisible(true);
  };

  const handleBatal = () => {
    setIsVisible(false);
  };

  const handlePilih = time => {
    const formattedTime = formatTime(time);
    if (pickerMode === 'batasAtas') {
      setSelectedBatasAtas(formattedTime);
    } else if (pickerMode === 'batasBawah') {
      setSelectedBatasBawah(formattedTime);
    }
    setIsVisible(false);
  };

  const handleSave = async () => {
    setIsLoading(true);

    if (!selectedPotongan || !selectedBatasAtas || !selectedBatasBawah) {
      Alert.alert(
        'Peringatan',
        'Harap lengkapi semua field sebelum menyimpan.',
        [{text: 'OK'}],
      );
      setIsLoading(false);
      return;
    }

    const payload = {
      batas_bawah: selectedBatasBawah,
      batas_atas: selectedBatasAtas,
      potongan: selectedPotongan,
    };

    try {
      const response = await apiClient.post(
        `/pemotongan_pulang_awal/${uuid}/update`,
        payload,
      );

      if (response.status === 200 && response.data.status) {
        Alert.alert('Sukses', 'Data berhasil diperbarui', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        Alert.alert('Gagal', 'Gagal memperbarui data. Silakan coba lagi.');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui data.');
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
      <Header title="Edit Pemotongan Pulang Awal" />
      <View style={styles.container}>
        {isLoading ? (
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
              onChangeText={setSelectedPotongan}
              keyboardType="number-pad"
              placeholder="Masukkan Potongan"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPotongan')}
              onBlur={() => handleBlur('selectedPotongan')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Batas Atas</Text>
            <TouchableOpacity
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                selectedBatasAtas && styles.inputFilled,
              ]}
              onPress={() => showPicker('batasAtas')}>
              <Text style={styles.inputText}>
                {selectedBatasAtas || 'Pilih Batas Atas ⏰'}
              </Text>
            </TouchableOpacity>

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Batas Bawah
            </Text>
            <TouchableOpacity
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                selectedBatasBawah && styles.inputFilled,
              ]}
              onPress={() => showPicker('batasBawah')}>
              <Text style={styles.inputText}>
                {selectedBatasBawah || 'Pilih Batas Bawah ⏰'}
              </Text>
            </TouchableOpacity>

            <TimerPickerModal
              visible={isVisible}
              setIsVisible={setIsVisible}
              hourLabel="                 :"
              minuteLabel="                 :"
              secondLabel="                 "
              onConfirm={handlePilih}
              onCancel={handleBatal}
              modalTitle={
                pickerMode === 'batasAtas'
                  ? 'Pilih Batas Atas'
                  : 'Pilih Batas Bawah'
              }
              confirmButtonText="Simpan"
              cancelButtonText="Batal"
              modalProps={{
                animationType: 'fade',
              }}
              styles={{
                theme: 'light',
                container: {
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 5,
                },
                contentContainer: {
                  alignItems: 'center',
                  padding: 10,
                },
                modalTitle: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333',
                  textAlign: 'center',
                  marginBottom: 10,
                },
                cancelButton: {
                  color: '#fff', // Warna merah untuk tombol batal
                  backgroundColor: '#FF3B30',
                  fontSize: 16,
                  fontWeight: 'bold',
                  borderColor: "#FF3B30",
                  marginRight: 120,
                },
                confirmButton: {
                  color: '#fff', // Warna biru untuk tombol simpan
                  backgroundColor: '#3699FE',
                  borderColor: "#3699FE",
                  fontSize: 16,
                  fontWeight: 'bold',
                },
              }}
              hideSeconds={false}
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
  label: {
    fontSize: 14,
    color: '#313131',
  },
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
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    color: '#313131',
  },
});

export default EditPage;
