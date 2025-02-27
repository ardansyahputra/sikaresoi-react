import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddUraian = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [tgsTambahan, setTgsTambahan] = useState(false);

  const [formData, setFormData] = useState({
    nm_uraian: '',
    satuan: '',
    wpt: 0,
    jabatan_id: 0,
    tgs_tambahan: tgsTambahan,
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    satuan: [],
  });

  const apiClient = useApiClient();

  useEffect(() => {
    fetchDropdownOptions();
    fetchUserJabatanData();
    fetchUraian();
  }, []);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      console.log('Jabatan Id:', response.data.data.jabatan_id); // Log the API response
      if (response?.data?.data) {
        setFormData(prev => ({
          ...prev,
          jabatan_id: response.data.data.jabatan_id,
        }));
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const fetchUraian = async () => {
    try {
      const response = await apiClient.post('uraian/indexAndro_user');
      console.log('tgs tambahan:', response.data.data.tgs_tambahan); // Debugging log
  
      if (response?.data?.data) {
        // If you need to set tgs_tambahan based on some condition, do it here
        setFormData(prev => ({
          ...prev,
          tgs_tambahan: false, // Set to false or based on some condition
        }));
      }
    } catch (error) {
      console.error('Error fetching uraian:', error);
      Alert.alert('Error', 'Gagal memuat data Tugas Tambahan.');
    }
  };


  const fetchDropdownOptions = async () => {
    try {
      setDropdownLoading(true);
      const response = await apiClient.get('satuan/show');
      const satuanOptions = (response.data?.data || []).map(item => ({
        label: item.nm_satuan || 'Unknown',
        value: item.satuan, // Ensure this matches the expected value
      }));
      setDropdownOptions({ satuan: satuanOptions });
    } catch (error) {
      console.error('Error fetching dropdown options:', error.response?.data || error.message);
      Alert.alert('Error', 'Terjadi kesalahan saat memuat opsi dropdown.');
    } finally {
      setDropdownLoading(false);
    }
  };

  const setField = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = async () => {
  console.log('Form Data Before Validation:', formData); // Log formData before validation
  if (!formData.nm_uraian || !formData.satuan || !formData.wpt || !formData.jabatan_id) {
    Alert.alert('Validasi', 'Harap isi semua field yang diperlukan.');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      ...formData,
      wpt: formData.wpt.toString(), // Ensure wpt is a string
      tgs_tambahan: formData.tgs_tambahan, // Ensure tgs_tambahan is a boolean
    };
    console.log('Payload Being Sent:', payload); // Log the payload before API call
    await apiClient.post('/uraian/create', payload);
    Alert.alert('Sukses', 'Data berhasil ditambahkan');
    navigation.navigate('MasterKinerja');
  } catch (error) {
    console.error('Error saving data:', error.response?.data || error.message);
    Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data.');
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>

        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Tambah Indikator
          </Text>
        </View>

        <Text style={styles.label}>
          Indikator Kinerja: <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholderStyle={styles.placeholderStyle}
          placeholder="Nama Uraian"
          value={formData.nm_uraian}
          onChangeText={text => setField('nm_uraian', text)}
        />

        <Text style={styles.label}>
          Satuan: <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          loading={dropdownLoading}
          style={styles.input}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.satuan}
          labelField="label"
          valueField="value"
          placeholder="Pilih Satuan"
          value={formData.satuan} 
          onChange={item => setField('satuan', item.label) }
          
        />

        <Text style={styles.label}>
          WPT: <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholderStyle={styles.placeholderStyle}
          placeholder="WPT"
          value={formData.wpt}
          onChangeText={text => setField('wpt', text.replace(/\D/g, ''))} // Ensure only numbers are entered
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Simpan</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F7F8FB',
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Mengatur agar judul header berada di tengah
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute', // Menetapkan header tetap di atas
    top: 0,
    left: 0,
    right: 0, // Menjaga agar header tetap lebar penuh
    zIndex: 10, // Memberikan prioritas rendering agar header tidak tertutup oleh konten
  },
  formContainer: {
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  titleContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  backButton: {
    opacity: 0.4,
  },
  backButtonContainer: {
    marginTop: -8,
    marginLeft:-8,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: 'red',
  },
  input: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 16,
    opacity: 0.3,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 15,
    height: 50,
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#d1f3f1',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#1bc5bd',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fad1df',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ff0004',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddUraian;
