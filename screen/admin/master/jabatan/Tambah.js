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
import useApiClient from '../../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';

const TambahJabatan = ({navigation}) => {
  const [selectedJabatan, setSelectedJabatan] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedNilaiJabatan, setSelectedNilaiJabatan] = useState(null);
  const [pickJabatanOptions, setPickJabatanOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [isMaster, setIsMaster] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const apiClient = useApiClient();

  useEffect(() => {
    if (isSub) {
      fetchJabatanOptions();
    }
  }, [isSub]);

  const fetchJabatanOptions = async () => {
    try {
      const response = await apiClient.get('/jabatan/getjabatan');
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

  const submitTambah = async () => {
    try {
      await apiClient.post('/jabatan/create', {
        nm_jabatan: selectedJabatan,
        grade: selectedGrade,
        jv: selectedNilaiJabatan,
        code: pickJabatanOptions,
        master: isMaster,
        sub_master: isSub,
      });

      setSelectedJabatan(null); // Reset dropdown jabatan
      setSelectedGrade(null); // Reset grade
      setSelectedNilaiJabatan(null); // Reset nilai jabatan
      setIsMaster(false); // Reset status master
      setIsSub(false); // Reset status sub_master
      setPickJabatanOptions(null); // Reset dropdown jabatan sub

      Alert.alert('Berhasil', 'Data berhasil ditambahkan.');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Gagal menambahkan data.');
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
        <Text style={styles.label}>Grade</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama Jabatan"
          multiline
          value={selectedJabatan}
          onChangeText={setSelectedJabatan}
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>Nominal</Text>
        <TextInput
          style={styles.input}
          placeholder="Grade"
          multiline
          value={selectedGrade}
          onChangeText={setSelectedGrade}
          placeholderTextColor={'#B6B9CA'}
        />

        <Text style={styles.label}>Nominal</Text>
        <TextInput
          style={styles.input}
          placeholder="Job Value"
          multiline
          value={selectedNilaiJabatan}
          onChangeText={setSelectedNilaiJabatan}
          placeholderTextColor={'#B6B9CA'}
          keyboardType="numeric"
        />

        {/* Switch untuk Master */}
        <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Master</Text>
              <Switch
                value={isMaster}
                onValueChange={value => {
                  setIsMaster(value); // Perbarui Master
                  if (value) {
                    setIsSub(false); // Nonaktifkan Sub jika Master aktif
                  }
                }}
              />
            </View>

            {/* Switch untuk Sub */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Sub</Text>
              <Switch
                value={isSub}
                onValueChange={value => {
                  setIsSub(value); // Perbarui Sub
                  if (value) {
                    setIsMaster(false); // Nonaktifkan Master jika Sub aktif
                  }
                }}
              />
            </View>

            {isSub && (
              <>
                <Text style={styles.modalLabel}>Jabatan Sub</Text>
                <Dropdown
                  style={styles.input}
                  data={jabatanOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Jabatan"
                  placeholderStyle={{color: '#B6B9CA'}}
                  value={pickJabatanOptions}
                  onChange={item => setPickJabatanOptions(item.value)}
                  renderItem={item => (
                    <Text
                      style={[
                        styles.dropdownItem,
                        styles.customFont,
                        {color: '#333'},
                      ]}>
                      {item.label}
                    </Text>
                  )}
                />
              </>
            )}

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

export default TambahJabatan;
