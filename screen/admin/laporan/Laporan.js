import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown'; // Import Dropdown

export default function Laporan() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State untuk modal
  const [modalMessage, setModalMessage] = useState(''); // State untuk pesan modal
  const [taskName, setTaskName] = useState(''); // State untuk nama tugas
  const [taskDescription, setTaskDescription] = useState(''); // State untuk deskripsi tugas

  // Data untuk dropdown
  const monthData = [
    {label: 'Januari', value: 1},
    {label: 'Februari', value: 2},
    {label: 'Maret', value: 3},
    {label: 'April', value: 4},
    {label: 'Mei', value: 5},
    {label: 'Juni', value: 6},
    {label: 'Juli', value: 7},
    {label: 'Agustus', value: 8},
    {label: 'September', value: 9},
    {label: 'Oktober', value: 10},
    {label: 'November', value: 11},
    {label: 'Desember', value: 12},
  ];

  const yearData = [
    {label: '2020', value: '2020'},
    {label: '2021', value: '2021'},
    {label: '2022', value: '2022'},
    {label: '2023', value: '2023'},
    {label: '2024', value: '2024'},
    {label: '2025', value: '2025'},
  ];

  // Reset dropdown ketika halaman dimuat
  useEffect(() => {
    setSelectedMonth(null);
    setSelectedYear(null);
  }, []);

  // Fungsi untuk mengunduh Excel
  const handleDownload = async () => {
    if (!selectedMonth || !selectedYear) {
      setModalMessage('Harap pilih bulan dan tahun terlebih dahulu!');
      setIsModalVisible(true); // Menampilkan modal jika data tidak lengkap
      return;
    }

    const apiUrl = `http://192.168.60.85:8000/report/admin/tugas_tambahan/${selectedMonth}/${selectedYear}`;
    return apiUrl;
  };

  const onPressDownload = async () => {
    const url = await handleDownload(); // Mendapatkan URL dari handleDownload
    if (url) {
      Linking.openURL(url); // Membuka URL jika ditemukan
    }
  };

  // Fungsi untuk mengirimkan data form tugas tambahan
  const handleAddTask = () => {
    if (!taskName || !taskDescription) {
      setModalMessage('Harap isi nama dan deskripsi tugas terlebih dahulu!');
      setIsModalVisible(true);
      return;
    }
    // Kirimkan data tugas tambahan ke API atau lakukan penyimpanan
    console.log('Task Added:', taskName, taskDescription);
    setTaskName(''); // Reset form setelah berhasil
    setTaskDescription('');
  };

  // State untuk dropdown toggle
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}></View>
      </View>

      {/* Konten */}
      <View style={styles.content}>
        {/* Dropdown untuk Laporan */}
        <View style={styles.dropdownWrapperTitle}>
          <TouchableOpacity
            onPress={() => setIsMonthYearOpen(!isMonthYearOpen)}>
            <Text style={styles.reportTitle}>
              Laporan Rekapitulasi Tugas Tambahan
            </Text>
          </TouchableOpacity>
          {isMonthYearOpen && (
            <View style={styles.formContainer}>
              {/* Dropdown Bulan */}
              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Pilih Bulan *</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={monthData}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Bulan"
                  value={selectedMonth}
                  onChange={item => setSelectedMonth(item.value)}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  dropdownStyle={styles.dropdownStyle}
                  iconColor="black"
                  arrowSize={18}
                  animationDuration={300}
                />
              </View>

              {/* Dropdown Tahun */}
              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Pilih Tahun *</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={yearData}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Tahun"
                  value={selectedYear}
                  onChange={item => setSelectedYear(item.value)}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  dropdownStyle={styles.dropdownStyle}
                  arrowSize={18}
                  iconColor="black"
                  animationDuration={300}
                />
              </View>

              {/* Tombol untuk Download Excel */}
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={onPressDownload}>
                <Text style={styles.downloadButtonText}>
                  Download Laporan Excel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Dropdown untuk Tambah Tugas */}
        <View style={styles.dropdownWrapperTitle}>
          <TouchableOpacity onPress={() => setIsTaskFormOpen(!isTaskFormOpen)}>
            <Text style={styles.reportTitle}>Tambah Tugas Tambahan</Text>
          </TouchableOpacity>
          {isTaskFormOpen && (
            <View style={styles.formContainer}>
              {/* Input Tugas */}
              <TextInput
                style={styles.input}
                placeholder="Nama Tugas"
                value={taskName}
                onChangeText={setTaskName}
              />
              {/* Input Deskripsi Tugas */}
              <TextInput
                style={styles.input}
                placeholder="Deskripsi Tugas"
                value={taskDescription}
                onChangeText={setTaskDescription}
              />
              {/* Tombol untuk Tambahkan Tugas */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTask}>
                <Text style={styles.addButtonText}>Tambah Tugas</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {/* Modal untuk menampilkan pesan error */}
      <Modal
        animationType="fade" // Mengganti slide menjadi fade untuk animasi
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  },
  headerLeft: {flex: 1},
  headerRight: {flex: 1, alignItems: 'flex-end'},
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  content: {paddingHorizontal: 20, paddingVertical: 50},
  dropdownWrapperTitle: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dropdownWrapper: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {fontSize: 16, color: '#555', marginBottom: 10},
  dropdown: {
    height: 50,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  placeholderStyle: {color: '#aaa', fontSize: 14},
  selectedTextStyle: {color: '#555', fontSize: 16},
  dropdownStyle: {backgroundColor: '#fff', borderRadius: 12},
  reportTitle: {fontSize: 15, fontWeight: 'bold'},
  formContainer: {marginTop: 10},
  downloadButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  downloadButtonText: {color: '#fff', textAlign: 'center', fontSize: 16},
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {color: '#fff', textAlign: 'center', fontSize: 16},

  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Menyusun isi modal di tengah layar
    alignItems: 'center', // Menyusun isi modal di tengah layar
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Efek latar belakang gelap
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300, // Lebar modal yang pas
    elevation: 10, // Tambahkan shadow untuk memberi efek keluar dari layar
  },
  modalMessage: {fontSize: 16, textAlign: 'center', marginBottom: 20},
  closeButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  closeButtonText: {color: '#fff', fontSize: 16},
});
