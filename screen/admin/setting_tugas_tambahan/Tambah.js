import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import Jabatan from '../presensi/Presensi';

const TambahSettingTugas = ({navigation}) => {
  const [bulanOptions, setBulanOptions] = useState([]);
  const [pickBulanOptions, setPickBulanOptions] = useState([]);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [pickTahunOptions, setPickTahunOptions] = useState([]);
  const [pickMemenuhiOptions, setPickMemenuhiOptions] = useState([]);
  const [isPersentaseEnabled, setIsPersentaseEnabled] = useState(false);
  const [selectedPersentase, setSelectedPersentase] = useState('');
  const [selectedPersenUtama, setSelectedPersenUtama] = useState('');
  const apiClient = useApiClient();

  useEffect(() => {
    fetchBulanShow();
    fetchTahunShow();
    if (pickMemenuhiOptions === '1') {
      setIsPersentaseEnabled(true);
    } else {
      setIsPersentaseEnabled(false);
      setSelectedPersenUtama('0'); // Reset ke 0 jika "Tidak" dipilih
    }
  }, [pickMemenuhiOptions]);

  const submitTambah = async () => {
    try {
      await apiClient.post('/setting_tugas_tambahan/create', {
        bulan_id: pickBulanOptions,
        tahun_id: pickTahunOptions,
        memenuhi_utama: pickMemenuhiOptions,
        max_persen: selectedPersentase,
        persen_utama: selectedPersenUtama,
      });

      Alert.alert('Berhasil', 'Data berhasil ditambahkan.');
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      Alert.alert('Error', 'Gagal menambahkan data.');
    }
  };

  const fetchBulanShow = async () => {
    try {
      const response = await apiClient.get('/bulan/show', {});
      2;
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
      2;
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

  const memenuhi = [
    {label: 'Ya', value: '1'},
    {label: 'Tidak', value: '0'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.modalLabel}>Bulan</Text>
        <Dropdown
          style={styles.modalInput}
          data={bulanOptions}
          labelField="label"
          valueField="value"
          placeholder="Bulan"
          placeholderStyle={{color: '#B6B9CA'}}
          value={pickBulanOptions}
          onChange={item => setPickBulanOptions(item.value)}
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />
        <Text style={styles.modalLabel}>Tahun</Text>
        <Dropdown
          style={styles.modalInput}
          data={tahunOptions}
          labelField="label"
          valueField="value"
          placeholder="Tahun"
          placeholderStyle={{color: '#B6B9CA'}}
          value={pickTahunOptions}
          onChange={item => setPickTahunOptions(item.value)}
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />
        <Text style={styles.modalLabel}>Max Persentase Tugas Tambahan</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Persentase"
          multiline
          value={selectedPersentase}
          onChangeText={setSelectedPersentase}
          placeholderTextColor={'#B6B9CA'}
        />
        <Text style={styles.modalLabel}>Memenuhi Tugas Utama</Text>
        <Dropdown
          style={styles.modalInput}
          data={memenuhi}
          labelField="label"
          valueField="value"
          placeholder="Tugas Utama"
          placeholderStyle={{color: '#B6B9CA'}}
          value={pickMemenuhiOptions}
          onChange={item => setPickMemenuhiOptions(item.value)}
          renderItem={item => (
            <Text
              style={[styles.dropdownItem, styles.customFont, {color: '#333'}]}>
              {item.label}
            </Text>
          )}
        />
        <Text style={styles.modalLabel}>Minimal Persentase Tugas Utama</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Persentase"
          multiline
          value={selectedPersenUtama}
          onChangeText={setSelectedPersenUtama}
          placeholderTextColor={'#B6B9CA'}
          editable={isPersentaseEnabled}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={submitTambah}>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  dropdownItem: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
  },
});

export default TambahSettingTugas;
