import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';

const EditRewardPunishment = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [bulanOptions, setBulanOptions] = useState([]);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [Tanggal, setTanggal] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (uuid) {
      fetchEditData(uuid); // Panggil fungsi untuk fetch data edit berdasarkan UUID
      fetchBulan();
      fetchTahun();
    }
  }, [uuid]);

  const fetchBulan = async () => {
    try {
      const response = await apiClient.get('/bulan/show', {});
      setBulanOptions(
        response.data.data.map(item => ({
          label: item.bulan,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const fetchTahun = async () => {
    try {
      const response = await apiClient.get('/tahun/show', {});
      setTahunOptions(
        response.data.data.map(item => ({
          label: item.tahun,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };

  const submitEdit = async () => {
    try {
      await apiClient.post(`/reward_punishment/${editData.uuid}/update`, {
        tanggal: Tanggal,
        bulan_id: editData.bulan_id,
        tahun_id: editData.tahun_id,
      });
      Alert.alert('Berhasil', 'Data berhasil diperbarui.');
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui data.');
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(`/reward_punishment/${uuid}/edit`);
      const responseData = response.data.data;
      // Pastikan tanggal diatur dalam format 'YYYY/MM/DD'
    if (responseData.tanggal) {
      const formattedDate = responseData.tanggal.replace(/-/g, '/');
      setTanggal(formattedDate);
    }
      setEditData(responseData);
      setTanggal(responseData.tanggal || ''); // Fix: Use responseData instead of undefined data
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const handleDateChange = (date) => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggal(formattedDate);
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev); // Toggle visibility
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Bulan</Text>
        <Dropdown
          style={styles.input}
          data={bulanOptions}
          labelField="label"
          valueField="value"
          placeholder="Bulan"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.bulan_id} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, bulan_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />

        <Text style={styles.label}>Tahun</Text>
        <Dropdown
          style={styles.input}
          data={tahunOptions}
          labelField="label"
          valueField="value"
          placeholder="Tahun"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.tahun_id} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, tahun_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />
        <Text style={styles.label}>Tanggal Pelanggaran</Text>
        <TouchableOpacity style={styles.input} onPress={toggleDatePicker}>
          <Text>{Tanggal || 'Pilih Tanggal'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DatePicker
            mode="calendar"
            onDateChange={handleDateChange}
            current={Tanggal || new Date().toISOString().split('T')[0].replace(/-/g, '/')}
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
  container: {flex: 1, backgroundColor: '#E7E9F1', paddingTop: 20}, // Menambahkan padding top agar header tidak terpotong
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
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'}, // Mengubah agar text header tetap berada di tengah
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
    marginTop: 37, // Memberikan margin agar konten tidak tumpang tindih dengan header
  },
  label: {fontSize: 16, marginTop: 10},
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 195, // Adjust this value to make sure dropdown is below the input field
    left: 20,
    right: 180,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 5,
    shadowColor: '#000', // Menambahkan bayangan
    shadowOffset: {width: 0, height: 2}, // Menyesuaikan posisi bayangan
    shadowOpacity: 0.3, // Menyesuaikan intensitas bayangan
    shadowRadius: 5, // Menyesuaikan kelembutan bayangan
    elevation: 5, // Memberikan bayangan di perangkat Android
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {backgroundColor: '#CCC', padding: 15, borderRadius: 5},
  saveButton: {backgroundColor: '#007BFF', padding: 15, borderRadius: 5},
  buttonText: {color: '#FFF', fontWeight: 'bold'},
  dropdownItem: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
  },
});

export default EditRewardPunishment;
