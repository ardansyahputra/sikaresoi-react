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

const EditSettingTugas = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [bulanOptions, setBulanOptions] = useState([]);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (uuid) {
      fetchEditData(uuid); // Panggil fungsi untuk fetch data edit berdasarkan UUID
      fetchBulanShow();
      fetchTahunShow();
    }
  }, [uuid]);

  const fetchBulanShow = async () => {
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

  const fetchTahunShow = async () => {
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
      await apiClient.post(
        `/setting_tugas_tambahan/${editData.uuid}/update`,
        {
          bulan_id: editData.bulan_id,
          tahun_id: editData.tahun_id,
          max_persen: editData.max_persen,
          memenuhi_utama: editData.memenuhi_utama,
          persen_utama: editData.persen_utama,
        },
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      Alert.alert('Error', 'Gagal mengirim data.');
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(
        `/setting_tugas_tambahan/${uuid}/edit`,
      );
      setEditData(response.data.data); // Simpan data edit di state
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const memenuhi = [
    {label: 'Ya', value: 1},
    {label: 'Tidak', value: 0},
  ];

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
          placeholder="Uraian"
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
          placeholder="Uraian"
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
        <Text style={styles.label}>Max Persentase Tugas Tambahan</Text>
        <TextInput
          style={styles.input}
          placeholder="Persentase"
          value={
            editData.max_persen !== null && editData.max_persen !== undefined
              ? String(editData.max_persen)
              : ''
          } // Konversi angka ke string
          onChangeText={
            text => setEditData(prev => ({...prev, max_persen: text})) // Tetap simpan sebagai string
          }
          placeholderTextColor={'#B6B9CA'}
        />
        <Text style={styles.label}>Memenuhi Tugas Utama</Text>
        <Dropdown
          style={styles.input}
          data={memenuhi}
          labelField="label"
          valueField="value"
          placeholder="Tugas Utama"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.memenuhi_utama} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, memenuhi_utama: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />
        <Text style={styles.label}>Minimal Persentase Tugas Utama</Text>
        <TextInput
          style={styles.input}
          placeholder="Persentase"
          value={
            editData.persen_utama !== null && editData.persen_utama !== undefined
              ? String(editData.persen_utama)
              : ''
          } // Konversi angka ke string
          onChangeText={
            text => setEditData(prev => ({...prev, persen_utama: text})) // Tetap simpan sebagai string
          }
          placeholderTextColor={'#B6B9CA'}
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

export default EditSettingTugas;
