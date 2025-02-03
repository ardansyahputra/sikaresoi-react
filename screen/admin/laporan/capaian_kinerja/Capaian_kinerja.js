import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import {APP_URL} from '@env';
import useApiClient from '../../../../src/api/apiClient'; // Custom API hook for making requests

export default function KontrakKerja({navigation}) {
  const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [userList, setUserList] = useState([]);
  const [positions, setPositions] = useState([]);
  const [url, setUrl] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const apiClient = useApiClient(); // Invoke the custom API hook

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient('/user_master/show');
        const data = response.data || (await response.json());

        if (data && data.res.code === 200) {
          const userData = data.data.map(user => ({
            label: user.name,
            value: user.id,
          }));
          setUserList(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch user positions
  useEffect(() => {
    if (selectedUser) {
      console.log('Fetching positions for user:', selectedUser); // Tambahkan log untuk memeriksa selectedUser
      const fetchPositions = async () => {
        try {
          const response = await apiClient(
            `/user/jabatan/show?user_id=${selectedUser}`,
          );
          const data = response.data || (await response.json());

          if (data && data.res.code === 200) {
            const positionData = data.data.map(position => ({
              label: position.jabatan.nm_jabatan,
              value: position.uuid,
            }));
            setPositions(positionData);
          } else {
            console.warn(
              'Tidak ada data jabatan yang ditemukan:',
              data.res.message,
            );
          }
        } catch (error) {
          console.error('Error fetching positions:', error);
        }
      };
      fetchPositions();
    }
  }, [selectedUser]);

// Year options
const yearData = [
  {label: '2020', value: '1'},
  {label: '2021', value: '2'},
  {label: '2022', value: '3'},
  {label: '2023', value: '4'},
  {label: '2024', value: '5'},
];


  const monthData = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 },
  ];

  const handleDownload = async () => {
    if (!selectedMonth || !selectedYear || !selectedUser || !selectedPosition) {
      setModalMessage('Harap pilih bulan dan tahun untuk laporan!');
      setIsModalVisible(true);
      return;
    }
  
    // URL API untuk file PDF
    const downloadUrl = `${APP_URL}/report/capaian_kinerja?type=stream&bulan_id=${selectedMonth}&tahun_id=${selectedYear}&user_jabatan_id=${selectedPosition}`;
  
    // Path penyimpanan file PDF pada perangkat
    const filePath = `${RNFS.DownloadDirectoryPath}/Capaian_Kinerja_${selectedUser}_${selectedMonth}_${selectedYear}.pdf`;
  
    try {
      // Fetch the file to check its content type
      const response = await apiClient.get(downloadUrl, { responseType: 'blob' });
  
      // Check if the response is not a PDF
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        setModalMessage('Data kosong atau laporan tidak ditemukan.');
        setIsModalVisible(true);
        return;
      }
  
      // Proceed with downloading if it is a PDF
      const download = RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
      });
  
      const result = await download.promise;
  
      if (result.statusCode === 200) {
        setModalMessage(`Laporan berhasil diunduh`)
      } else {
        setModalMessage('Gagal mengunduh laporan. Coba lagi.');
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Terjadi kesalahan saat mengunduh file.');
    }
  
    setIsModalVisible(true);
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Report Capaian Kinerja Pegawai</Text>
        <View style={styles.cardDivider}></View>

        <Text style={styles.label}>Pilih User *</Text>
        <Dropdown
          style={styles.dropdown}
          data={userList}
          labelField="label"
          valueField="value"
          placeholder="Pilih User"
          value={selectedUser}
          onChange={item => setSelectedUser(item.value)}
        />

        <Text style={styles.label}>Pilih Jabatan User *</Text>
        <Dropdown
          style={styles.dropdown}
          data={positions}
          labelField="label"
          valueField="value"
          placeholder="Pilih Jabatan User"
          value={selectedPosition}
          onChange={item => setSelectedPosition(item.value)}
          disabled={!selectedUser}
        />

        <Text style={styles.label}>Pilih Bulan *</Text>
        <Dropdown
          style={styles.dropdown}
          data={monthData}
          labelField="label"
          valueField="value"
          placeholder="Pilih Bulan"
          value={selectedMonth}
          onChange={item => setSelectedMonth(item.value)}
        />

        <Text style={styles.label}>Pilih Tahun *</Text>
        <Dropdown
          style={styles.dropdown}
          data={yearData}
          labelField="label"
          valueField="value"
          placeholder="Pilih Tahun"
          value={selectedYear}
          onChange={item => setSelectedYear(item.value)}
        />

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}>
          <Text style={styles.buttonText}>Download Laporan</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for errors */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E7E9F1', paddingTop: 20},
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
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    marginHorizontal: 10,
    marginTop: 60,
    width: 387,
  },
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    marginHorizontal: 10,
    marginTop: 60,
    width: 387,
  },
  label: {fontSize: 16, marginBottom: 5, color: '#333'},
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  downloadButton: {
    backgroundColor: '#28c4ac',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {color: '#FFF', fontWeight: 'bold'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {fontSize: 16, color: '#333'},
  closeButton: {
    backgroundColor: '#28c4ac',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  closeButtonText: {color: '#FFF', fontWeight: 'bold'},
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 15,
  },
});
