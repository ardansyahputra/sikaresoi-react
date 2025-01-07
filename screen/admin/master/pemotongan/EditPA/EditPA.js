import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {TimerPicker} from 'react-native-timer-picker';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import useApiClient from '../../../../../src/api/apiClient';

const EditPage = ({navigation, route}) => {
  const {initialPotongan, initialBatasAtas, initialBatasBawah, id, uuid} =
    route.params;

  const [selectedPotongan, setSelectedPotongan] = useState(initialPotongan);
  const [selectedBatasAtas, setSelectedBatasAtas] = useState(initialBatasAtas);
  const [selectedBatasBawah, setSelectedBatasBawah] =
    useState(initialBatasBawah);
  const [showDropdownAtas, setShowDropdownAtas] = useState(false);
  const [showDropdownBawah, setShowDropdownBawah] = useState(false);
  const [currentTimeType, setCurrentTimeType] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [tempSelectedTime, setTempSelectedTime] = useState(null);

  const apiClient = useApiClient();

  useEffect(() => {
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
    if (!selectedPotongan || !selectedBatasAtas || !selectedBatasBawah) {
      Alert.alert('Error', 'Please fill in all fields before saving.');
      return;
    }

    const payload = {
      batas_bawah: selectedBatasBawah,
      batas_atas: selectedBatasAtas,
      potongan: selectedPotongan,
    };

    console.log('Sending Payload:', payload);

    try {
      const response = await axios.post(
        `/pemotongan_pulang_awal/${uuid}/update`,
        payload,
      );

      if (response.status === 200 && response.data.status) {
        console.log('Server Response:', response.data);

        setSelectedPotongan(response.data.potongan || selectedPotongan);
        setSelectedBatasAtas(response.data.batas_atas || selectedBatasAtas);
        setSelectedBatasBawah(response.data.batas_bawah || selectedBatasBawah);

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

  const toggleDropdown = timeType => {
    if (keyboardOpen) {
      Keyboard.dismiss();
    }

    if (timeType === 'batasAtas') {
      setShowDropdownAtas(!showDropdownAtas);
      setShowDropdownBawah(false);
    } else {
      setShowDropdownBawah(!showDropdownBawah);
      setShowDropdownAtas(false);
    }

    setCurrentTimeType(timeType);
    setTempSelectedTime(null);
  };

  const handleTimeSelect = time => {
    setTempSelectedTime(time); // Ensure this sets the selected time correctly
  };

  const handleOkButton = () => {
    if (!tempSelectedTime) {
      console.log('No temporary time selected');
      return;
    }

    if (currentTimeType === 'batasAtas') {
      setSelectedBatasAtas(tempSelectedTime);
    } else if (currentTimeType === 'batasBawah') {
      setSelectedBatasBawah(tempSelectedTime);
    }

    setTempSelectedTime(null); // Reset temp time
    setShowDropdownAtas(false);
    setShowDropdownBawah(false);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
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
            onChangeText={setSelectedPotongan}
            keyboardType="numeric"
            placeholder="Masukkan Potongan dalam Persen"
          />

          <Text style={styles.label}>Batas Atas</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => toggleDropdown('batasAtas')}
            disabled={keyboardOpen}>
            <Text>{selectedBatasAtas}</Text>
          </TouchableOpacity>

          {showDropdownAtas && (
            <View style={styles.dropdownAtas}>
              <TimerPicker
                isVisible={showDropdownAtas}
                padWithNItems={2}
                hourLabel="             :"
                minuteLabel="             :"
                secondLabel=""
                LinearGradient={LinearGradient}
                initialTime={selectedBatasAtas} // Pass the initial time
                onTimeChange={handleTimeSelect}
                styles={{
                  theme: 'light',
                  backgroundColor: '#333',
                  pickerItem: {
                    fontSize: 14,
                    color: '#000',
                  },
                  pickerLabel: {
                    fontSize: 12,
                    marginTop: 0,
                    color: '#000',
                  },
                  pickerContainer: {
                    marginRight: 6,
                    backgroundColor: '#FFF',
                  },
                }}
              />
              <TouchableOpacity style={styles.saveOk} onPress={handleOkButton}>
                <Text style={styles.buttonOk}>Ok</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Batas Bawah</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => toggleDropdown('batasBawah')}
            disabled={keyboardOpen}>
            <Text>{selectedBatasBawah}</Text>
          </TouchableOpacity>

          {showDropdownBawah && (
            <View style={styles.dropdownBawah}>
              <TimerPicker
                isVisible={showDropdownBawah}
                padWithNItems={2}
                hourLabel="        :"
                minuteLabel="        :"
                secondLabel=""
                LinearGradient={LinearGradient}
                initialTime={selectedBatasBawah} // Pass the initial time from selectedBatasBawah
                onTimeChange={handleTimeSelect}
                styles={{
                  theme: 'light',
                  backgroundColor: '#333',
                  pickerItem: {
                    fontSize: 14,
                    color: '#000',
                  },
                  pickerLabel: {
                    fontSize: 12,
                    marginTop: 0,
                    color: '#000',
                  },
                  pickerContainer: {
                    marginRight: 6,
                    backgroundColor: '#FFF',
                  },
                }}
              />
              <TouchableOpacity style={styles.saveOk} onPress={handleOkButton}>
                <Text style={styles.buttonOk}>Ok</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
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
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E7E9F1', paddingTop: 20},
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
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 20,
    marginTop: 37,
  },
  label: {fontSize: 16, marginTop: 10},
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {backgroundColor: '#CCC', padding: 15, borderRadius: 5},
  saveButton: {backgroundColor: '#007BFF', padding: 15, borderRadius: 5},
  saveOk: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center', // Add this property
    alignItems: 'center', // Add this property
  },
  buttonText: {color: '#FFF', fontWeight: 'bold'},
  buttonOk: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditPage;
