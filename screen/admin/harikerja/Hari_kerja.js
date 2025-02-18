import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';

const CalendarComponent = () => {
  const apiClient = useApiClient();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth() + 1,);
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
  const [selectedDays, setSelectedDays] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];


  const fetchWorkDays = async (month, year) => {
    try {
      const response = await apiClient.get('/admin/harikerja/show', {
        params: {bulan: month, tahun: year},
      });
      setSelectedDays(response.data.data.days);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal mengambil data',
      );
    }
  };

  useEffect(() => {
    fetchWorkDays(displayedMonth, displayedYear);
  }, []);

  const handleDateSelect = useCallback(date => {
    const selectedDate = new Date(date);
    const weekday = selectedDate.toLocaleDateString('id-ID', {
      weekday: 'short',
    });
  
    setSelectedDays(prevDays => {
      const exists = prevDays.some(d => d.date === date);
      if (exists) {
        // Jika tanggal sudah ada, maka unselect (hapus)
        return prevDays.filter(d => d.date !== date);
      } else {
        // Jika tanggal belum ada, maka pilih
        return [...prevDays, {date, weekday}];
      }
    });
  }, []);

  const saveWorkDays = useCallback(async () => {
    try {
      await apiClient.post('/admin/harikerja/save', {
        bulan: displayedMonth,
        tahun: displayedYear,
        days: selectedDays,
      });
      setModalMessage('Data berhasil disimpan!');
      setIsModalVisible(true);
      
      // Refresh kalender setelah menyimpan
      fetchWorkDays(displayedMonth, displayedYear);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'Gagal menyimpan data');
      setIsModalVisible(true);
    }
  }, [selectedDays, displayedMonth, displayedYear]);
  

  const createCalendarDays = () => {
    const daysInMonth = new Date(displayedYear, displayedMonth, 0).getDate();
    const firstDayOfMonth = new Date(displayedYear, displayedMonth - 1, 1).getDay();
  
    // Add day headers
    const dayHeaders = dayNames.map((day, index) => (
      <View key={`header-${index}`} style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day}</Text>
      </View>
    ));
  
    // Add empty days for the first week (before the first day of the month)
    const emptyDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      emptyDays.push(<View key={`empty-${i}`} style={styles.emptyDay}></View>);
    }
  
    // Add the actual days in the month
    const calendarDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(displayedYear, displayedMonth - 1, day);
      const dateString = currentDate.toISOString().split('T')[0];
  
      calendarDays.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.day,
            selectedDays.some(d => d.date === dateString) && styles.selectedDay,
          ]}
          onPress={() => handleDateSelect(dateString)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDays.some(d => d.date === dateString) && styles.selectedText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
  
    return [...dayHeaders, ...emptyDays, ...calendarDays];
  };


  const changeMonth = direction => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(prevYear => prevYear - 1);
      } else {
        setSelectedMonth(prevMonth => prevMonth - 1);
      }
    } else if (direction === 'next') {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(prevYear => prevYear + 1);
      } else {
        setSelectedMonth(prevMonth => prevMonth + 1);
      }
    }

    // Memperbarui displayedMonth dan displayedYear saat bulan diubah
    setDisplayedMonth(selectedMonth);
    setDisplayedYear(selectedYear);
    fetchWorkDays(selectedMonth, selectedYear);
  };

  const handleLihat = () => {
    setDisplayedMonth(selectedMonth); // Menampilkan bulan yang dipilih
    setDisplayedYear(selectedYear); // Menampilkan tahun yang dipilih
    fetchWorkDays(selectedMonth, selectedYear); // Mengambil data hari kerja untuk bulan yang dipilih
  };

  return (
    <ScrollView>
    <View style={styles.header}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}></Text>
    </View>
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.monthName}>
          {monthNames[displayedMonth - 1]} {displayedYear}
        </Text>
        <View style={styles.monthNavContainer}>
          <TouchableOpacity
            onPress={() => changeMonth('prev')}
            style={styles.monthNavButton}>
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeMonth('next')}
            style={styles.monthNavButton}>
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.calendarContainer}>
        
        {createCalendarDays()}</View>

          <Text style={styles.label}>Bulan:</Text>
          <Dropdown
            style={styles.dropdown}
            data={monthNames.map((month, index) => ({
              label: month,
              value: index + 1,
            }))}
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
            placeholder="Pilih Bulan"
            labelField="label"
            valueField="value"
            containerStyle={styles.dropdownContainer}
          />

          <Text style={styles.label}>Tahun:</Text>
          <Dropdown
            style={styles.dropdown}
            data={Array.from({length: 7}, (_, i) => ({
              label: `${2020 + i}`,
              value: 2020 + i,
            }))}
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
            placeholder="Pilih Tahun"
            labelField="label"
            valueField="value"
            containerStyle={styles.dropdownContainer}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={saveWorkDays} style={styles.saveButton}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLihat} style={styles.viewButton}>
              <Text style={styles.buttonText}>Lihat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text>{modalMessage}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.modalButton}>
                <Text style={styles.buttonTextclose}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
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
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  monthName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 1,
    textAlign: 'center',
    marginBottom:-12,
  },
  monthNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: -45,
    marginBottom: -10,
  },
  monthNavButton: {
    padding: 20,
    margintop:20,
  },
  navButtonText: {
    fontSize: 35,
    marginBottom: 5,
  },
calendarContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 25,
  backgroundColor: '#f9f9f9',
  paddingTop: 10,
  justifyContent: 'flex-start', // Penyesuaian agar kalender tersusun rapi
  borderWidth: 2, // Tambahkan garis
  borderColor: '#ccc', // Warna garis
  borderRadius: 5, // Opsional untuk sudut membulat
  padding: 9, // Tambahan padding agar kontennya tidak terlalu mepet ke border
},
dayHeader: {
  width: 45,
  height: 45,
  justifyContent: 'center',
  alignItems: 'center',
  margin: 3,
},

emptyDay: {
  width: 45,  // Pastikan ukuran ruang kosong sama dengan ukuran hari
  height: 45, // Sama seperti ukuran hari
  margin: 3,
},

day: {
  width: 45,
  height: 45,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 20,
  margin: 3,
},

selectedDay: {
  backgroundColor: '#38a169', // Warna hijau
  width: 35,  // Ukuran lingkaran lebih kecil
  height: 35, // Ukuran lingkaran lebih kecil
  borderRadius: 17.5,  // Membuatnya tetap bulat
  justifyContent: 'center',
  alignItems: 'center',
  margin: 8,
},

selectedText: {
  color: '#fff',
  fontWeight: 'bold',

},

dayText: {
  fontSize: 14,
  color: '#333',
},

dayHeaderText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#666',
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
    fontWeight: 'bold',

  },
  viewButton: {
    backgroundColor: '#28c4ac',
    padding: 15,
    borderRadius: 5,
    width: '17%',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#ff555f',
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 13,
    color: '#fff',
  },
  buttonTextclose: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 45,
  },
  buttonTextli: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 2,
  },
});

export default CalendarComponent;