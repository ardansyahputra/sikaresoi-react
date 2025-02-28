import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../src/api/apiClient';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const CalendarComponent = () => {
  const apiClient = useApiClient();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(
    new Date().getMonth() + 1,
  );
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
        return prevDays.filter(d => d.date !== date);
      } else {
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
      fetchWorkDays(displayedMonth, displayedYear);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'Gagal menyimpan data');
      setIsModalVisible(true);
    }
  }, [selectedDays, displayedMonth, displayedYear]);

  const createCalendarDays = () => {
    const daysInMonth = new Date(displayedYear, displayedMonth, 0).getDate();
    const firstDayOfMonth = new Date(
      displayedYear,
      displayedMonth - 1,
      1,
    ).getDay();

    const dayHeaders = dayNames.map((day, index) => (
      <View key={`header-${index}`} style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day}</Text>
      </View>
    ));

    const emptyDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      emptyDays.push(<View key={`empty-${i}`} style={styles.emptyDay}></View>);
    }

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
          onPress={() => handleDateSelect(dateString)}>
          <Text
            style={[
              styles.dayText,
              selectedDays.some(d => d.date === dateString) &&
                styles.selectedText,
            ]}>
            {day}
          </Text>
        </TouchableOpacity>,
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

    setDisplayedMonth(selectedMonth);
    setDisplayedYear(selectedYear);
    fetchWorkDays(selectedMonth, selectedYear);
  };

  const handleLihat = () => {
    setDisplayedMonth(selectedMonth);
    setDisplayedYear(selectedYear);
    fetchWorkDays(selectedMonth, selectedYear);
  };

  return (
    <View style={styles.rootContainer}>
      <Header title="Setting Hari Kerja" />
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.calendarWrapper}>
            <View style={styles.monthSelector}>
              <TouchableOpacity
                onPress={() => changeMonth('prev')}
                style={styles.monthNavButton}>
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.monthName}>
                {monthNames[displayedMonth - 1]} {displayedYear}
              </Text>

              <TouchableOpacity
                onPress={() => changeMonth('next')}
                style={styles.monthNavButton}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>{createCalendarDays()}</View>
          </View>
          <View style={styles.cardDivider} />

          <Text style={[GlobalStyle.SemiBold, styles.label]}>Bulan:</Text>
          <Dropdown
            style={[styles.dropdown, styles.input]}
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

          <Text style={[GlobalStyle.SemiBold, styles.label]}>Tahun:</Text>
          <Dropdown
            style={[styles.dropdown, styles.input]}
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

          <View style={styles.buttons}>
            <TouchableOpacity onPress={saveWorkDays} style={styles.saveButton}>
              <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                Simpan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLihat} style={styles.viewButton}>
              <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                Lihat
              </Text>
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
    marginVertical: 20,
    width: '115%',
    marginTop: -10,
    alignSelf: 'flex-start',
    left: '-7%', // Geser ke kiri sesuai kebutuhan
  },
  label: {
    fontSize: 14,
    color: '#313131',
    marginBottom: 5,
  },
  cardDivider: {
    height: 3,
    backgroundColor: '#ddd',
    marginVertical: 17,
  },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#F0ECEC',
    borderWidth: 1,
    borderColor: 'transparent',
    color: '#313131',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  monthSelector: {
    flexDirection: 'row', // Susun dalam satu baris
    alignItems: 'center', // Posisikan vertikal di tengah
    justifyContent: 'space-between', // Membuat jarak maksimal antara tombol dan teks
    paddingVertical: 10,
    paddingHorizontal: 10, // Tambahkan padding agar lebih proporsional
    backgroundColor: '#fff',
  },
  monthName: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Membuat teks mengisi ruang di tengah
    textAlign: 'center', // Pastikan teks berada di tengah
  },
  monthNavButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 35,
    marginBottom: 5,
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
    backgroundColor: '#fff',
    paddingTop: 10,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 8,
  },
  dayHeader: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  emptyDay: {
    width: 45,
    height: 45,
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
    backgroundColor: '#38a169',
    width: 35,
    height: 35,
    borderRadius: 17.5,
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    width: '48%',
    height: 48,
    backgroundColor: '#3699FE',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewButton: {
    width: '48%',
    height: 48,
    backgroundColor: '#28c4ac',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    backgroundColor: '#ff555f',
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonTextclose: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 45,
  },
});

export default CalendarComponent;
