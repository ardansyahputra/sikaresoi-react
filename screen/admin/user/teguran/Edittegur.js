import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import useApiClient from '../../../../src/api/apiClient';

const Edittegur = ({ route, navigation }) => {
  const [user, setUser] = useState(null);  // user object is now null initially
  const [signatures, setSignatures] = useState([]);
  const [jenis, setJenis] = useState('');
  const [tanggalPelanggaran, setTanggalPelanggaran] = useState('');
  const [potongan, setPotongan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rightSignature, setRightSignature] = useState(null);
  const apiClient = useApiClient();
  const { uuid } = route.params || {};

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await apiClient(`/user_master/show`);
        const data = response.data || await response.json();
        if (data && data.res.code === 200) {
          const signatureData = data.data.map(user => ({
            label: user.name,
            value: user.id,  // Ensure correct mapping of the user id
          }));
          setSignatures(signatureData);
        }
      } catch (error) {
        console.error('Error fetching signature data:', error);
      }
    };

    fetchSignatures();
  }, []);

  useEffect(() => {
    if (uuid) {
      fetchData(uuid);
    }
  }, [uuid]);

  const fetchData = async (uuid) => {
    try {
      const response = await apiClient.get(`/teguran/${uuid}/edit`);
      if (response?.data?.data) {
        const data = response.data.data;
        setUser(data.user || {}); // Ensure user data is fetched
        setJenis(data.jenis || '');
        setTanggalPelanggaran(data.tgl_pelanggaran || '');
        setPotongan(data.potongan?.toString() || '');
        setKeterangan(data.pesan || '');
        setRightSignature(data.user?.signature || null);
      } else {
        Alert.alert('Error', 'Data tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Gagal memuat data.');
    }
  };

  const handleSave = async () => {
    console.log('user:', user);  // Debug log
    console.log('jenis:', jenis);  // Debug log
    console.log('tanggalPelanggaran:', tanggalPelanggaran);  // Debug log
    console.log('potongan:', potongan);  // Debug log
    console.log('keterangan:', keterangan);  // Debug log
  
    if (!user || !user.id || !jenis || !tanggalPelanggaran || !potongan || !keterangan) {
      Alert.alert('Error', 'Harap isi semua data sebelum menyimpan.');
      return;
    }
  
    const payload = {
      user_id: user.id,
      jenis,
      tgl_pelanggaran: tanggalPelanggaran,
      potongan,
      pesan: keterangan,
    };
  
    try {
      let response;
      if (uuid) {
        response = await apiClient.post(`/teguran/${uuid}/update`, payload);
      } else {
        response = await apiClient.post('/teguran/create', payload);
      }
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sukses', 'Data berhasil disimpan.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Gagal menyimpan data.');
      }
    } catch (error) {
      console.error('Error saving data:', error.response?.data || error.message);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data.');
    }
  };
  
  
  const handleDateChange = (date) => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggalPelanggaran(formattedDate);
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev); // Toggle visibility
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>User *</Text>
        <Dropdown
  style={styles.dropdown}
  data={signatures}
  labelField="label"
  valueField="value"
  placeholder={user ? user.name : "User"}
  search
  searchPlaceholder="Cari User"
  value={user ? user.id : null}  // value harusnya id
  onChange={item => {
    const selectedUser = signatures.find(s => s.value === item.value);
    setUser(selectedUser);  // Update user dengan objek lengkap
  }}  
/>


        <Text style={styles.label}>Jenis</Text>
        <TextInput
          style={styles.input}
          value={jenis}
          onChangeText={setJenis}
          placeholder="Masukkan Jenis"
        />

        <Text style={styles.label}>Tanggal Pelanggaran</Text>
        <TouchableOpacity style={styles.input} onPress={toggleDatePicker}>
          <Text>{tanggalPelanggaran || 'Pilih Tanggal'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DatePicker
            mode="calendar"
            onDateChange={handleDateChange}
            options={{
              textHeaderColor: '#007BFF',
              textDefaultColor: '#333',
              selectedTextColor: '#FFF',
              mainColor: '#007BFF',
              textSecondaryColor: '#B0B0B0',
              borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
          />
        )}

        <Text style={styles.label}>Potongan %</Text>
        <TextInput
          style={styles.input}
          value={potongan}
          onChangeText={setPotongan}
          keyboardType="numeric"
          placeholder="Masukkan Potongan dalam Persen"
        />

        <Text style={styles.label}>Keterangan/Pesan</Text>
        <TextInput
          style={styles.input}
          value={keterangan}
          onChangeText={setKeterangan}
          placeholder="Masukkan Keterangan atau Pesan"
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
      marginVertical: 20,
      marginHorizontal: 10,
      marginTop: 60,
      width: 387,
    },
    label: {
      fontSize: 16,
      marginTop: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#CCC',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
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

export default Edittegur;
