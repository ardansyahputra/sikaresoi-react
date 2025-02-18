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
import DateRangePicker from 'react-native-modern-datepicker';
import useApiClient from '../../../../src/api/apiClient';

const convertDateFormat = date => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const FormJabatan = ({navigation, route}) => {
  const {type, item} = route.params; // 'create' or 'edit', and the item to edit if 'edit'

  const [formData, setFormData] = useState({
    pimpinan_id: '',
    jabatan_pimpinan_id: '',
    unit_kerja_pimpinan_id: '',
    jabatan_id: '',
    unit_kerja_id: '',
    batas_awal: new Date(),
    batas_akhir: new Date(),
    is_dosen: 0,
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
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const apiClient = useApiClient();

  
  useEffect(() => {
    fetchDropdownOptions();
    if (type === 'edit' && item?.uuid) {
      fetchDataForEdit(item.uuid);
    }
  }, []);

  const fetchDataForEdit = async uuid => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/user/jabatan/${uuid}/edit`, {
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
        apiClient.get(`${endpoint.url}`, {
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
    console.log("populate with data:", data);
    setFormData({
      pimpinan_id: data?.pimpinan_id || '',
      jabatan_pimpinan_id: data?.jabatan_pimpinan_id || '',
      unit_kerja_pimpinan_id: data?.unit_kerja_pimpinan_id || '',
      jabatan_id: data?.jabatan_id || '',
      unit_kerja_id: data?.unit_kerja_id || '',
      batas_awal: data?.batas_awal ? new Date(data.batas_awal) : new Date(),
      batas_akhir: data?.batas_akhir ? new Date(data.batas_akhir) : new Date(),
      is_dosen: data?.is_dosen == 1,
    });
  };


  const toggleDatePicker = () => {
    setDatePickerVisible(!datePickerVisible);
  };

  const handleDateChange = (field, date) => {
    const updatedDate = date.replace(/\//g, '-');
    if (field === 'batas_awal') {
      setSelectedStartDate(updatedDate);
    } else {
      setSelectedEndDate(updatedDate);
    }
  };

  const handleAcceptDateRange = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      batas_awal: new Date(selectedStartDate),
      batas_akhir: new Date(selectedEndDate),
    }));
    setDatePickerVisible(false);
  };

  const handleCancelDateRange = () => {
    setDatePickerVisible(false);
  };

  const setField = (fieldName, value) => {
    setFormData(prev => ({...prev, [fieldName]: value}));
  };

  const handleChangeAktif = async state => {
    setFormData(prevFormData => ({
      ...prevFormData,
      is_dosen: state,
    }));
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

    console.log('payload:', {
      ...formData,
      is_dosen: formData.is_dosen == 1,
      batas_awal: convertDateFormat(formData.batas_awal),
      batas_akhir: convertDateFormat(formData.batas_akhir),
    });

    setLoading(true);
    try {
      const url =
        type === 'create'
          ? '/user/jabatan/create'
          : `/user/jabatan/${item.uuid}/update`;
      const method = type === 'create' ? 'post' : 'post';

      await apiClient({
        method,
        url: `${url}`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        data: {
          ...formData,
          is_dosen: formData.is_dosen == 1,
          batas_awal: convertDateFormat(formData.batas_awal),
          batas_akhir: convertDateFormat(formData.batas_akhir),
        },
      });

      Alert.alert(
        'Sukses',
        `Data berhasil ${type === 'create' ? 'ditambahkan' : 'diperbarui'}.`,
      );

      navigation.goBack();
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
      <View style={styles.header1}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="#000" />
              </TouchableOpacity>
              <Image
                  source={require('../../../assets/images/sikaresoi.png')}
                  style={styles.headerImage}
              />
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
          labelStyle={styles.dropdownLabel} // Label font Poppins
          selectedTextStyle={styles.selectedTextStyle} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
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
          labelStyle={styles.dropdownLabel} // Label font Poppins
          selectedTextStyle={styles.selectedTextStyle} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
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
          labelStyle={styles.dropdownLabel} // Label font Poppins
          selectedTextStyle={styles.selectedTextStyle} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
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
          labelStyle={styles.dropdownLabel} // Label font Poppins
          selectedTextStyle={styles.selectedTextStyle} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
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
          labelStyle={styles.dropdownLabel} // Label font Poppins
          selectedTextStyle={styles.selectedTextStyle} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
          data={dropdownOptions.unit_kerja}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Unit Kerja"
          value={formData.unit_kerja_id}
          onChange={item => setField('unit_kerja_id', item.value)}
        />

        {/* Date Picker Display */}
        <Text style={styles.label}>
          Periode <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity onPress={toggleDatePicker} style={styles.datePicker}>
          <Text style={styles.dateText}>
            {formData.batas_awal
              ? `${formData.batas_awal?.toLocaleDateString()} / ${formData.batas_akhir?.toLocaleDateString()}`
              : 'Pilih Tanggal'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
          
        {/* Date Picker Modal */}
        {datePickerVisible && (
          <View style={styles.datePickerContainer}>  
          <View style={styles.datePickerModal}>
            <DateRangePicker
              selected={
                formData.batas_awal
                  ? formData.batas_awal.toLocaleDateString()
                  : new Date().toLocaleDateString()
              }
              mode="calendar"
              display="default"
              onSelectedChange={date => {
                handleDateChange('batas_awal', date);
              }}
            />
            <DateRangePicker
              selected={
                formData.batas_akhir
                  ? formData.batas_akhir.toLocaleDateString()
                  : new Date().toLocaleDateString()
              }
              mode="calendar"
              display="default"
              onSelectedChange={date => {
                handleDateChange('batas_akhir', date);
              }}
            />
            <View style={styles.datePickerButtons}>
              <TouchableOpacity
                onPress={handleAcceptDateRange}
                style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelDateRange}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        )}
          

        {/* Switch Dosen */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Dosen</Text>
          <Switch value={formData.is_dosen} onValueChange={handleChangeAktif} />
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

  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backButton: {
    marginTop:1,
    marginLeft:3,
    marginRight:1,
    opacity: 0.4,
  },
  formContainer: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 30,
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
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-Regular",
    color: '#999999',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#333333',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
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
    fontFamily: "Poppins-Regular",
    color: '#333333',
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerModal: {
    padding: 20,
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
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-Bold",
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
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular', // Poppins untuk teks item
    fontSize: 14,
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-Regular', // Placeholder font Poppins
    fontSize: 14,
  },
  dropdownLabel: {
    fontFamily: 'Poppins-SemiBold', // Label font Poppins
    fontSize: 16,
  },
});

export default FormJabatan;
