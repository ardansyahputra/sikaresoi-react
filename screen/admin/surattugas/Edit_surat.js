import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import useApiClient from '../../../src/api/apiClient';
import {Dropdown} from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';

const EditSuratTugas = ({navigation, route}) => {
  const {uuid} = route.params;
  const apiClient = useApiClient();
  const [editData, setEditData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [jabatanList, setJabatanList] = useState([]);
  const [selectedJabatan, setSelectedJabatan] = useState(null);
  const [isLoadingJabatan, setIsLoadingJabatan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSPTCalendarVisible, setSPTCalendarVisible] = useState(false);
  const [isTugasCalendarVisible, setTugasCalendarVisible] = useState(false);
  const [tanggalSPT, setTanggalSPT] = useState(null);
  const [tanggalTugasStart, setTanggalTugasStart] = useState(null);
  const [tanggalTugasEnd, setTanggalTugasEnd] = useState(null);

  useEffect(() => {
    if (uuid) {
      fetchEditData(uuid);
    }
  }, [uuid]);

  useEffect(() => {
    if (tanggalTugasStart && tanggalTugasEnd && editData.id) {
      setStartDate(tanggalTugasStart);
      setEndDate(tanggalTugasEnd);
      fetchUserData(tanggalTugasStart, tanggalTugasEnd, editData.id);
    }
  }, [tanggalTugasStart, tanggalTugasEnd, editData.id]);

  const fetchUserData = async (start, end, stid) => {
    try {
      if (!start || !stid) {
        console.warn('Tanggal atau STID belum dipilih.');
        return;
      }

      setIsLoading(true);
      const startDateStr = formatDateToString(start);
      const endDateStr = end ? formatDateToString(end) : startDateStr;
      const dateRange = `${startDateStr}/${endDateStr}`;
      const fullUrl = `/surat-tugas/user?date=${encodeURIComponent(
        dateRange,
      )}&stid=${stid}`;

      console.log(
        `Fetching user data from: ${apiClient.defaults.baseURL}${fullUrl}`,
      );

      const response = await apiClient.get(fullUrl);
      setUserList(response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      })),
    );
      console.log("USER LIST NIH BOSSSSSSSSSSSSSSSSSSSSSSSSSSSS", userList)
    } catch (error) {
      console.error(
        'Error fetching user ',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Gagal mengambil data user.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJabatanData = async () => {
    try {
      setIsLoadingJabatan(true);

      if (!editData.tembusan) {
        console.warn('Tembusan belum tersedia.');
        return;
      }

      const url = `/surat-tugas/jabatan?tembusan=${editData.tembusan}`;
      console.log(
        'Fetching jabatan data from:',
        apiClient.defaults.baseURL + url,
      );

      const response = await apiClient.get(url);
      console.log('Jabatan Data Response:', response.data);

      if (response.data.status && Array.isArray(response.data.data)) {
        const formattedJabatan = response.data.data.map(jabatan => ({
          label: jabatan.nm_jabatan,
          value: jabatan.id.toString(),
          uuid: jabatan.uuid, // Menambahkan UUID jika diperlukan
        }));

        setJabatanList(formattedJabatan);
        if (
          selectedJabatan &&
          !formattedJabatan.some(j => j.value === selectedJabatan)
        ) {
          setSelectedJabatan(null);
        }
      } else {
        console.warn('Format data jabatan tidak valid:', response.data);
        Alert.alert('Error', 'Format data jabatan tidak valid.');
      }
    } catch (error) {
      console.error(
        'Error fetching jabatan:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Gagal mengambil data jabatan.');
    } finally {
      setIsLoadingJabatan(false);
    }
  };

  useEffect(() => {
    if (editData.tembusan !== undefined) {
      fetchJabatanData();
    }
  }, [editData.tembusan]);

  const fetchEditData = async uuid => {
    try {
      const response = await apiClient.get(`/surat-tugas/${uuid}/show`);
      setEditData(response.data.data);
    } catch (error) {
      console.error('Error fetching edit ', error);
      Alert.alert('Error', 'Gagal mengambil data untuk diedit.');
    }
  };

  const submitEdit = async () => {
    try {
      if (!startDate || !selectedUser) {
        Alert.alert('Error', 'Mohon pilih tanggal dan user terlebih dahulu.');
        return;
      }

      const payload = {
        ...editData,
        start_date: formatDateToString(startDate),
        end_date: formatDateToString(endDate || startDate),
        user_id: selectedUser,
      };

      await apiClient.post(`/nowa/${editData.uuid}/update`, payload);
      Alert.alert('Berhasil', 'Data berhasil diperbarui.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui data.');
    }
  };

  const formatDateToString = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tambahkan '0' jika kurang dari 10
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = date => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Tambah Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>NO SKP</Text>
        <View style={styles.skpContainer}>
          <Text style={styles.staticText}>ST-POLTEKPELB-</Text>
          <Text style={styles.dynamicText}>
            {editData.nomor || 'Tidak tersedia'}
          </Text>
        </View>

        <Text style={styles.label}>Tanggal SPT</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setSPTCalendarVisible(true)}>
          <Text>
            {tanggalSPT ? formatDisplayDate(tanggalSPT) : 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>

        <Modal visible={isSPTCalendarVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                startFromMonday
                minDate={new Date(2024, 0, 1)}
                maxDate={new Date(2025, 11, 31)}
                todayBackgroundColor="#ffcc00"
                selectedDayColor="#007bff"
                selectedDayTextColor="#FFFFFF"
                onDateChange={date => {
                  setTanggalSPT(date);
                  setSPTCalendarVisible(false);
                }}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSPTCalendarVisible(false)}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.label}>Tanggal Tugas</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setTugasCalendarVisible(true)}>
          <Text>
            {tanggalTugasStart && tanggalTugasEnd
              ? `${formatDisplayDate(tanggalTugasStart)} - ${formatDisplayDate(
                  tanggalTugasEnd,
                )}`
              : 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={isTugasCalendarVisible}
          transparent
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                startFromMonday
                allowRangeSelection
                minDate={new Date(2024, 0, 1)}
                maxDate={new Date(2025, 11, 31)}
                todayBackgroundColor="#ffcc00"
                selectedDayColor="#007bff"
                selectedDayTextColor="#FFFFFF"
                onDateChange={(date, type) => {
                  if (type === 'START_DATE') {
                    setTanggalTugasStart(date);
                    setTanggalTugasEnd(null);
                  } else {
                    setTanggalTugasEnd(date);
                    setTugasCalendarVisible(false);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setTugasCalendarVisible(false)}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.label}>User</Text>
        <Dropdown
          style={styles.dropdownuser}
          data={userList}
          labelField="label"
          valueField="value"
          placeholder={isLoading ? 'Loading...' : 'Pilih User'}
          value={selectedUser}
          disable={isLoading || userList.length === 0}
          onChange={item => {
            setSelectedUser(item.value);
            setEditData(prev => ({...prev, user_id: item.label}));
          }}
        />

        <Text style={styles.label}>Jabatan</Text>
        <Dropdown
          style={styles.dropdownuser}
          data={jabatanList}
          labelField="label"
          valueField="value"
          placeholder={isLoadingJabatan ? 'Loading...' : 'Pilih Jabatan'}
          value={selectedJabatan}
          disable={isLoadingJabatan}
          onChange={item => {
            setSelectedJabatan(item.value);
            setEditData(prev => ({
              ...prev,
              jabatan_id: item.value,
              jabatan_uuid: item.uuid,
            }));
          }}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={submitEdit}>
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
  dropdownItem: {
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  customFont: {
    fontFamily: 'Poppins-Regular',
  },
  skpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  staticText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dynamicText: {
    fontSize: 16,
    color: '#333',
  },
  calendarText: {
    fontSize: 16,
    color: '#333',
  },
  todayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  calendarHeader: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectedRange: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  selectedDate: {
    fontSize: 15,
    color: '#333',
    marginTop: 1,
    textAlign: 'left', // Ubah dari 'center' ke 'left'
    alignSelf: 'flex-start', // Pastikan teks mengikuti layout ke kiri
    marginLeft: 10, // Tambahkan sedikit margin jika diperlukan
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownuser: {
    // Gantilah namanya jika ingin lebih deskriptif
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditSuratTugas;