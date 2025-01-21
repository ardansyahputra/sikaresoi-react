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
import useApiClient from '../../../../../src/api/apiClient';
import DatePicker from 'react-native-modern-datepicker';
import {Dropdown} from 'react-native-element-dropdown';

const TambahReward = ({route, navigation}) => {
  const [pickBulanOptions, setPickBulanOptions] = useState([]);
  const [pickTahunOptions, setPickTahunOptions] = useState({id: '', value: ''}); // Default kosong
  const [Tanggal, setTanggal] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedReward, setSelectedReward] = useState();
  const { reward_punishment_id } = route.params; 
  const apiClient = useApiClient();

  const submitTambah = async () => {
    try {
      await apiClient.post('/reward/create', {
        reward_punishment_id: reward_punishment_id,
        tanggal: Tanggal, // Tanggal yang dipilih
        reward: selectedReward,
      });
      Alert.alert('Berhasil', 'Data berhasil ditambahkan.');
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      Alert.alert('Error', 'Gagal menambahkan data.');
    }
  };

    const getCurrentDate = () => {
    if (pickTahunOptions.value && pickBulanOptions) {
      // Gunakan tahun sebenarnya dan bulan untuk DatePicker
      return `${pickTahunOptions.value}/${String(pickBulanOptions).padStart(
        2,
        '0',
      )}/01`;
    }
    // Default ke tanggal hari ini jika belum dipilih
    return new Date().toISOString().split('T')[0].replace(/-/g, '/');
  };


  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev); // Toggle visibility
  };

  const handleDateChange = date => {
    const [year, month, day] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    setTanggal(formattedDate);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Tanggal</Text>
        <TouchableOpacity style={styles.input} onPress={toggleDatePicker}>
          <Text>{Tanggal || 'Pilih Tanggal'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DatePicker
            mode="calendar"
            onDateChange={handleDateChange}
            current={getCurrentDate()}
            options={{
              textHeaderColor: '#007BFF',
              textDefaultColor: '#333',
              selectedTextColor: '#FFF',
              mainColor: '#007BFF',
              textSecondaryColor: '#B0B0B0',
              borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
          />
        )}

        <Text style={styles.label}>Reward</Text>
        <TextInput
          style={styles.input}
          placeholder="Reward"
          multiline
          value={selectedReward}
          onChangeText={setSelectedReward}
          placeholderTextColor={'#B6B9CA'}
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

export default TambahReward;
