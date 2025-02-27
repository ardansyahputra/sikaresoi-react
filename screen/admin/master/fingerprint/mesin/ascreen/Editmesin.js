import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import useApiClient from '../../../../../../src/api/apiClient';
import Header from '../../../../components/Header';
import GlobalStyle from '../../../../../../src/utils/GlobalStyle';
const {width} = Dimensions.get('window');
import {Dropdown} from 'react-native-element-dropdown';
import {BarIndicator} from 'react-native-indicators';
import Toast from 'react-native-toast-message';

const EditMesin = ({navigation, route}) => {
  const {uuid} = route.params;
  const [namaMesin, setNamaMesin] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [comkey, setComkey] = useState('');
  const [statusAktif, setStatusAktif] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [focusState, setFocusState] = useState({});
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `/fingerprint_machine/${uuid}/edit`;
        const response = await apiClient.get(url, {});

        if (response.status === 200 && response.data) {
          const mesinData = response.data.data;
          setNamaMesin(mesinData.name || '');
          setSerialNumber(mesinData.sn || '');
          setIp(mesinData.ip || '');
          setPort(mesinData.port || '');
          setComkey(mesinData.comkey || '');
          setStatusAktif(mesinData.active === '1' ? 'Aktif' : 'Non-Aktif');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Gagal',
            text2: 'Gagal memuat data.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: `Gagal memuat data. Error: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid) {
      fetchData();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'UUID is missing or invalid.',
      });
    }
  }, [uuid]);

  const statusOptions = [
    {label: 'Aktif', value: 'Aktif'},
    {label: 'Non-Aktif', value: 'Non-Aktif'},
  ];

  const handleSave = async () => {
    if (!namaMesin || !serialNumber || !ip || !port || !comkey) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Harap isi semua field sebelum menyimpan.',
      });
      return;
    }

    const payload = {
      name: namaMesin,
      sn: serialNumber,
      ip: ip,
      port: port,
      comkey: comkey,
      active: statusAktif === 'Aktif' ? '1' : '0',
    };

    const requestUrl = `/fingerprint_machine/${uuid}/update`;
    console.log('Request URL:', requestUrl);
    console.log('Payload:', payload);

    setIsLoading(true);

    try {
      const response = await apiClient.post(requestUrl, payload, {});

      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      if (response.status === 200 && response.data.status) {
        console.log('Berhasil', 'Data berhasil diperbarui.');
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:
            response.data.message ||
            'Gagal memperbarui data. Silakan coba lagi.',
        });
      }
    } catch (error) {
      console.error('Error during request:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Gagal memperbarui data. Error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Edit Mesin Fingerprint" />
      {isLoading ? (
        // Loading Indicator
        <View style={styles.loadingContainer}>
          <BarIndicator color="#D4C6C6" count={5} size={24} />
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={[GlobalStyle.SemiBold, styles.label]}>Nama Mesin</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.namaMesin && styles.inputFocused,
                namaMesin && styles.inputFilled,
              ]}
              value={namaMesin}
              onChangeText={setNamaMesin}
              placeholder="Masukkan Nama Mesin"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('namaMesin')}
              onBlur={() => handleBlur('namaMesin')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Serial Number
            </Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.serialNumber && styles.inputFocused,
                serialNumber && styles.inputFilled,
              ]}
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder="Masukkan Serial Number"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('serialNumber')}
              onBlur={() => handleBlur('serialNumber')}
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>IP</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.ip && styles.inputFocused,
                ip && styles.inputFilled,
              ]}
              value={ip}
              onChangeText={setIp}
              placeholder="Masukkan IP"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('ip')}
              onBlur={() => handleBlur('ip')}
              keyboardType="numeric"
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Port</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.port && styles.inputFocused,
                port && styles.inputFilled,
              ]}
              value={`${port}`}
              onChangeText={setPort}
              placeholder="Masukkan Port"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('port')}
              onBlur={() => handleBlur('port')}
              keyboardType="numeric"
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>Comkey</Text>
            <TextInput
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.comkey && styles.inputFocused,
                comkey && styles.inputFilled,
              ]}
              value={comkey}
              onChangeText={setComkey}
              placeholder="Masukkan Comkey"
              placeholderTextColor="#B0B0B0"
              onFocus={() => handleFocus('comkey')}
              onBlur={() => handleBlur('comkey')}
              keyboardType="numeric"
            />

            <Text style={[GlobalStyle.SemiBold, styles.label]}>
              Status Aktif
            </Text>
            <Dropdown
              style={[
                GlobalStyle.SemiBold,
                styles.input,
                focusState.statusAktif && styles.inputFocused,
                statusAktif && styles.inputFilled,
              ]}
              data={statusOptions}
              labelField="label"
              valueField="value"
              placeholder="Pilih Status"
              placeholderStyle={{color: '#B0B0B0'}}
              selectedTextStyle={[
                GlobalStyle.SemiBold,
                {fontSize: 14, color: '#313131'},
              ]}
              onFocus={() => handleFocus('statusAktif')}
              onBlur={() => handleBlur('statusAktif')}
              value={statusAktif}
              onChange={item => setStatusAktif(item.value)}
              renderItem={item => (
                <Text style={[styles.dropdownItem, GlobalStyle.SemiBold]}>
                  {item.label}
                </Text>
              )}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
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

export default EditMesin;
