import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { TimerPicker } from 'react-native-timer-picker';  // Pastikan mengimpor TimerPicker dengan benar
import LinearGradient from 'react-native-linear-gradient';

const EditPage = ({ route, navigation }) => {
  const { initialPotongan, initialBatasAtas, initialBatasBawah } = route.params;

  const [selectedPotongan, setSelectedPotongan] = useState(initialPotongan);
  const [selectedBatasAtas, setSelectedBatasAtas] = useState(initialBatasAtas);
  const [selectedBatasBawah, setSelectedBatasBawah] = useState(initialBatasBawah);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTimeType, setCurrentTimeType] = useState(null);  // Untuk menandai apakah batas atas atau batas bawah yang sedang dipilih

  const handleSave = () => {
    console.log('Potongan:', selectedPotongan);
    console.log('Batas Atas:', selectedBatasAtas);
    console.log('Batas Bawah:', selectedBatasBawah);
    navigation.goBack();
  };

  const handleShowPicker = (timeType) => {
    setCurrentTimeType(timeType);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Perbaikan handle modal untuk menyimpan waktu
  const handleModalSave = () => {
    if (currentTimeType === 'batasAtas') {
      console.log("New Batas Atas:", selectedBatasAtas);  // Debug
      setSelectedBatasAtas(selectedBatasAtas);  // Memastikan nilai yang dipilih untuk batas atas diset
    } else if (currentTimeType === 'batasBawah') {
      console.log("New Batas Bawah:", selectedBatasBawah);  // Debug
      setSelectedBatasBawah(selectedBatasBawah);  // Memastikan nilai yang dipilih untuk batas bawah diset
    }
    setIsModalVisible(false);  // Menutup modal setelah memilih waktu
  };
  


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Edit Data</Text>
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
          onPress={() => handleShowPicker('batasAtas')}  // Show picker for batas atas
        >
          <Text>{selectedBatasAtas}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Batas Bawah</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handleShowPicker('batasBawah')}  // Show picker for batas bawah
        >
          <Text>{selectedBatasBawah}</Text>
        </TouchableOpacity>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal untuk TimerPicker */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleModalCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <TimerPicker
  isVisible={isModalVisible}
  padWithNItems={2}
  LinearGradient={LinearGradient}
  initialTime={currentTimeType === 'batasAtas' ? selectedBatasAtas : selectedBatasBawah}  // Pastikan nilai ini sudah benar
  styles={{
    theme: "light",  
    backgroundColor: "#FFF",  
    pickerItem: {
      fontSize: 24,  
      color: "#000",  
    },
    pickerLabel: {
      fontSize: 20,  
      marginTop: 0,
      color: "#000",  
    },
    pickerContainer: {
      marginRight: 6,
      backgroundColor: "#FFF",  
    },
  }}
  onConfirm={(time) => {
    console.log("Confirmed time:", time);  // Debug untuk memastikan waktu yang dipilih
    if (currentTimeType === 'batasAtas') {
      setSelectedBatasAtas(time);  // Pastikan waktu yang dipilih diset ke selectedBatasAtas
    } else if (currentTimeType === 'batasBawah') {
      setSelectedBatasBawah(time);  // Pastikan waktu yang dipilih diset ke selectedBatasBawah
    }
    setIsModalVisible(false);  // Menutup modal setelah memilih waktu
  }}
  onCancel={handleModalCancel}  // Menutup modal jika dibatalkan
/>


            {/* Tombol Simpan dan Batal dalam Modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleModalCancel}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleModalSave}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E7E9F1' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: { flex: 2, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
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
  },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { backgroundColor: '#CCC', padding: 15, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparan hitam
  },
  modalContent: {
    backgroundColor: '#fff', // Background putih
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
});

export default EditPage;
