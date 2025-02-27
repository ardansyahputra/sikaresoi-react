import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';

const RealisasiTanggung = ({navigation, route}) => {
  const {uuid} = route.params;
  const [kuantitas, setKuantitas] = useState(route.params.kuantitas || '');
  const [usulanKuantitas, setUsulanKuantitas] = useState(
    route.params.usulan_kuantitas || '',
  );
  const [usulanKualitas, setUsulanKualitas] = useState();
  const [kualitas, setKualitas] = useState('');
  const apiClient = useApiClient();
  const [editData, setEditData] = useState({});

  const submitEdit = async () => {
    try {
      // Siapkan payload
      const payload = {
        usulan_kuantitas: usulanKuantitas, // Pastikan nilai sudah ada
        usulan_kualitas: usulanKualitas, // Pastikan nilai sudah ada
        kuantitas: kuantitas, // Pastikan nilai sudah ada
        kualitas: parseFloat(kualitas), // Kualitas dikonversi ke float
      };
      // Kirim request POST
      await apiClient.post(`/user/kinerja/list/target/realisasi/${uuid}/update`, payload);
  
      // Jika berhasil
      Alert.alert('Berhasil', 'Data berhasil diperbarui.');
    } catch (error) {
      // Jika gagal
      console.error('Error saat mengirim data:', error); // Log error
      Alert.alert('Error', 'Gagal memperbarui data.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.label}>Usulan Kuantitas</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Usulan Kuantitas"
          value={usulanKuantitas}
          onChangeText={text => {
            setUsulanKuantitas(text);

            // Parsing kuantitas dan usulan kuantitas ke angka
            const kuantitasNum = parseFloat(kuantitas.replace(',', '.')) || 0;
            const usulanNum = parseFloat(text.replace(',', '.')) || 0;

            // Hitung kualitas jika usulan kuantitas > 0
            if (usulanNum > 0) {
              const kualitasValue = (usulanNum / kuantitasNum) * 100;
              setKualitas(kualitasValue.toFixed(15)); // Atur presisi hingga 15 desimal
            } else {
              setKualitas('');
            }
          }}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Kualitas</Text>
        <TextInput
          style={styles.input}
          placeholder="Hasil Kualitas"
          value={kualitas}
          editable={false} // Kualitas hanya sebagai output
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={submitEdit}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  },
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  cardContainer: {
    backgroundColor: '#FFFF',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    margin: 20,
  },
  label: {fontSize: 16, marginTop: 10},
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
  cancelButton: {backgroundColor: '#CCC', padding: 15, borderRadius: 5},
  saveButton: {backgroundColor: '#007BFF', padding: 15, borderRadius: 5},
  buttonText: {color: '#FFF', fontWeight: 'bold'},
});

export default RealisasiTanggung;
