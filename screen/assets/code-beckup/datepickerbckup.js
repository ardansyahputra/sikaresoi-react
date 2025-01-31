import React, {useState, useEffect} from 'react';
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
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-modern-datepicker';
import axios from 'axios';

const getDropdownDate = date => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const fromDropdownToDate = date => {
  return new Date(`${date.year}-${date.month}-${date.day}`);
};

const FormJabatan = ({ navigation, route }) => {
  const {type, item} = route.params; // 'create' or 'edit', and the item to edit if 'edit'
  
  const [formData, setFormData] = useState({
    pimpinan_id: '',
    jabatan_pimpinan_id: '',
    unit_kerja_pimpinan_id: '',
    jabatan_id: '',
    unit_kerja_id: '',
    batas_awal: getDropdownDate(new Date()),
    batas_akhir: getDropdownDate(new Date()),
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
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const baseURL = 'http://192.168.60.230:8000/api/v1';
  const token = 'Bearer ';

  useEffect(() => {
    fetchDropdownOptions();
    if (type === 'edit' && item?.uuid) {
      fetchDataForEdit(item.uuid);
    }
  }, []);

  const fetchDataForEdit = async uuid => {
    try {
      setLoading(true);

      const response = await axios.get(`${baseURL}/user/jabatan/${uuid}/edit`, {
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = response.data?.data;
      if (data) {
        console.log('Data fetched:', data);
        populateFormData(data);
      }
    } catch (error) {
      console.error('Error fetching data for edit:', {
        response: error.response,
      });
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat memuat data untuk pengeditan.',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      setDropdownLoading(true);
      const endpoints = [
        {key: 'pimpinan', url: '/user_master/show'},
        {key: 'jabatan_pimpinan', url: '/jabatan/show'},
        {key: 'unit_kerja_pimpinan', url: '/unit_kerja/show'},
        {key: 'jabatan', url: '/jabatan/show'},
        {key: 'unit_kerja', url: '/unit_kerja/show'},
      ];

      const requests = endpoints.map(endpoint =>
        axios.get(`${baseURL}${endpoint.url}`, {
          headers: {Authorization: token},
        }),
      );

      const responses = await Promise.all(requests);

      const newOptions = {};
      responses.forEach((response, index) => {
        const {key} = endpoints[index];
        newOptions[key] = (response.data?.data || []).map(item => ({
          label:
            item.name || item.nm_jabatan || item.nm_unit_kerja || 'Unknown',
          value: item.id,
        }));
      });

      setDropdownOptions(newOptions);
    } catch (error) {
      console.error(
        'Error fetching dropdown options:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Terjadi kesalahan saat memuat opsi dropdown.');
    } finally {
      setDropdownLoading(false);
    }
  };

  const populateFormData = data => {
    setFormData({
      pimpinan_id: data?.pimpinan_id || '',
      jabatan_pimpinan_id: data?.jabatan_pimpinan_id || '',
      unit_kerja_pimpinan_id: data?.unit_kerja_pimpinan_id || '',
      jabatan_id: data?.jabatan_id || '',
      unit_kerja_id: data?.unit_kerja_id || '',
      batas_awal: data?.batas_awal
        ? getDropdownDate(new Date(data.batas_awal))
        : getDropdownDate(new Date()),
      batas_akhir: data?.batas_akhir
        ? getDropdownDate(new Date(data.batas_akhir))
        : getDropdownDate(new Date()),  
      is_dosen: data?.is_dosen || false,
    });
  };

  const toggleDataPicker = () => {
    setDatePickerVisible(!datePickerVisible);
  };

  const onDateChange = (fieldName, selectedDate) => {
    const formattedDate = getDropdownDate(new Date(selectedDate));
    setField(fieldName, formattedDate);
  };  

  const setField = (fieldName, value) => {
    setFormData(prev => ({...prev, [fieldName]: value}));
  };

  const handleChangeAktif = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/user/jabatan/${item.uuid}/changeAktif`,
        {headers: {Authorization: token,
          Accept: 'application/json',

        }},
      );
      console.log('Response:', response.data); // Menggunakan respons untuk debug/logging
      Alert.alert('Sukses', 'Status berhasil diubah');
      fetchDataForEdit(item.uuid);
    } catch (error) {
      console.error(
        'Error merubah status',
        error.response?.data || error.message,
      );
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengubah status');
    }
  };

  const handleSave = async () => {
    if (
      !formData.pimpinan_id ||
      !formData.jabatan_pimpinan_id ||
      !formData.unit_kerja_pimpinan_id ||
      !formData.jabatan_id ||
      !formData.unit_kerja_id
    ) {
      Alert.alert('Validasi', 'Harap isi semua field yang diperlukan.');
      return;
    }

    setLoading(true);
    try {
      const url =
        type === 'create'
          ? '/user/jabatan/create'
          : `/user/jabatan/${item.uuid}/update`;
      const method = type === 'create' ? 'post' : 'post';

      await axios({
        method,
        url: `${baseURL}${url}`,
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data: {
          ...formData,
          batas_awal: fromDropdownToDate(formData.batas_awal),
          batas_akhir: fromDropdownToDate(formData.batas_akhir),
        },
      });

      Alert.alert(
        'Sukses',
        `Data berhasil ${type === 'create' ? 'ditambahkan' : 'diperbarui'}.`,
      );
      navigation.goBack({ refresh: true });
    } catch (error) {
      console.error(
        'Error saving data:',
        error.response?.data || error.message,
      );
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
            source={require('../../../assets/images/sikaresoi.png')}
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
        <Text style={styles.title}>
          {type === 'create' ? 'Tambah Data Jabatan' : 'Edit Data Jabatan'}
        </Text>

        {/* Dropdown Pimpinan */}
        <Text style={styles.label}>
          Pilih Pimpinan <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          loading={dropdownLoading}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.pimpinan}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Pimpinan"
          value={formData.pimpinan_id}
          onChange={item => setField('pimpinan_id', item.value)}
        />

        {/* Dropdown Jabatan Pimpinan */}
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
          onChange={item => setField('jabatan_pimpinan_id', item.value)}
        />

        {/* Dropdown Unit Kerja Pimpinan */}
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
          onChange={item => setField('unit_kerja_pimpinan_id', item.value)}
        />

        {/* Dropdown Jabatan */}
        <Text style={styles.label}>
          Pilih Jabatan <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.jabatan}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan"
          value={formData.jabatan_id}
          onChange={item => setField('jabatan_id', item.value)}
        />

        {/* Dropdown Unit Kerja */}
        <Text style={styles.label}>
          Pilih Unit Kerja <Text style={styles.required}>*</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownOptions.unit_kerja}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Unit Kerja"
          value={formData.unit_kerja_id}
          onChange={item => setField('unit_kerja_id', item.value)}
        />

        {/* Date Picker */}
        <Text style={styles.label}>
          Periode <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity onPress={toggleDataPicker} style={styles.datePicker}>
          <Text style={styles.dateText}>
            {formData.batas_awal
              ? `${formData.batas_awal.day} - ${formData.batas_awal.month} - ${formData.batas_awal.year}`
              : 'Pilih Tanggal'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
        {datePickerVisible && (
          <DatePicker
            value={formData.batas_awal || getDropdownDate(new Date())}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              onDateChange('batas_awal', selectedDate); // Pass fieldName and selectedDate
            }}
          />
        )}
        <TouchableOpacity onPress={toggleDataPicker} style={styles.datePicker}>
          <Text style={styles.dateText}>
            {formData.batas_akhir
              ? `${formData.batas_akhir.day} - ${formData.batas_akhir.month} - ${formData.batas_akhir.year}`
              : 'Pilih Tanggal'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
        {datePickerVisible && (
          <DatePicker
            value={formData.batas_akhir || getDropdownDate(new Date())}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              onDateChange('batas_akhir', selectedDate); // Pass fieldName and selectedDate
            }}
          />
        )}

        {/* Switch Dosen */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Dosen</Text>
          <Switch
            value={formData.aktif == 1}
            onValueChange={value => handleChangeAktif()}
          />
        </View>

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
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 20,
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
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#d9534f',
    borderRadius: 5,
  },
  acceptButton: {
    padding: 10,
    backgroundColor: '#5cb85c',
    borderRadius: 5,
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
  ButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
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
