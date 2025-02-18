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

  const [formData, setFormData] = useState({
    nm_satuan: '',
    wpt: 0,
    jabatan_id: null, // Will be populated from userJabatanData
    tgs_tambahan: '', // Added tugas tambahan field
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    satuan: [],
  });

  const apiClient = useApiClient();

  useEffect(() => {
    fetchDropdownOptions();
    fetchUserJabatanData();
  }, []);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      if (response?.data?.data) {
        setFormData(prev => ({
          ...prev,
          jabatan_id: response.data.data.jabatan_id,
          tgs_tambahan: response.data.data.tgs_tambahan || '', // Populate tugas tambahan from the response
        }));
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      setDropdownLoading(true);
      const response = await apiClient.get('satuan/show');
      const satuanOptions = (response.data?.data || []).map(item => ({
        label: item.nm_satuan || 'Unknown',
        value: item.satuan, // Use the label as the value since backend expects a string
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
    if (!formData.nm_uraian || !formData.satuan || !formData.wpt || !formData.jabatan_id) {
      Alert.alert('Validasi', 'Harap isi semua field yang diperlukan.');
      return;
    }

    console.log('payload:', formData);

    setLoading(true);
    try {
      const url = '/uraian/create';
      const method = 'post';

      await apiClient({
        method,
        url,
        data: formData,
      });

      Alert.alert('Sukses', `Data berhasil ditambahkan`);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving data:', error.response?.data || error.message);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/sikaresoi.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={[styles.customFont, styles.headerTitle]}></Text>

        <Text style={styles.label}>
          Indikator Kinerja: <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.dropdown}
          placeholder="Nama Uraian"
          data={dropdownOptions.satuan}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          value={formData.nm_satuan}
          onChangeText={text => setField('nm_satuan', text)}
        />

        <Text style={styles.label}>
          Satuan: <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          loading={dropdownLoading}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.satuan}
          labelField="label"
          valueField="value"
          value={formData.nm_satuan}
          onChange={item => setField('satuan', item.value)} // Store the label (string) in formData
        />

        <Text style={styles.label}>
          WPT: <Text style={styles.required}>*</Text>
          </Text>
        <TextInput
          style={styles.dropdown}
          placeholder="Nama Uraian"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          value={formData.wpt.toString()}
          onChangeText={text => setField('wpt', item.value)}
        />

        {/* Button Save dan Cancel */}
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
            onPress={() => navigation.goBack({refresh: true})}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    marginTop: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: 'red',
  },
  dropdown: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333333',
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
