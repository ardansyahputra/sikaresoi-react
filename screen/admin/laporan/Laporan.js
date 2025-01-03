import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Modal,
  Image,
  Switch,
  ScrollView,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Laporan() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonthReport, setSelectedMonthReport] = useState(null);
  const [selectedYearReport, setSelectedYearReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isMonthYearOpenTugas, setIsMonthYearOpenTugas] = useState(false); // State untuk toggle dropdown Tugas
  const [isMonthYearOpenCapaian, setIsMonthYearOpenCapaian] = useState(false); // State untuk toggle dropdown Capaian Kinerja
  const [selectedTax, setSelectedTax] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLeftSign, setSelectedLeftSign] = useState(null); // State untuk tanda tangan kiri
  const [selectedRightSign, setSelectedRightSign] = useState(null); // State untuk tanda tangan kanan
  const [userData, setUserData] = useState([]); // State untuk menyimpan data pengguna
  const [isRemunerasiOpen, setIsRemunerasiOpen] = useState(false);
  const [isTunjanganTambahanOpen, setIsTunjanganTambahanOpen] = useState(false); // Toggle untuk tunjangan tambahan
  const [isP2Active, setIsP2Active] = useState(false);
  const [percentage, setPercentage] = useState(0); // Persentase mulai dari 0%

  const increasePercentage = () => {
    if (percentage < 100) {
      setPercentage(percentage + 1);
    }
  };

  const decreasePercentage = () => {
    if (percentage > 0) {
      setPercentage(percentage - 1);
    }
  };

  // Data bulan dan tahun
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

  useEffect(() => {
    // Mengambil data tanda tangan kiri dan kanan setelah komponen dimuat
    console.log('Fetching signatures...');
    fetchSignatures();
  }, []);

  // Fetch data dari API
  const fetchSignatures = async () => {
    try {
      const response = await axios.get(
        'http://192.168.60.163:8000/api/v1/user_master/show',
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NTIwNjAzLCJleHAiOjE3MzU1NDMzNzUsIm5iZiI6MTczNTUzOTc3NSwianRpIjoiM2swZ1kyMlM3SW1HNkJtVyIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.-P7sXHff7wcAqYJ_44Ddv4-WxokcNVrONHuyD6g31pY',
          },
        },
      );

      // Mengakses array data dari respons
      const data = response.data.data;

      if (Array.isArray(data)) {
        // Membuat opsi dropdown berdasarkan 'name' dan 'id'
        const nameOptions = data.map(item => ({
          label: item.name, // Menampilkan 'name' di dropdown
          value: item.id, // Menggunakan 'id' sebagai value
        }));

        // Menyimpan data ke dalam state untuk dropdown kiri dan kanan
        setUserData(nameOptions);
      } else {
        console.error(
          'Data tidak berupa array atau tidak memiliki properti name.',
        );
      }
    } catch (error) {
      console.error('Error fetching signatures:', error);
    }
  };

  // Menghandle perubahan dropdown tanda tangan kiri
  const handleLeftSignChange = item => {
    setSelectedLeftSign(item.value); // Menyimpan ID tanda tangan kiri
  };

  // Menghandle perubahan dropdown tanda tangan kanan
  const handleRightSignChange = item => {
    setSelectedRightSign(item.value); // Menyimpan ID tanda tangan kanan
  };

  const handleDownload = async () => {
    if (
      !selectedMonth &&
      !selectedYear &&
      !selectedMonthReport &&
      !selectedYearReport &&
      !(
        selectedMonth &&
        selectedYear &&
        selectedTax &&
        selectedType &&
        selectedLeftSign &&
        selectedRightSign
      )
    ) {
      setModalMessage('Harap pilih bulan dan tahun untuk salah satu laporan!');
      setIsModalVisible(true);
      return;
    }

    let capaianKinerjaUrl = '';
    let rekapitulasiUrl = '';
    let remunerasiUrl = '';

    // Jika bulan dan tahun "Laporan Rekapitulasi Tugas Tambahan" diisi
    if (selectedMonth && selectedYear) {
      capaianKinerjaUrl = `http://192.168.61.163:8000/report/admin/tugas_tambahan/${selectedMonth}/${selectedYear}`;
    }
    if (selectedMonthReport && selectedYearReport) {
      rekapitulasiUrl = `http://192.168.61.163:8000/report/admin/rekapitulasi/${selectedMonthReport}/${selectedYearReport}`;
    }

    // Jika semua field remunerasi terisi
    if (
      selectedMonth &&
      selectedYear &&
      selectedTax &&
      selectedType &&
      selectedLeftSign &&
      selectedRightSign
    ) {
      remunerasiUrl = `http://192.168.60.163:8000/report/admin/remunerasi/${selectedMonth}/${selectedYear}?p=${selectedTax}&kiri=${selectedLeftSign}&kanan=${selectedRightSign}&tipe=${selectedType}`;
    }
    if (
      selectedMonth &&
      selectedYear &&
      selectedTax &&
      selectedType &&
      selectedLeftSign &&
      selectedRightSign
    ) {
      tunjanganTambahanUrl = `http://192.168.60.163:8000/report/admin/tunjangan_tambahan_gaji/${selectedMonth}/${selectedYear}?p=${selectedTax}&kiri=${selectedLeftSign}&kanan=${selectedRightSign}&tk=${selectedType}&persentase=${percentage}&p2murni=${isP2Active}`;
    }
    console.log('Tunjangan Tambahan URL:', tunjanganTambahanUrl);

    if (
      !capaianKinerjaUrl &&
      !rekapitulasiUrl &&
      !remunerasiUrl &&
      !tunjanganTambahanUrl
    ) {
      setModalMessage(
        'Harap pilih bulan dan tahun untuk laporan yang ingin di-download!',
      );
      setIsModalVisible(true);
      return;
    }

    return {
      capaianKinerjaUrl,
      rekapitulasiUrl,
      remunerasiUrl,
      tunjanganTambahanUrl,
    };
  };

  const onPressDownload = async type => {
    const urls = await handleDownload();
    if (urls) {
      // Pilih API yang akan dipanggil berdasarkan parameter 'type'
      const url =
        type === 'rekapitulasi'
          ? urls.rekapitulasiUrl
          : type === 'remunerasi'
          ? urls.remunerasiUrl
          : type === 'tunjanganTambahan'
          ? urls.tunjanganTambahanUrl // Pastikan memilih URL yang benar
          : urls.capaianKinerjaUrl;

      console.log('Download URL:', url); // Log untuk memastikan URL yang dipilih benar

      if (url) {
        Linking.openURL(url); // Buka URL
      } else {
        setModalMessage('Tidak ada laporan yang dapat didownload');
        setIsModalVisible(true);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
        </View>
      </View>

      {/* Breadcrumbs */}
      <View style={styles.breadcrumbsContainer}>
        <Text style={styles.breadcrumbText}>
          <Text style={styles.boldText}>Admin</Text> {'-'} Report
        </Text>
      </View>

      <View style={styles.containers}>
        <View style={styles.content}>
          <Text style={styles.laporanjudul}>Laporan</Text>

          {/* Dropdown untuk Laporan Rekapitulasi Tugas Tambahan */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => setIsMonthYearOpenTugas(!isMonthYearOpenTugas)}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>
                LAPORAN REKAPITULASI TUGAS TAMBAHAN
              </Text>
              <Icon
                name={isMonthYearOpenTugas ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="black"
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            {isMonthYearOpenTugas && (
              <View style={styles.formContainer}>
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
                  />
                </View>
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
                  />
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => onPressDownload('capaianKinerja')}>
                  <Text style={styles.downloadButtonText}>
                    Download Laporan Capaian Kinerja
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Dropdown untuk Report Rekapitulasi Capaian Kinerja */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => setIsMonthYearOpenCapaian(!isMonthYearOpenCapaian)}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>REPORT REK</Text>
              <Icon
                name={isMonthYearOpenCapaian ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="black"
                style={styles.iconStyles}
              />
            </TouchableOpacity>
            {isMonthYearOpenCapaian && (
              <View style={styles.formContainer}>
                <View style={styles.dropdownWrapper}>
                  <Text style={styles.label}>Pilih Bulan *</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={monthData}
                    labelField="label"
                    valueField="value"
                    placeholder="Pilih Bulan"
                    value={selectedMonthReport}
                    onChange={item => setSelectedMonthReport(item.value)}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    dropdownStyle={styles.dropdownStyle}
                  />
                </View>

                <View style={styles.dropdownWrapper}>
                  <Text style={styles.label}>Pilih Tahun *</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={yearData}
                    labelField="label"
                    valueField="value"
                    placeholder="Pilih Tahun"
                    value={selectedYearReport}
                    onChange={item => setSelectedYearReport(item.value)}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    dropdownStyle={styles.dropdownStyle}
                  />
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => onPressDownload('rekapitulasi')}>
                  <Text style={styles.downloadButtonText}>
                    Download Laporan Rekapitulasi Excel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Remunerasi */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() => setIsRemunerasiOpen(!isRemunerasiOpen)}
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>REMUNERASI</Text>
              <Icon
                name={isRemunerasiOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="black"
                style={styles.iconStyles}
              />
            </TouchableOpacity>
            {isRemunerasiOpen && (
              <View style={styles.dropdownWrapper}>
                <View style={styles.formContainer}>
                  {/* Dropdown Tahun */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Pilih Tahun *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={yearData} // Menggunakan data dari yearData
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Tahun"
                      value={selectedYear}
                      onChange={item => setSelectedYear(item.value)}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>

                  {/* Dropdown Bulan */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Pilih Bulan *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={monthData} // Menggunakan data dari monthData
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Bulan"
                      value={selectedMonth}
                      onChange={item => setSelectedMonth(item.value)}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Potongan Pajak *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={[
                        {label: 'Progresif', value: 'PROGRESIF'},
                        {label: 'Final', value: 'FINAL'},
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Potongan Pajak"
                      value={selectedTax} // Menggunakan state selectedTax untuk menyimpan pilihan
                      onChange={item => setSelectedTax(item.value)} // Menyimpan nilai yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>

                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Pilih Tipe *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={[
                        {label: 'P1', value: 'P1'},
                        {label: 'P2', value: 'P2'},
                        {label: 'P1 & P2', value: 'ALL'},
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Tipe"
                      value={selectedType} // Menggunakan state selectedType untuk menyimpan pilihan
                      onChange={item => setSelectedType(item.value)} // Menyimpan nilai yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>
                  {/* Dropdown untuk Tanda Tangan Kiri */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Tanda Tangan Kiri *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih TTD Kiri"
                      value={selectedLeftSign} // Menggunakan state selectedLeftSign
                      onChange={item => handleLeftSignChange(item)} // Menyimpan ID yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                      data={userData} // Menggunakan data yang sudah diproses
                    />
                  </View>

                  {/* Dropdown untuk Tanda Tangan Kanan */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Tanda Tangan Kanan *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih TTD Kanan"
                      value={selectedRightSign} // Menggunakan state selectedRightSign
                      onChange={item => handleRightSignChange(item)} // Menyimpan ID yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                      data={userData} // Menggunakan data yang sudah diproses
                    />
                  </View>
                </View>
                {/* Tombol Download Excel */}\
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => onPressDownload('remunerasi')}>
                  <Text style={styles.downloadButtonText}>
                    Download Laporan Remunerasi
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Tunjangan Tambahan */}
          <View style={styles.dropdownWrapperTitle}>
            <TouchableOpacity
              onPress={() =>
                setIsTunjanganTambahanOpen(!isTunjanganTambahanOpen)
              }
              style={styles.titleWrapper}>
              <Text style={styles.reportTitle}>TUNJANGAN TAMBAHAN</Text>
              <Icon
                name={isTunjanganTambahanOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="black"
                style={styles.iconStyles}
              />
            </TouchableOpacity>
            {isTunjanganTambahanOpen && (
              <View style={styles.dropdownWrapper}>
                <View style={styles.formContainer}>
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Tunjangan Ke *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={[
                        {label: '13', value: '13'},
                        {label: '14', value: '14'},
                        {label: '15', value: '15'},
                        {label: '16', value: '16'},
                        {label: 'Insentif', value: 'INSENTIF'},
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Tunjangan Ke"
                      value={selectedType} // Menggunakan state untuk tunjangan ke
                      onChange={item => setSelectedType(item.value)} // Menyimpan nilai yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>

                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>P2 Murni *</Text>
                    {/* Wrapper untuk Switch dan Label */}
                    <View style={styles.switchWrapper}>
                      <Switch
                        value={isP2Active}
                        onValueChange={setIsP2Active} // Toggle nilai antara true dan false
                      />
                      <Text style={styles.switchLabel}>
                        {isP2Active ? 'Aktif' : 'Tidak Aktif'}
                      </Text>
                    </View>
                  </View>

                  {/* Dropdown presentage */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Persentase *</Text>s
                    <TextInput
                      style={styles.input}
                      value={`${percentage}`}
                      onChangeText={text => setPercentage(Number(text))}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Dropdown Bulan */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Pilih Bulan *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={monthData} // Data bulan
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Bulan"
                      value={selectedMonth}
                      onChange={item => setSelectedMonth(item.value)}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>
                  {/* Dropdown Tahun */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Pilih Tahun *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={yearData} // Data tahun
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Tahun"
                      value={selectedYear}
                      onChange={item => setSelectedYear(item.value)}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>

                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Potongan Pajak *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={[
                        {label: 'Progresif', value: 'PROGRESIF'},
                        {label: 'Final', value: 'FINAL'},
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih Potongan Pajak"
                      value={selectedTax} // Menggunakan state selectedTax untuk menyimpan pilihan
                      onChange={item => setSelectedTax(item.value)} // Menyimpan nilai yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                    />
                  </View>

                  {/* Dropdown untuk Tanda Tangan Kiri */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Tanda Tangan Kiri *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih TTD Kiri"
                      value={selectedLeftSign} // Menggunakan state selectedLeftSign
                      onChange={item => handleLeftSignChange(item)} // Menyimpan ID yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                      data={userData} // Menggunakan data yang sudah diproses
                    />
                  </View>

                  {/* Dropdown untuk Tanda Tangan Kanan */}
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Tanda Tangan Kanan *</Text>
                    <Dropdown
                      style={styles.dropdown}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih TTD Kanan"
                      value={selectedRightSign} // Menggunakan state selectedRightSign
                      onChange={item => handleRightSignChange(item)} // Menyimpan ID yang dipilih
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      dropdownStyle={styles.dropdownStyle}
                      data={userData} // Menggunakan data yang sudah diproses
                    />
                  </View>
                </View>

                {/* Tombol Download Laporan Tunjangan Tambahan */}
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => onPressDownload('tunjanganTambahan')}>
                  <Text style={styles.downloadButtonText}>
                    Download Laporan Tunjangan Tambahan
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
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
    </ScrollView>
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
  containers: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    marginTop: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  breadcrumbsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: -15,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold', // Menambahkan bold di sini
  },
  laporanjudul: {
    fontWeight: 'bold', // Menambahkan bold di sini
    fontSize: 24,
    marginBottom: 20,
    marginTop: -20,
  },
  content: {flex: 1, paddingHorizontal: 1, paddingVertical: 20},
  dropdownWrapperTitle: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20, // Cek apakah marginBottom terlalu besar
    padding: 25, // Cek apakah padding terlalu besar
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  iconStyle: {
    marginLeft: 10,
  },
  iconStyles: {
    marginLeft: 30,
  },
  formContainer: {marginTop: 10},
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    marginTop: 15,
  },
  dropdownWrapper: {
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#888',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  dropdownStyle: {
    borderRadius: 8,
    padding: 10,
  },
  downloadButton: {
    backgroundColor: '#28c4ac',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#f76c6c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  switchLabel: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  percentageContainer: {
    marginRight: 200,
    backgroundColor: '#D3D3D3', // Warna abu-abu untuk kotak persentase
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10, // Memberikan jarak antara persentase dan input
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
  },
  input: {
    height: 40,
    width: 80,
    borderWidth: 1,
    borderColor: '#D3D3D3', // Warna border kotak input
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 10,
  },
});
