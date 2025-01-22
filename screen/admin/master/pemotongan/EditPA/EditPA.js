import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { TimerPicker } from 'react-native-timer-picker';
import LinearGradient from 'react-native-linear-gradient';
import useApiClient from '../../../../../src/api/apiClient';

const EditPage = ({ navigation, route }) => {
  const { initialPotongan, initialBatasAtas, initialBatasBawah, id, uuid } = route.params;

  const [selectedPotongan, setSelectedPotongan] = useState(initialPotongan);
  const [selectedBatasAtas, setSelectedBatasAtas] = useState(initialBatasAtas || '00:00:00');
  const [selectedBatasBawah, setSelectedBatasBawah] = useState(initialBatasBawah || '00:00:00');
  const [showDropdownAtas, setShowDropdownAtas] = useState(false);
  const [showDropdownBawah, setShowDropdownBawah] = useState(false);
  const [currentTimeType, setCurrentTimeType] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [tempSelectedTime, setTempSelectedTime] = useState(null);
  const apiClient = useApiClient(); // Panggil useApiClient untuk mendapatkan instance

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSave = async (uuid, selectedPotongan, selectedBatasAtas, selectedBatasBawah, navigation) => {
    const finalBatasAtas = tempSelectedTime && currentTimeType === 'batasAtas' ? tempSelectedTime : selectedBatasAtas;
    const finalBatasBawah = tempSelectedTime && currentTimeType === 'batasBawah' ? tempSelectedTime : selectedBatasBawah;
  
    if (!selectedPotongan || !finalBatasAtas || !finalBatasBawah) {
      Alert.alert('Error', 'Please fill in all fields before saving.');
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
  
        Alert.alert('Success', 'Data has been updated successfully.');
        navigation.goBack();
      } else {
        console.error('Failed to update ', response.status);
        Alert.alert('Error', 'Failed to update data. Please try again.');
      }
    } catch (error) {
      console.error('Error during API request:', error);
      Alert.alert('Error', 'Failed to update data.');
    }
  };

  const handleTextChange = (text, setState) => {
    const filteredText = text.replace(/[^0-9:]/g, '');
    setState(filteredText);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerTitle}>Edit Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.label}>Potongan</Text>
          <TextInput
            style={styles.input}
            value={selectedPotongan}
            onChangeText={(text) => handleTextChange(text, setSelectedPotongan)}
            keyboardType="default"
            placeholder="Masukkan Potongan (angka atau ':')"
          />

          <Text style={styles.label}>Batas Atas</Text>
          <TextInput
            style={styles.input}
            value={selectedBatasAtas}
            onChangeText={(text) => handleTextChange(text, setSelectedBatasAtas)}
            keyboardType="default"
            placeholder="Masukkan Batas Atas (angka atau ':')"
          />

          <Text style={styles.label}>Batas Bawah</Text>
          <TextInput
            style={styles.input}
            value={selectedBatasBawah}
            onChangeText={(text) => handleTextChange(text, setSelectedBatasBawah)}
            keyboardType="default"
            placeholder="Masukkan Batas Bawah (angka atau ':')"
          />

          <TouchableOpacity
            style={styles.Buttons}
            onPress={() => handleSave(uuid, selectedPotongan, selectedBatasAtas, selectedBatasBawah, navigation)}>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave(uuid, selectedPotongan, selectedBatasAtas, selectedBatasBawah, navigation)}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E7E9F1', paddingTop: 20 },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: { textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 20,
    marginTop: 37,
  },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  dropdownAtas: {
    position: 'absolute',
    top: 195,
    left: 20,
    right: 180,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownBawah: {
    position: 'absolute',
    top: 289,
    left: 20,
    right: 180,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: { backgroundColor: '#CCC', padding: 15, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
  saveOk: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  buttonOk: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { backgroundColor: '#CCC', padding: 15, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },  
});

export default EditPage;
