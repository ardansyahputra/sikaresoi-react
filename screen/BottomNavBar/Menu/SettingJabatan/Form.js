import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const FormJabatan = ({ navigation, route }) => {
  const { type, item } = route.params; // 'create' or 'edit', and the item to edit if 'edit'

  const [formData, setFormData] = useState({
    pimpinan_id: '',
    jabatan_pimpinan_id: '',
    unit_kerja_pimpinan_id: '',
    jabatan_id: '',
    unit_kerja_id: '',
    batas_datePicker: new Date(),
    is_dosen: false,
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    pimpinan: [],
    jabatan_pimpinan: [],
    unit_kerja_pimpinan: [],
    jabatan: [],
    unit_kerja: [],
  });

  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const baseURL = 'http://192.168.60.230:8000/api/v1'; 
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2ODIxMzMyLCJleHAiOjE3MzY4MzIxMDgsIm5iZiI6MTczNjgyODUwOCwianRpIjoiR05leGF5a2FEemY0MDJLTCIsInN1YiI6MzAsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.UKZmY2qspjU_uSwttNjt1I1j5obnYUrkZjnRVEx_Nzc';

  useEffect(() => {
    fetchDropdownOptions();
    if (type === 'edit' && item) {
      populateFormData(item);
    }
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      // Fetch Pimpinan
      const pimpinanResponse = await axios.get(`${baseURL}/user_master/show`, {
        headers: { Authorization: token },
      });
      setDropdownOptions((prev) => ({
        ...prev,
        pimpinan: (pimpinanResponse.data?.data || []).map((pimp) => ({
          label: pimp.name || 'Unknown Name', // Pastikan key sesuai dengan API
          value: pimp.id,
        })),
      }));
  
      // Fetch Jabatan Pimpinan
      const jabatanPimpinanResponse = await axios.get(`${baseURL}/jabatan/show`, {
        headers: { Authorization: token },
      });
      setDropdownOptions((prev) => ({
        ...prev,
        jabatan_pimpinan: (jabatanPimpinanResponse.data?.data || []).map((jab) => ({
          label: jab.nm_jabatan || 'Unknown Jabatan',
          value: jab.id,
        })),
      }));
  
      // Fetch Unit Kerja Pimpinan
      const unitKerjaPimpinanResponse = await axios.get(`${baseURL}/unit_kerja/show`, {
        headers: { Authorization: token },
      });
      setDropdownOptions((prev) => ({
        ...prev,
        unit_kerja_pimpinan: (unitKerjaPimpinanResponse.data?.data || []).map((unit) => ({
          label: unit.nm_unit_kerja || 'Unknown Unit',
          value: unit.id,
        })),
      }));
  
      // Fetch Jabatan
      const jabatanResponse = await axios.get(`${baseURL}/jabatan/show`, {
        headers: { Authorization: token },
      });
      setDropdownOptions((prev) => ({
        ...prev,
        jabatan: (jabatanResponse.data?.data || []).map((jab) => ({
          label: jab.nm_jabatan || 'Unknown Jabatan',
          value: jab.id,
        })),
      }));
  
      // Fetch Unit Kerja
      const unitKerjaResponse = await axios.get(`${baseURL}/unit_kerja/show`, {
        headers: { Authorization: token },
      });
      setDropdownOptions((prev) => ({
        ...prev,
        unit_kerja: (unitKerjaResponse.data?.data || []).map((unit) => ({
          label: unit.nm_unit_kerja || 'Unknown Unit',
          value: unit.id,
        })),
      }));
    } catch (error) {
      console.error('Error fetching dropdown options:', error.response?.data || error.message);
      Alert.alert('Error', 'Terjadi kesalahan saat memuat opsi dropdown.');
    }
  };  

  const populateFormData = (item) => {
    setFormData({
      pimpinan_id: item?.pimpinan_id || '',
      jabatan_pimpinan_id: item?.jabatan_pimpinan_id || '',
      unit_kerja_pimpinan_id: item?.unit_kerja_pimpinan_id || '',
      jabatan_id: item?.jabatan_id || '',
      unit_kerja_id: item?.unit_kerja_id || '',
      batas_datePicker: item?.batas_datePicker ? new Date(item.batas_datePicker) : new Date(),
      is_dosen: item?.is_dosen || false,
    });
  };
  

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validasi sederhana
    if (
      !formData.pimpinan_id ||
      !formData.jabatan_pimpinan_id ||
      !formData.unit_kerja_pimpinan_id ||
      !formData.jabatan_id ||
      !formData.unit_kerja_id ||
      !formData.batas_datePicker
    ) {
      Alert.alert('Validasi', 'Harap isi semua field yang diperlukan.');
      return;
    }

    setLoading(true);
    try {
      if (type === 'create') {
        // Create data
        await axios.post(
          `${baseURL}/jabatan`,
          {
            ...formData,
            batas_datePicker: formData.batas_datePicker.toISOString(), // Format tanggal sesuai kebutuhan API
          },
          { headers: { Authorization: token } }
        );
        Alert.alert('Sukses', 'Data berhasil ditambahkan.');
      } else if (type === 'edit') {
        // Update data
        await axios.put(
          `${baseURL}/user/jabatan/${uuid}/edit`,
          {
            ...formData,
            batas_datePicker: formData.batas_datePicker.toISOString(),
          },
          { headers: { Authorization: token } }
        );
        Alert.alert('Sukses', 'Data berhasil diperbarui.');
      }
      navigation.goBack(); // Kembali ke layar sebelumnya
    } catch (error) {
      console.error('Error saving data:', error.response?.data || error.message);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      handleChange('batas_datePicker', selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  source={require('../../../assets/images/sikaresoi.png')}
                  style={styles.logo}
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
                <TouchableOpacity style={styles.iconWrapper}>
                  <Ionicons name="person-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {type === 'create' ? 'CREATE DATA' : 'UPDATE DATA'}
        </Text>

        {/* Pimpinan Dropdown */}
        <Text style={styles.label}>
          Pilih Pimpinan <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.pimpinan}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Pimpinan"
          value={formData.pimpinan_id}
          onChange={(item) => {
            handleChange('pimpinan_id', item.value);
          }}
        />

        {/* Jabatan Pimpinan Dropdown */}
        <Text style={styles.label}>
          Pilih Jabatan Pimpinan <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.jabatan_pimpinan}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan Pimpinan"
          value={formData.jabatan_pimpinan_id}
          onChange={(item) => {
            handleChange('jabatan_pimpinan_id', item.value);
          }}
        />

        {/* Unit Kerja Pimpinan Dropdown */}
        <Text style={styles.label}>
          Pilih Unit Kerja Pimpinan <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.unit_kerja_pimpinan}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Unit Kerja Pimpinan"
          value={formData.unit_kerja_pimpinan_id}
          onChange={(item) => {
            handleChange('unit_kerja_pimpinan_id', item.value);
          }}
        />

        {/* Jabatan Anda Dropdown */}
        <Text style={styles.label}>
          Pilih Jabatan Anda <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.jabatan}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan Anda"
          value={formData.jabatan_id}
          onChange={(item) => {
            handleChange('jabatan_id', item.value);
          }}
        />

        {/* Unit Kerja Anda Dropdown */}
        <Text style={styles.label}>
          Pilih Unit Kerja Anda <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.unit_kerja}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Unit Kerja Anda"
          value={formData.unit_kerja_id}
          onChange={(item) => {
            handleChange('unit_kerja_id', item.value);
          }}
        />

        {/* Periode Date Picker */}
        <Text style={styles.label}>
          Periode <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
          <Text style={styles.dateText}>
            {formData.batas_datePicker
              ? formData.batas_datePicker.toLocaleDateString()
              : 'Select Date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
        {datePickerVisible && (
          <DateTimePicker
            value={formData.batas_datePicker || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Switch Dosen */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Dosen</Text>
          <Switch
            value={formData.is_dosen}
            onValueChange={(value) => handleChange('is_dosen', value)}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>SIMPAN</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>BATAL</Text>
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
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FormJabatan;
