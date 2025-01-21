import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import axios from 'axios';

const EditMesin = ({ navigation, route }) => {
  const { uuid } = route.params;
  const [namaMesin, setNamaMesin] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [comkey, setComkey] = useState('');
  const [statusAktif, setStatusAktif] = useState('Aktif');
  const [isDropdownVisible, setDropdownVisible] = useState(false); // State untuk visibilitas dropdown

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://192.168.60.163:8000/api/v1/fingerprint_machine/${uuid}/edit`;
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2Mzg1MzE0LCJleHAiOjE3MzYzOTg0NTgsIm5iZiI6MTczNjM5NDg1OCwianRpIjoiZVdzTWpWQ1F1WGY3SDVwcyIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.bhFOHbPIjAKT9U17r2YYRZXoxhT8H-oMXvu-vvzu2R0', // Pastikan token valid
            Accept: 'application/json',
          },
        });

        if (response.status === 200 && response.data) {
          const mesinData = response.data.data;
          setNamaMesin(mesinData.name || '');
          setSerialNumber(mesinData.sn || '');
          setIp(mesinData.ip || '');
          setPort(mesinData.port || '');
          setComkey(mesinData.comkey || '');
          setStatusAktif(mesinData.active === '1' ? 'Aktif' : 'Non-Aktif');
        } else {
          Alert.alert('Error', 'Failed to load data.');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch data. Error: ${error.message}`);
      }
    };

    if (uuid) {
      fetchData();
    } else {
      Alert.alert('Error', 'UUID is missing or invalid.');
    }
  }, [uuid]);

  const handleSave = async () => {
    if (!namaMesin || !serialNumber || !ip || !port || !comkey) {
      Alert.alert('Error', 'Please fill in all fields before saving.');
      return;
    }

    const payload = {
      name: namaMesin,
      sn: serialNumber,
      ip: ip,
      port: port,
      comkey: comkey,
      active: statusAktif === 'Aktif' ? '1' : '0',
    };

    const requestUrl = `http://192.168.60.163:8000/api/v1/fingerprint_machine/${uuid}/update`;
    console.log('Request URL:', requestUrl);
    console.log('Payload:', payload);

    try {
      const response = await axios.post(
        requestUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2Mzg1MzE0LCJleHAiOjE3MzYzOTg0NTgsIm5iZiI6MTczNjM5NDg1OCwianRpIjoiZVdzTWpWQ1F1WGY3SDVwcyIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.bhFOHbPIjAKT9U17r2YYRZXoxhT8H-oMXvu-vvzu2R0',
            Accept: 'application/json',
          },
        }
      );

      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      if (response.status === 200 && response.data.status) {
        // Menampilkan pesan sukses berdasarkan respons
        Alert.alert('Success', response.data.data || 'Data has been updated successfully.');
        navigation.goBack(); // Navigasi setelah notifikasi
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update data. Please try again.');
      }
    } catch (error) {
      console.error('Error during request:', error);
      Alert.alert('Error', `Failed to update data. Error: ${error.message}`);
    }
  };




  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleSelectStatus = (status) => {
    setStatusAktif(status);
    setDropdownVisible(false); // Close dropdown after selection
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerTitle}>Tambah Data</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.label}>Nama Mesin</Text>
          <TextInput
            style={styles.input}
            value={namaMesin}
            onChangeText={setNamaMesin}
            placeholder="Masukkan Nama Mesin"
          />

          <Text style={styles.label}>Serial Number</Text>
          <TextInput
            style={styles.input}
            value={serialNumber}
            onChangeText={setSerialNumber}
            placeholder="Masukkan Serial Number"
          />

          <Text style={styles.label}>IP</Text>
          <TextInput
            style={styles.input}
            value={ip}
            onChangeText={setIp}
            placeholder="Masukkan IP"
          />

          <Text style={styles.label}>Port</Text>
          <TextInput
            style={styles.input}
            value={` ${port}`}
            onChangeText={setPort}
            placeholder="Masukkan Port"
          />

          <Text style={styles.label}>Comkey</Text>
          <TextInput
            style={styles.input}
            value={comkey}
            onChangeText={setComkey}
            placeholder="Masukkan Comkey"
          />

          <Text style={styles.label}>Status Aktif</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
            <Text style={styles.dropdownText}>{statusAktif}</Text>
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectStatus('Aktif')}>
                <Text style={styles.dropdownItemText}>Aktif</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectStatus('Non-Aktif')}>
                <Text style={styles.dropdownItemText}>Non-Aktif</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    marginHorizontal: 10,
    marginTop: 37,
    width: 387,
  },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: -5,
    justifyContent: 'center',
  },
  dropdownText: { fontSize: 16, color: '#333' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#FFF',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  dropdownItemText: { fontSize: 16, color: '#333' },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: { backgroundColor: '#CCC', padding: 15, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});

export default EditMesin;
