import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import {BarIndicator} from 'react-native-indicators';
import Header from '../../components/Header';
const {width} = Dimensions.get('window');
import GlobalStyle from '../../../src/utils/GlobalStyle';

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
      setIsLoading(true);
      try {
        if (groups && groups.length > 0) {
          setUraianOptions(
            groups.map(group => ({
              label: group.nm_user_group,
              value: group.id,
            })),
          );
        }

        // Jalankan semua fetch secara paralel untuk mempercepat proses
        await Promise.all([fetchJenisPegawai(), fetchPtkp(), fetchPangkat()]);
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat data.');
      } finally {
        setIsLoading(false);
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

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
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

      setfingerid(response.data.finger_id);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memperbarui data.');
    } finally {
      setIsLoading(false);
    }
  }, [
    name,
    nip,
    norekening,
    fingerid,
    selectedGroup,
    selectedJenisPegawai,
    selectedPtkp,
    level,
    selectedPangkat,
    user.uuid,
  ]);

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit User" />
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
                focusState.nip && styles.inputFocused,
                nip && styles.inputFilled,
              ]}
              placeholder="Nip"
              value={nip}
              onChangeText={setNip}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('nip')}
              onBlur={() => handleBlur('nip')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Nama</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.name && styles.inputFocused,
                name && styles.inputFilled,
              ]}
              placeholder="Nama"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
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
              labelField=""
              valueField="value"
              placeholder="Pilih Pangkat"
              onFocus={() => handleFocus('selectedPangkat')}
              onBlur={() => handleBlur('selectedPangkat')}
              placeholderStyle={{color: '#B0B0B0'}}
              value={selectedPangkat}
              onChange={item => setSelectedPangkat(item.value)}
              renderLeftIcon={() =>
                selectedGroup ? (
                  <Text style={[GlobalStyle.SemiBold, {color: '#313131'}]}>
                    {
                      pangkatOptions.find(opt => opt.value === selectedPangkat)
                        ?.label
                    }
                  </Text>
                ) : (
                  <Text style={{color: '#313131'}}>Pilih Grup Pengguna</Text>
                )
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
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
              labelField=""
              valueField="value"
              placeholder="Pilih PTKP"
              onFocus={() => handleFocus('selectedPtkp')}
              onBlur={() => handleBlur('selectedPtkp')}
              placeholderStyle={{color: '#B0B0B0'}}
              value={selectedPtkp}
              onChange={item => setSelectedPtkp(item.value)}
              renderLeftIcon={() =>
                selectedGroup ? (
                  <Text style={[GlobalStyle.SemiBold, {color: '#313131'}]}>
                    {ptkpOptions.find(opt => opt.value === selectedPtkp)?.label}
                  </Text>
                ) : (
                  <Text style={{color: '#313131'}}>Pilih Grup Pengguna</Text>
                )
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
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
                focusState.norekening && styles.inputFocused,
                norekening && styles.inputFilled,
              ]}
              placeholder="-"
              value={norekening}
              onChangeText={setnorekening}
              placeholderTextColor={'#B0B0B0'}
              onFocus={() => handleFocus('norekening')}
              onBlur={() => handleBlur('norekening')}
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
              labelField=""
              valueField="value"
              placeholder="Pilih Level"
              onFocus={() => handleFocus('level')}
              onBlur={() => handleBlur('level')}
              placeholderStyle={{color: '#B0B0B0'}}
              value={level}
              onChange={item => setLevel(item.value)}
              renderLeftIcon={() =>
                selectedGroup ? (
                  <Text style={[GlobalStyle.SemiBold, {color: '#313131'}]}>
                    {levelOptions.find(opt => opt.value === level)?.label}
                  </Text>
                ) : (
                  <Text style={{color: '#313131'}}>Pilih Grup Pengguna</Text>
                )
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
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
              labelField="" // Mengosongkan labelField agar tidak ada teks default
              valueField="value"
              placeholder="Pilih Grup Pengguna"
              placeholderStyle={{color: '#B0B0B0'}}
              onFocus={() => handleFocus('selectedGroup')}
              onBlur={() => handleBlur('selectedGroup')}
              value={selectedGroup}
              onChange={item => setSelectedGroup(item.value)}
              renderLeftIcon={() =>
                selectedGroup ? (
                  <Text style={[GlobalStyle.SemiBold, {color: '#313131'}]}>
                    {
                      uraianOptions.find(opt => opt.value === selectedGroup)
                        ?.label
                    }
                  </Text>
                ) : (
                  <Text style={{color: '#313131'}}>Pilih Grup Pengguna</Text>
                )
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
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
              labelField=""
              valueField="value"
              placeholder="Uraian"
              onFocus={() => handleFocus('selectedJenisPegawai')}
              onBlur={() => handleBlur('selectedJenisPegawai')}
              placeholderStyle={{color: '#B0B0B0'}}
              value={selectedJenisPegawai}
              onChange={item => setSelectedJenisPegawai(item.value)}
              renderLeftIcon={() =>
                selectedGroup ? (
                  <Text style={[GlobalStyle.SemiBold, {color: '#313131'}]}>
                    {
                      jenisPegawaiOptions.find(
                        opt => opt.value === selectedJenisPegawai,
                      )?.label
                    }
                  </Text>
                ) : (
                  <Text style={{color: '#313131'}}>Pilih Grup Pengguna</Text>
                )
              }
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
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
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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

export default EditUser;
