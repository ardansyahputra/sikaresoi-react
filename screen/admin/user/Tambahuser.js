import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import {BarIndicator} from 'react-native-indicators';
import Header from '../../components/Header';
import GlobalStyle from '../../../src/utils/GlobalStyle';
const {width} = Dimensions.get('window');

const TambahUser = ({navigation, route}) => {
  const [uraianOptions, setUraianOptions] = useState([]);
  const {groups} = route.params;
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedNip, setSelectedNip] = useState('');
  const [selectedNama, setSelectedNama] = useState('');
  const [selectedPassword, setSelectedPassword] = useState('');
  const [selectedPasswordConfirmation, setSelectedPasswordConfirmation] =
    useState('');
  const [selectedNoRek, setSelectedNoRek] = useState('');
  const [level, setLevel] = useState('');
  const [fingerid, setfingerid] = useState(null);
  const [pickUraianOptions, setPickUraianOptions] = useState([]);
  const [selectedNamaKegiatan, setSelectedNamaKegiatan] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [jenisPegawaiOptions, setJenisPegawaiOptions] = useState([]);
  const [selectedJenisPegawai, setSelectedJenisPegawai] = useState(null);
  const [ptkpOptions, setPtkpOptions] = useState([]);
  const [selectedPtkp, setSelectedPtkp] = useState(null);
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [selectedPangkat, setSelectedPangkat] = useState(null);
  const [focusState, setFocusState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = useApiClient();

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

  const submitTambah = async () => {
    if (
      !selectedNip ||
      !selectedNama ||
      !selectedPassword ||
      !selectedPasswordConfirmation
    ) {
      console.log('Error: Semua kolom harus diisi.');
      return;
    }

    if (selectedPassword !== selectedPasswordConfirmation) {
      console.log('Error: Password tidak sama.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.post('/user_master/create', {
        nip: selectedNip,
        password: selectedPassword,
        name: selectedNama,
        password_confirmation: selectedPasswordConfirmation,
        jenis_pegawai_id: selectedJenisPegawai,
        level,
        master_ptkp_id: selectedPtkp,
        no_rek: selectedNoRek,
        pangkat_id: selectedPangkat,
        finger_id: fingerid,
        user_group_id: selectedGroup,
      });

      if (response.data.status) {
        console.log('Berhasil:', response.data.data);
        navigation.goBack();
      } else {
        console.log('Error:', response.data.res.message);
      }
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      console.log('Error: Gagal menambahkan data.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchUraianShow = async () => {
    try {
      const response = await apiClient.get('/uraian/show', {});
      setUraianOptions(
        response.data.data.map(item => ({
          label: item.nm_uraian,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching jabatan options:', error);
      Alert.alert('Error', 'Gagal memuat data jabatan.');
    }
  };
  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  const levelOptions = [
    {label: 'User', value: 'user'},
    {label: 'Admin', value: 'admin'},
  ];

  return (
    <View style={styles.rootContainer}>
      <Header title="Tambah User" />
      <View style={styles.container}>
        {isLoading ? (
          // Loading Indicator
          <View style={styles.loadingContainer}>
            <BarIndicator color="#D4C6C6" count={5} size={24} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={[GlobalStyle.SemiBold, styles.label]}>NIP/NRP</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNip && styles.inputFocused,
                selectedNip && styles.inputFilled,
              ]}
              placeholder="NIP"
              value={selectedNip}
              onChangeText={setSelectedNip}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNip')}
              onBlur={() => handleBlur('selectedNip')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Nama</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNama && styles.inputFocused,
                selectedNama && styles.inputFilled,
              ]}
              placeholder="Nama"
              value={selectedNama}
              onChangeText={setSelectedNama}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedNama')}
              onBlur={() => handleBlur('selectedNama')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Password</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPassword && styles.inputFocused,
                selectedPassword && styles.inputFilled,
              ]}
              placeholder="Password"
              value={selectedPassword}
              onChangeText={setSelectedPassword}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPassword')}
              onBlur={() => handleBlur('selectedPassword')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Konfirmasi Password
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedPasswordConfirmation && styles.inputFocused,
                selectedPasswordConfirmation && styles.inputFilled,
              ]}
              placeholder="Konfirmasi Password"
              value={selectedPasswordConfirmation}
              onChangeText={setSelectedPasswordConfirmation}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('selectedPasswordConfirmation')}
              onBlur={() => handleBlur('selectedPasswordConfirmation')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Pangkat/Gol. Ruang
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
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
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={selectedPangkat}
              onChange={item => setSelectedPangkat(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Status PTKP
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
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
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={selectedPtkp}
              onChange={item => setSelectedPtkp(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              No. Rekening
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedNoRek && styles.inputFocused,
                selectedNoRek && styles.inputFilled,
              ]}
              placeholder="-"
              value={selectedNoRek}
              onChangeText={setSelectedNoRek}
              placeholderTextColor={'#B0B0B0'}
              onFocus={() => handleFocus('selectedNoRek')}
              onBlur={() => handleBlur('selectedNoRek')}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Level</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
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
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={level}
              onChange={item => setLevel(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>User Group</Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.selectedGroup && styles.inputFocused,
                selectedGroup && styles.inputFilled,
              ]}
              data={uraianOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Grup Pengguna"
              onFocus={() => handleFocus('selectedGroup')}
              onBlur={() => handleBlur('selectedGroup')}
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={selectedGroup}
              onChange={item => setSelectedGroup(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Jenis Pegawai
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
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
              placeholderStyle={{
                ...GlobalStyle.SemiBold,
                color: '#B0B0B0',
                fontSize: 14,
              }}
              value={selectedJenisPegawai}
              onChange={item => setSelectedJenisPegawai(item.value)}
              renderItem={item => (
                <Text style={[GlobalStyle.SemiBold, styles.dropdownItem]}>
                  {item.label}
                </Text>
              )}
            />
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Finger ID</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.fingerid && styles.inputFocused,
                fingerid && styles.inputFilled,
              ]}
              placeholder="-"
              value={fingerid?.toString()} // Pastikan nilainya berupa string
              onChangeText={text => setfingerid(text)} // Perbarui state saat input berubah
              placeholderTextColor={'#B0B0B0'}
              onFocus={() => handleFocus('fingerid')}
              onBlur={() => handleBlur('fingerid')}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={submitTambah}>
                <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.05,
    paddingTop: 10,
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
  label: {fontSize: 14, color: '#313131'},
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginBottom: 20,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
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
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {color: '#fff', fontSize: 14},
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: '#313131',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TambahUser;
