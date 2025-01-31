import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import useApiClient from '../../../src/api/apiClient';

const CalendarComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDays, setSelectedDays] = useState([]); // Tanggal yang dipilih
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const apiClient = useApiClient();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    const fetchWorkDays = async () => {
      try {
        const response = await apiClient.get('/admin/harikerja/show', {
          params: { bulan: selectedMonth, tahun: selectedYear }
        });

        const newDays = response.data.data.days;
        setSelectedDays(newDays);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Gagal mengambil data');
      }
    };

    fetchWorkDays();
  }, [selectedMonth, selectedYear]);

  const handleDateSelect = useCallback((date) => {
    console.log("Tanggal yang dipilih:", date); // Debugging tanggal yang dipilih

    const selectedDate = new Date(date);
    const weekday = selectedDate.toLocaleDateString('id-ID', { weekday: 'short' });

    // Menambahkan tanggal baru jika belum ada di array
    setSelectedDays(prevDays => {
      const exists = prevDays.some(d => d.date === date); // Cek jika tanggal sudah ada
      if (!exists) {
        console.log("Menambahkan tanggal:", date); // Debugging saat tanggal ditambahkan
        return [...prevDays, { date, weekday }]; // Jika belum ada, tambahkan tanggal baru
      }
      return prevDays; // Jika sudah ada, tetapkan array seperti semula
    });
  }, []);

  const saveWorkDays = useCallback(async () => {
    try {
      const response = await apiClient.post('/admin/harikerja/save', {
        bulan: selectedMonth,
        tahun: selectedYear,
        days: selectedDays
      });
      setModalMessage('Data berhasil disimpan!');
      setIsModalVisible(true);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'Gagal menyimpan data');
      setIsModalVisible(true);
    }
  }, [selectedDays, selectedMonth, selectedYear]);

  // Memastikan bahwa tanggal yang dipilih sudah sesuai dengan format yang benar
  const customDatesStyles = selectedDays.map(day => ({
    date: day.date.replace(/-/g, '/'), // Mengubah format menjadi YYYY/MM/DD jika perlu
    selected: true,
    selectedColor: '#FF6347',
    selectedTextColor: '#fff',
  }));
  

  console.log("Custom Dates Styles:", customDatesStyles); // Debugging untuk melihat apakah customDatesStyles terisi

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}></Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.label}>Pilih Bulan:</Text>
          <Dropdown
            style={styles.dropdown}
            data={monthNames.map((month, index) => ({ label: month, value: index + 1 }))}
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
            placeholder="Pilih Bulan"
            labelField="label"
            valueField="value"
            containerStyle={styles.dropdownContainer}
          />

          <Text style={styles.label}>Pilih Tahun:</Text>
          <Dropdown
            style={styles.dropdown}
            data={[{ label: '2023', value: 2023 }, { label: '2024', value: 2024 }]}
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
            placeholder="Pilih Tahun"
            labelField="label"
            valueField="value"
            containerStyle={styles.dropdownContainer}
          />

          {/* Modern Date Picker */}
          <DatePicker
            mode="calendar"
            selected={selectedDate}
            onDateChange={handleDateSelect}
            options={{
              backgroundColor: '#f9f9f9',
              textHeaderColor: '#333',
              textDefaultColor: '#000',
              selectedTextColor: '#fff',
              mainColor: '#333',
              textSecondaryColor: '#333',
              customDatesStyles: customDatesStyles, // Menampilkan lingkaran pada semua tanggal yang dipilih
            }}
            style={styles.datePicker}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={saveWorkDays} style={styles.saveButton}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDatePickerVisible(!datePickerVisible)} style={styles.viewButton}>
              <Text style={styles.buttonTextli}>Lihat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text>{modalMessage}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.buttonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
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
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  cardContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '20%',
  },
  viewButton: {
    backgroundColor: '#28c4ac',
    padding: 15,
    borderRadius: 5,
    width: '17%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  datePicker: {
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 13,
    color: '#fff',
  },
  buttonTextli: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 2,
  },
});

export default CalendarComponent;
