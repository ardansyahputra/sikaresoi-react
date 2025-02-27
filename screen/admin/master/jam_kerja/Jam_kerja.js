import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import Header from '../../../components/Header';

const JamKerja = ({navigation}) => {
  // Inisialisasi state
  const [settingTimes, setSettingTimes] = useState([]);
  const [uuid, setUuid] = useState('');
  const [dispensasi, setDispensasi] = useState('');
  const [totalJam, setTotalJam] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [day, setDay] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [activeId, setActiveId] = useState(null);
  const apiClient = useApiClient();

  useEffect(() => {
    getSettingTime();
  }, []);

  const getSettingTime = () => {
    apiClient
      .get('/admin/jamkerja/show', {})
      .then(response => {
        if (response.data.status) {
          const data = response.data.data;
          if (data && data.length > 0) {
            const firstSetting = data[0];
            setId(firstSetting.id);
            setUuid(firstSetting.uuid);
            setDispensasi(firstSetting.dispensasi);
            setTotalJam(firstSetting.total_jam);
            setCreatedAt(firstSetting.created_at);
            setUpdatedAt(firstSetting.updated_at);
            setSettingTimes(data);
            setDay(firstSetting.day);
            setName(firstSetting.name);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleInputChange = (text, id, field) => {
    const updatedSettingTimes = [...settingTimes];

    // Temukan setting berdasarkan ID
    const settingIndex = updatedSettingTimes.findIndex(
      setting => setting.id === id,
    );

    if (settingIndex !== -1) {
      updatedSettingTimes[settingIndex][field] = text; // Update field berdasarkan ID
    }

    setSettingTimes(updatedSettingTimes);

    // Log the update to check if the setting is updated
    console.log('Updated Setting:', updatedSettingTimes[settingIndex]);
  };

  const save = () => {
    // Cek apakah activeId sudah diatur dan settingTimes tidak kosong
    if (!activeId) {
      console.error('No active ID set');
      return;
    }

    if (!settingTimes || settingTimes.length === 0) {
      console.error('No valid settings available');
      return;
    }

    const updatedSetting = settingTimes.find(
      setting => setting.id === activeId,
    ); // Temukan data berdasarkan ID

    // Pastikan updatedSetting ditemukan
    if (!updatedSetting) {
      console.error('Setting with the given ID not found');
      return;
    }

    // Jika data ditemukan, buat payload untuk disimpan
    const payload = {
      id: updatedSetting.id,
      uuid: updatedSetting.uuid,
      day: updatedSetting.day,
      name: updatedSetting.name,
      dispensasi: updatedSetting.dispensasi,
      total_jam: updatedSetting.total_jam,
      created_at: updatedSetting.created_at,
      updated_at: updatedSetting.updated_at,
      time_start: updatedSetting.time_start,
      time_end: updatedSetting.time_end,
    };

    console.log('Data to be saved:', payload);

    apiClient
      .post('/admin/jamkerja/save', payload, {})
      .then(response => {
        if (response.data.status) {
          console.log('Saved successfully');
          // Re-fetch data from the server after saving
          getSettingTime();
        } else {
          console.error('Failed to save settings:', response.data.res.message);
        }
      })
      .catch(error => {
        console.error('Failed to save settings:', error);
      });
  };

  const renderTableRows = () => {
    return settingTimes.map(setting => (
      <View style={styles.tableRow} key={setting.id}>
        <TextInput
          style={styles.input}
          value={setting.name}
          placeholder="Hari"
          editable={false} // Menonaktifkan pengeditan nama hari
        />
        <TextInput
          style={styles.input}
          value={setting.time_start}
          placeholder="Jam Masuk"
          onChangeText={text =>
            handleInputChange(text, setting.id, 'time_start')
          }
        />
        <TextInput
          style={styles.input}
          value={setting.time_end}
          placeholder="Jam Keluar"
          onChangeText={text => handleInputChange(text, setting.id, 'time_end')}
        />
        <TextInput
          style={styles.input}
          value={setting.total_jam}
          placeholder="Total Jam"
          onChangeText={text =>
            handleInputChange(text, setting.id, 'total_jam')
          }
        />
        <TextInput
          style={styles.input}
          value={setting.dispensasi}
          placeholder="Dispensasi"
          onChangeText={text =>
            handleInputChange(text, setting.id, 'dispensasi')
          }
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            setActiveId(setting.id); // Set activeId saat tombol simpan ditekan
            save(); // Simpan data
          }}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Header title="Setting Jam Kerja" />

            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Jam Kerja</Text>
              </View>
              <View style={styles.cardDivider}></View>
              <View style={styles.cardBody}>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Hari</Text>
                    <Text style={styles.tableHeaderCell}>Jam Masuk</Text>
                    <Text style={styles.tableHeaderCell}>Jam Keluar</Text>
                    <Text style={styles.tableHeaderCell}>Total Jam</Text>
                    <Text style={styles.tableHeaderCell}>Dispensasi</Text>
                    <Text style={styles.tableHeaderCell}>Aksi</Text>
                  </View>
                  {renderTableRows()}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E7E9F1'},
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  cardContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 10,
  },
  cardHeader: {marginBottom: 15},
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  cardBody: {
    backgroundColor: '#F7F8FB',
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 10,
  },
  table: {marginTop: 20},
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    width: '15%',
    textAlign: 'center',
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#fff',
    padding: 4,
    width: '17%',
    fontSize: 11,
    paddingHorizontal: 8,
    borderRadius: 3,
    color: '#000', // Menetapkan warna teks menjadi hitam
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '12%',
    height: 40,
    borderRadius: 3,
    marginLeft: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 9,
  },
});
export default JamKerja;
