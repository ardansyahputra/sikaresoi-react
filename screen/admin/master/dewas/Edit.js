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

const EditDewas = ({navigation, route}) => {
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [ptkpOptions, setPtkpOptions] = useState([]);
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (uuid) {
      fetchEditData(uuid); // Panggil fungsi untuk fetch data edit berdasarkan UUID
      fetchPangkatOptions();
      fetchPtkpOptions();
    }
  }, [uuid]);

  const fetchPangkatOptions = async () => {
    try {
      const response = await apiClient.get('/pangkat/show');
      setPangkatOptions(
        response.data.data.map(item => ({
          label: `${item.nm_pangkat} - (${item.golongan}/${item.ruang})`,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching satuan options:', error);
      Alert.alert('Error', 'Gagal memuat data satuan.');
    }
  };

  const fetchPtkpOptions = async () => {
    try {
      const response = await apiClient.get('/pajak_ptkp/show');
      setPtkpOptions(
        response.data.data.map(item => ({
          label: item.ptkp,
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
      await apiClient.post(`/user/dewas/${editData.uuid}/update`, {
        created_at: editData.created_at,
        id: editData.id,
        jabatan: editData.jabatan,
        master_ptkp_id: editData.master_ptkp_id,
        name: editData.name,
        nip: editData.nip,
        no_rek: editData.no_rek,
        pangkat_id: editData.pangkat_id,
        percent: editData.percent,
        updated_at: editData.updated_at,
        uuid: editData.uuid,
      });
      Alert.alert('Berhasil', 'Data berhasil diperbarui.');
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui data.');
    }
  };

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(`/user/dewas/${uuid}/edit`);
      setEditData(response.data.data); // Simpan data edit di state
    } catch (error) {
      console.error('Error fetching edit data:', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const jabatan = [
    {label: 'KETUA DEWAN PENGAWAS', value: 'KETUA DEWAN PENGAWAS'},
    {label: 'ANGGOTA', value: 'ANGGOTA'},
    {label: 'SEKRETARIS', value: 'SEKRETARIS'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>NIP / NRP</Text>
        <TextInput
          style={styles.input}
          placeholder="NIP / NRP"
          value={editData.nip || ''} // Pastikan menggunakan default kosong jika null
          onChangeText={text => setEditData(prev => ({...prev, nip: text}))}
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama"
          value={editData.name || ''} // Pastikan menggunakan default kosong jika null
          onChangeText={text => setEditData(prev => ({...prev, name: text}))}
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>Persentase</Text>
        <TextInput
          style={styles.input}
          placeholder="Persentase"
          value={
            editData.percent !== null && editData.percent !== undefined
              ? String(editData.percent)
              : ''
          } // Konversi angka ke string
          onChangeText={
            text => setEditData(prev => ({...prev, percent: text})) // Tetap simpan sebagai string
          }
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>No. Rekening</Text>
        <TextInput
          style={styles.input}
          placeholder="No Rekening"
          value={editData.no_rek || ''} // Pastikan menggunakan default kosong jika null
          onChangeText={text => setEditData(prev => ({...prev, no_rek: text}))}
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>Jabatan</Text>
        <Dropdown
          style={styles.input}
          data={jabatan}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.jabatan} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, jabatan: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />

        <Text style={styles.label}>Pangkat/Gol. Ruang</Text>
        <Dropdown
          style={styles.input}
          data={pangkatOptions}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.pangkat_id} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, pangkat_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />

        <Text style={styles.label}>Status PTKP</Text>
        <Dropdown
          style={styles.input}
          data={ptkpOptions}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan"
          placeholderStyle={{color: '#B6B9CA'}}
          value={editData.master_ptkp_id} // Menggunakan `jabatan_id` sebagai value
          onChange={
            item => setEditData(prev => ({...prev, master_ptkp_id: item.value})) // Perbarui `jabatan_id` sesuai pilihan
          }
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

export default EditDewas;
