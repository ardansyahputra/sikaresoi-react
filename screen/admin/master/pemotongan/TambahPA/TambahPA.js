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
import useApiClient from '../../../../../src/api/apiClient';

const TambahPage = ({ navigation }) => {
  const [selectedPotongan, setSelectedPotongan] = useState('');
  const [selectedBatasAtas, setSelectedBatasAtas] = useState('00:00:00');
  const [selectedBatasBawah, setSelectedBatasBawah] = useState('00:00:00');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const apiClient = useApiClient();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSave = async () => {
    if (!selectedPotongan || !selectedBatasAtas || !selectedBatasBawah) {
      Alert.alert('Error', 'Please fill in all fields before saving.');
      return;
    }

    const payload = {
      batas_bawah: selectedBatasBawah,
      batas_atas: selectedBatasAtas,
      potongan: selectedPotongan,
    };

    try {
      const response = await apiClient.post(
        '/pemotongan_pulang_awal/create',
        payload,
      );

      if (response.status === 200 && response.data.status) {
        Alert.alert('Success', 'Data has been created successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to create data. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create data.');
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
            <Text style={styles.headerTitle}>Tambah Data</Text>
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

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: { backgroundColor: '#CCC', padding: 15, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});

export default TambahPage;
