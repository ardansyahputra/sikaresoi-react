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

const EditUraian = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (uuid) {
      fetchEditData(uuid); // Panggil fungsi untuk fetch data edit berdasarkan UUID
      fetchJabatanOptions();
      fetchSatuanOptions();
    }
  }, [uuid]);

  const fetchSatuanOptions = async () => {
    try {
      const response = await apiClient.get('/satuan/show');
      setSatuanOptions(
        response.data.data.map(item => ({
          label: item.nm_satuan,
          value: item.nm_satuan,
        })),
      );
    } catch (error) {
      console.error('Error fetching satuan options:', error);
      Alert.alert('Error', 'Gagal memuat data satuan.');
    }
  };

  const fetchJabatanOptions = async () => {
    try {
      const response = await apiClient.get('/jabatan/show');
      setJabatanOptions(
        response.data.data.map(item => ({
          label: `${item.kd_jabatan} - ${item.nm_jabatan}`,
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
      await apiClient.post(`/uraian/${editData.uuid}/update`, {
        id: editData.id,
        uuid: editData.uuid,
        created_at: editData.created_at,
        updated_at: editData.updated_at,
        tgs_tambahan: editData.tgs_tambahan,
        biaya: editData.biaya,
        angka_kredit: editData.angka_kredit,
        jabatan_id: editData.jabatan_id,
        nm_uraian: editData.nm_uraian,
        wpt: editData.wpt,
        satuan: editData.satuan,
      });
      console.log({
        id: editData.id,
        uuid: editData.uuid,
        created_at: editData.created_at,
        updated_at: editData.updated_at,
        tgs_tambahan: editData.tgs_tambahan,
        biaya: editData.biaya,
        angka_kredit: editData.angka_kredit,
        jabatan_id: editData.jabatan_id,
        nm_uraian: editData.nm_uraian,
        wpt: editData.wpt,
        satuan: editData.satuan,
      });
      Alert.alert('Berhasil', 'Data berhasil diperbarui.');
    } catch (error) {
      if (error.response) {
        // Server memberikan respon error
        const {status, data} = error.response;
        Alert.alert(
          'Error',
          `Gagal memperbarui data. \nStatus: ${status} \nPesan: ${
            data.message || 'Terjadi kesalahan.'
          }`,
        );
        console.error('Detail Error:', data);
      } else if (error.request) {
        // Tidak ada respons dari server
        Alert.alert(
          'Error',
          'Gagal memperbarui data. Server tidak memberikan respons.',
        );
        console.error('Error Request:', error.request);
      } else {
        // Error lain, misalnya konfigurasi
        Alert.alert('Error', `Gagal memperbarui data. Pesan: ${error.message}`);
        console.error('Error Message:', error.message);
      }
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(`/uraian/${uuid}/edit`);

      setEditData(response.data.data); // Simpan data edit di state
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
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
        <Text style={styles.label}>Pangkat</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama Uraian"
          value={editData.nm_uraian || ''} // Pastikan menggunakan default kosong jika null
          onChangeText={text =>
            setEditData(prev => ({...prev, nm_uraian: text}))
          }
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>Jabatan</Text>
        <Dropdown
          style={styles.input}
          data={jabatanOptions}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.jabatan_id} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, jabatan_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />

        <Text style={styles.modalLabel}>Angka Kredit</Text>
        <TextInput
          style={styles.input}
          placeholder="Angka Kredit"
          value={
            editData.angka_kredit !== null &&
            editData.angka_kredit !== undefined
              ? String(editData.angka_kredit)
              : ''
          } // Konversi angka ke string
          onChangeText={
            text => setEditData(prev => ({...prev, angka_kredit: text})) // Tetap simpan sebagai string
          }
          placeholderTextColor={'#B6B9CA'}
        />
        <Text style={styles.modalLabel}>WPT</Text>
        <TextInput
          style={styles.input}
          placeholder="WPT"
          value={
            editData.wpt !== null && editData.wpt !== undefined
              ? String(editData.wpt)
              : ''
          } // Konversi angka ke string
          onChangeText={
            text => setEditData(prev => ({...prev, wpt: text})) // Tetap simpan sebagai string
          }
          placeholderTextColor={'#B6B9CA'}
        />
        <Text style={styles.modalLabel}>Biaya</Text>
        <TextInput
          style={styles.input}
          placeholder="Biaya"
          value={
            editData.wpt !== null && editData.biaya !== undefined
              ? String(editData.biaya)
              : ''
          } // Konversi angka ke string
          onChangeText={
            text => setEditData(prev => ({...prev, biaya: text})) // Tetap simpan sebagai string
          }
          placeholderTextColor={'#B6B9CA'}
        />
        <Text style={styles.modalLabel}>Output</Text>
        <Dropdown
          style={styles.input}
          data={satuanOptions}
          labelField="label"
          valueField="value"
          placeholder="Output"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.satuan}
          onChange={item => setEditData(prev => ({...prev, satuan: item.value}))}
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
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

export default EditUraian;
