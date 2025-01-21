import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';

const TambahPa = ({ route, navigation }) => {
  const [jenisAlasan, setJenisAlasan] = useState([]);
  const [jenis, setJenis] = useState('');
  const [tanggalPelanggaran, setTanggalPelanggaran] = useState('');
  const [potongan, setPotongan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [name, setName] = useState('');
  const apiClient = useApiClient();
  const { userId, userName } = route.params || {};

  useEffect(() => {
    fetchJenisAlasan();
  });

  const fetchJenisAlasan = async () => {
    try {
      const response = await apiClient(`/pemotongan_tidak_hadir/show`);
      const data = response.data || await response.json();
      if (data && data.res.code === 200) {
        const alasanData = data.data.map(item => ({
          label: item.jenis_alasan,
          value: item.id,
        }));
        setJenisAlasan(alasanData);
      }
    } catch (error) {
      console.error('Error fetching jenis alasan data:', error);
    }
  };

  const handleSave = async () => {  
  
    const payload = {
      name: userName,
      pemotongan_tidak_hadir_id: jenis,
      tanggal: tanggalPelanggaran,
      user_id: userId || 2,
    };
  
    console.log('Payload to be sent:', payload);
  
    try {
      const response = await apiClient.post('/admin/absensi/change', payload);
  
      console.log('API Response:', response);
  
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sukses', 'Data berhasil disimpan.');
        navigation.goBack();
      } else {
        console.log('API Response Error:', response.data);
        Alert.alert('Error', 'Gagal menyimpan data.');
      }
    } catch (error) {
      if (error.response) {
        // Error dengan respons dari server
        console.error('API Error Response:', error.response.data);
        console.log('API Error Status:', error.response.status);
      } else if (error.request) {
        // Error karena tidak ada respons dari server
        console.error('API Error Request:', error.request);
      } else {
        // Error lainnya
        console.error('General Error:', error.message);
      }
  
      console.error('Error Stack Trace:', error.stack);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Ubah Presensi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{userName || 'Nama Tidak Ditemukan'}</Text>
        </View>
        <Text style={styles.label}>Jenis Alasan *</Text>
        <Dropdown
          style={styles.dropdown}
          data={jenisAlasan}
          labelField="label"
          valueField="value"
          placeholder="Pilih Alasan"
          value={jenis}
          onChange={item => {
            setJenis(item.value);
          }}
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E9F1',
  },
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
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 5,
    marginHorizontal: 10,
    marginTop: 60,
  },
  nameContainer: {
    backgroundColor: '#F0F4F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 10,
    backgroundColor: '#F9F9F9',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default TambahPa;