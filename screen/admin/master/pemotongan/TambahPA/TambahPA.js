import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TimerPicker } from 'react-native-timer-picker'; // Pastikan mengimpor TimerPicker dengan benar
import LinearGradient from 'react-native-linear-gradient';

const TambahPa = ({ navigation }) => {
  const [selectedPotongan, setSelectedPotongan] = useState('');
  const [selectedBatasAtas, setSelectedBatasAtas] = useState('00:00');
  const [selectedBatasBawah, setSelectedBatasBawah] = useState('00:00');
  const [showDropdown, setShowDropdown] = useState(false); // Untuk menampilkan dropdown
  const [currentTimeType, setCurrentTimeType] = useState(null); // Untuk menandai apakah batas atas atau bawah yang sedang dipilih

  const handleSave = () => {
    if (!selectedPotongan || !selectedBatasAtas || !selectedBatasBawah) {
      Alert.alert('Error', 'Harap isi semua data sebelum menyimpan.');
      return;
    }

    console.log('Data baru:', {
      potongan: selectedPotongan,
      batasAtas: selectedBatasAtas,
      batasBawah: selectedBatasBawah,
    });

    // Di sini, Anda bisa mengirimkan data ke server menggunakan API atau langsung menyimpannya
    Alert.alert('Sukses', 'Data berhasil disimpan.');
    navigation.goBack(); // Kembali ke halaman sebelumnya setelah menyimpan
  };

  const handleShowDropdown = (timeType) => {
    setCurrentTimeType(timeType);
    setShowDropdown(true); // Menampilkan dropdown
  };

  const handleTimeSelect = (time) => {
    if (currentTimeType === 'batasAtas') {
      setSelectedBatasAtas(time);
    } else if (currentTimeType === 'batasBawah') {
      setSelectedBatasBawah(time);
    }
    setShowDropdown(false); // Menyembunyikan dropdown setelah memilih waktu
  };

  const handleCancel = () => {
    setShowDropdown(false); // Menyembunyikan dropdown saat cancel
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Potongan</Text>
        <TextInput
          style={styles.input}
          value={selectedPotongan}
          onChangeText={setSelectedPotongan}
          keyboardType="numeric"
          placeholder="Masukkan Potongan dalam Persen"
        />

        <Text style={styles.label}>Batas Atas</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handleShowDropdown('batasAtas')}
        >
          <Text>{selectedBatasAtas}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Batas Bawah</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handleShowDropdown('batasBawah')}
        >
          <Text>{selectedBatasBawah}</Text>
        </TouchableOpacity>

        {/* Dropdown untuk memilih waktu */}
        {showDropdown && (
          <View style={styles.dropdown}>
            <TimerPicker
              isVisible={showDropdown} // Menampilkan dropdown hanya jika showDropdown true
              padWithNItems={2}
              LinearGradient={LinearGradient}
              initialTime={currentTimeType === 'batasAtas' ? selectedBatasAtas : selectedBatasBawah}
              styles={{
                theme: 'light',
                backgroundColor: '#333',
                pickerItem: {
                  fontSize: 14, // Ukuran font lebih kecil
                  color: '#000',
                },
                pickerLabel: {
                  fontSize: 12, // Ukuran font lebih kecil untuk label
                  marginTop: 0,
                  color: '#000',
                },
                pickerContainer: {
                  marginRight: 6,
                  backgroundColor: '#FFF',
                },
              }}
              onConfirm={handleTimeSelect}
              onCancel={handleCancel} // Menyembunyikan dropdown saat cancel
            />
          </View>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E7E9F1', paddingTop: 20 },  // Menambahkan padding top agar header tidak terpotong
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',  // Mengatur agar judul header berada di tengah
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',  // Menetapkan header tetap di atas
    top: 0,
    left: 0,
    right: 0,  // Menjaga agar header tetap lebar penuh
    zIndex: 10,  // Memberikan prioritas rendering agar header tidak tertutup oleh konten
  },
  headerTitle: { textAlign: 'center', fontSize: 20, fontWeight: 'bold' },  // Mengubah agar text header tetap berada di tengah
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 20,
    marginTop: 37,  // Memberikan margin agar konten tidak tumpang tindih dengan header
  },
  label: { fontSize: 16, marginTop: 10 },
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
    shadowOffset: { width: 0, height: 2 }, // Menyesuaikan posisi bayangan
    shadowOpacity: 0.3, // Menyesuaikan intensitas bayangan
    shadowRadius: 5, // Menyesuaikan kelembutan bayangan
    elevation: 5, // Memberikan bayangan di perangkat Android
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { backgroundColor: '#CCC', padding: 15, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});

export default TambahPa;
