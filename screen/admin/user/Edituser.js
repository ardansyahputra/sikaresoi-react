import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BarIndicator} from 'react-native-indicators';

const EditUser = ({navigation, route}) => {
  const {user, groups} = route.params;
  const [name, setName] = useState(user.name || '');
  const [nip, setNip] = useState(user.nip || '');
  const [norekening, setnorekening] = useState(user.no_rek || '');
  const [fingerid, setfingerid] = useState(user.finger_id || null);
  const [selectedGroup, setSelectedGroup] = useState(
    user.user_group_id || null,
  );
  const {uuid} = route.params; // Mendapatkan UUID dari parameter navigasi
  const apiClient = useApiClient();
  const [uraianOptions, setUraianOptions] = useState([]);
  const [editData, setEditData] = useState({});
  const [focusState, setFocusState] = useState({});
  const [jenisPegawaiOptions, setJenisPegawaiOptions] = useState([]);
  const [ptkpOptions, setPtkpOptions] = useState([]);
  const [selectedJenisPegawai, setSelectedJenisPegawai] = useState(
    user.jenis_pegawai_id || null,
  );
  const [selectedPtkp, setSelectedPtkp] = useState(user.master_ptkp_id || null);
  const [level, setLevel] = useState(user.level || '');
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [selectedPangkat, setSelectedPangkat] = useState(
    user.pangkat_id || null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading ke true sebelum fetch data
      try {
        if (groups && groups.length > 0) {
          setUraianOptions(
            groups.map(group => ({
              label: group.nm_user_group,
              value: group.id,
            })),
          );
        }
        await fetchJenisPegawai();
        await fetchPtkp();
        await fetchPangkat();
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat data.');
      } finally {
        setIsLoading(false); // Set loading ke false setelah fetch selesai
      }
    };

    fetchData();
  }, [groups]);

  const fetchJenisPegawai = async () => {
    try {
      const response = await apiClient.get('/jenis_pegawai/show');
      if (response.data && response.data.data) {
        setJenisPegawaiOptions(
          response.data.data.map(item => ({
            label: item.jenis, // Gunakan field `jenis` sebagai label
            value: item.id, // Gunakan `id` sebagai value
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching jenis pegawai options:', error);
      Alert.alert('Error', 'Gagal memuat data jenis pegawai.');
    }
  };

  const fetchPtkp = async () => {
    try {
      const response = await apiClient.get('/pajak_ptkp/show');
      // Map data untuk digunakan dalam dropdown
      setPtkpOptions(
        response.data.data.map(item => ({
          label: item.ptkp, // Gunakan `ptkp` sebagai label
          value: item.id, // Gunakan `id` sebagai value
        })),
      );
    } catch (error) {
      console.error('Error fetching PTKP options:', error);
      Alert.alert('Error', 'Gagal memuat data PTKP.');
    }
  };

  const fetchPangkat = async () => {
    try {
      const response = await apiClient.get('/pangkat/show');
      if (response.data && response.data.data) {
        // Map data API ke format dropdown
        setPangkatOptions(
          response.data.data.map(item => ({
            label: `${item.nm_pangkat} / ${item.golongan} ${item.ruang}`, // Format label
            value: item.id, // ID sebagai value
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching pangkat options:', error);
      Alert.alert('Error', 'Gagal memuat data pangkat.');
    }
  };
  const levelOptions = [
    {label: 'User', value: 'user'},
    {label: 'Admin', value: 'admin'},
  ];

  const handleSave = async () => {
    try {
      // Panggil API untuk menyimpan perubahan
      const response = await apiClient.post(
        `/user_master/${user.uuid}/update`,
        {
          name,
          nip,
          no_rek: norekening,
          finger_id: fingerid,
          user_group_id: selectedGroup,
          jenis_pegawai_id: selectedJenisPegawai,
          master_ptkp_id: selectedPtkp,
          level,
          pangkat_id: selectedPangkat,
        },
      );

      // Dapatkan data pengguna terbaru dari respons API
      const updatedUser = response.data;

      // Perbarui state berdasarkan data terbaru
      setfingerid(updatedUser.finger_id);

      navigation.goBack(); // Navigasi ke halaman daftar user
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memperbarui data.');
    }
  };

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Data</Text>
      </View>
      {isLoading ? (
        // Loading Indicator
        <View style={styles.loadingContainer}>
          <BarIndicator color="#D4C6C6" count={5} size={24} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>NIP/NRP</Text>
          <TextInput
            style={[
              styles.input,
              focusState.nip && styles.inputFocused,
              nip && styles.inputFilled,
            ]}
            placeholder="Nip"
            value={nip}
            onChangeText={setNip}
            placeholderTextColor="#B6B9CA"
            onFocus={() => handleFocus('nip')}
            onBlur={() => handleBlur('nip')}
          />

          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={[
              styles.input,
              focusState.name && styles.inputFocused,
              name && styles.inputFilled,
            ]}
            placeholder="Nama"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#B6B9CA"
            onFocus={() => handleFocus('name')}
            onBlur={() => handleBlur('name')}
          />

          <Text style={styles.label}>Pangkat/Gol. Ruang</Text>
          <Dropdown
            style={[
              styles.input,
              focusState.selectedPangkat && styles.inputFocused,
              selectedPangkat && styles.inputFilled,
            ]}
            data={pangkatOptions}
            labelField="label"
            valueField="value"
            placeholder="Pilih Pangkat"
            onFocus={() => handleFocus('selectedPangkat')}
            onBlur={() => handleBlur('selectedPangkat')}
            placeholderStyle={{color: '#B6B9CA'}}
            value={selectedPangkat}
            onChange={item => setSelectedPangkat(item.value)}
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
          <Text style={styles.label}>Status PTKP</Text>
          <Dropdown
            style={[
              styles.input,
              focusState.selectedPtkp && styles.inputFocused,
              selectedPtkp && styles.inputFilled,
            ]}
            data={ptkpOptions}
            labelField="label"
            valueField="value"
            placeholder="Pilih PTKP"
            onFocus={() => handleFocus('selectedPtkp')}
            onBlur={() => handleBlur('selectedPtkp')}
            placeholderStyle={{color: '#B6B9CA'}}
            value={selectedPtkp}
            onChange={item => setSelectedPtkp(item.value)}
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
          <Text style={styles.label}>No. Rekening</Text>
          <TextInput
            style={[
              styles.input,
              focusState.norekening && styles.inputFocused,
              norekening && styles.inputFilled,
            ]}
            placeholder="-"
            value={norekening}
            onChangeText={setnorekening}
            placeholderTextColor={'#B6B9CA'}
            onFocus={() => handleFocus('norekening')}
            onBlur={() => handleBlur('norekening')}
          />
          <Text style={styles.label}>Level</Text>
          <Dropdown
            style={[
              styles.input,
              focusState.level && styles.inputFocused,
              level && styles.inputFilled,
            ]}
            data={levelOptions}
            labelField="label"
            valueField="value"
            placeholder="Pilih Level"
            onFocus={() => handleFocus('level')}
            onBlur={() => handleBlur('level')}
            placeholderStyle={{color: '#B6B9CA'}}
            value={level}
            onChange={item => setLevel(item.value)}
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
          <Text style={styles.label}>User Group</Text>
          <Dropdown
            style={[
              styles.input,
              focusState.selectedGroup && styles.inputFocused,
              selectedGroup && styles.inputFilled,
            ]}
            data={uraianOptions}
            labelField="label"
            valueField="value"
            placeholder="Pilih Grup Pengguna"
            placeholderStyle={{color: '#B6B9CA'}}
            onFocus={() => handleFocus('selectedGroup')}
            onBlur={() => handleBlur('selectedGroup')}
            value={selectedGroup}
            onChange={item => setSelectedGroup(item.value)}
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
          <Text style={styles.label}>Jenis Pegawai</Text>
          <Dropdown
            style={[
              styles.input,
              focusState.selectedJenisPegawai && styles.inputFocused,
              selectedJenisPegawai && styles.inputFilled,
            ]}
            data={jenisPegawaiOptions}
            labelField="label"
            valueField="value"
            placeholder="Uraian"
            onFocus={() => handleFocus('selectedJenisPegawai')}
            onBlur={() => handleBlur('selectedJenisPegawai')}
            placeholderStyle={{color: '#B6B9CA'}}
            value={selectedJenisPegawai}
            onChange={item => setSelectedJenisPegawai(item.value)}
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
          <Text style={styles.label}>Finger ID</Text>
          <TextInput
            style={[
              styles.input,
              focusState.fingerid && styles.inputFocused,
              fingerid && styles.inputFilled,
            ]}
            placeholder="-"
            value={fingerid?.toString()} // Pastikan nilainya berupa string
            onChangeText={text => setfingerid(text)} // Perbarui state saat input berubah
            placeholderTextColor={'#B6B9CA'}
            onFocus={() => handleFocus('fingerid')}
            onBlur={() => handleBlur('fingerid')}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20,
  }, // Menambahkan padding top agar header tidak terpotong
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '100%',

    marginTop: 37, // Memberikan margin agar konten tidak tumpang tindih dengan header
  },
  label: {fontSize: 14, marginTop: 10, fontWeight: 800},
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginVertical: 10,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
  },
  inputFocused: {
    borderRadius: 5, // Border radius saat fokus
    borderColor: '#75BAFF',
    borderWidth: 1.5,
  },
  inputFilled: {
    backgroundColor: '#F2F8FF', // Background lebih gelap saat terisi
    borderRadius: 5, // Hilangkan border radius
    padding: 10,
    marginVertical: 10,
  },
  scrollContent: {
    paddingBottom: 10, // Tambahkan padding bawah agar tidak terpotong
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
  cancelButton: {backgroundColor: '#187DE4', padding: 15, borderRadius: 5},
  saveButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#3699FE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {color: '#fff', fontSize: 14, fontWeight: '600'},
  dropdownItem: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditUser;
