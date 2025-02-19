import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import Icon from 'react-native-vector-icons/Ionicons'; // Pastikan Anda telah menginstal react-native-vector-icons

const PencapaianKerja = () => {
  const [postData, setPostData] = useState({ tahun_id: '', bulan_id: '' });
  const [listTahun, setListTahun] = useState([]);
  const [listBulan, setListBulan] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const tahunData = [
      { id: 1, tahun: '2020' },
      { id: 2, tahun: '2021' },
      { id: 3, tahun: '2022' },
      { id: 4, tahun: '2023' },
      { id: 5, tahun: '2024' },
      { id: 6, tahun: '2025' },
    ];

    const bulanData = [
      { id: 1, bulan: "Januari" },
      { id: 2, bulan: "Februari" },
      { id: 3, bulan: "Maret" },
      { id: 4, bulan: "April" },
      { id: 5, bulan: "Mei" },
      { id: 6, bulan: "Juni" },
      { id: 7, bulan: "Juli" },
      { id: 8, bulan: "Agustus" },
      { id: 9, bulan: "September" },
      { id: 10, bulan: "Oktober" },
      { id: 11, bulan: "November" },
      { id: 12, bulan: "Desember" }

    ];

    setListTahun(tahunData);
    setListBulan(bulanData);
  }, []);

  const handleSelectTahun = (value) => {
    setPostData((prevData) => ({ ...prevData, tahun_id: value }));
  };

  const handleSelectBulan = (value) => {
    setPostData((prevData) => ({ ...prevData, bulan_id: value }));
  };

  const generatePdfUrl = (tahunId, bulanId) => {
    const url = `http://192.168.60.68:8000/report/capaian_kinerja?type=stream&bulan_id=${bulanId}&tahun_id=${tahunId}&user_jabatan_id=0a4df7b9-7962-457c-bd47-23ce9a50a02d`;
    setPdfUrl(url);
    return url;
  };

  const downloadAndOpenPdf = async () => {
    const fileUrl = generatePdfUrl(postData.tahun_id, postData.bulan_id)
    if (!fileUrl) {
      setErrorMessage('Tidak ada file PDF untuk diunduh.');
      return;
    }

    const fileName = `kontrak_kinerja_${postData.tahun_id}.pdf`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      setLoading(true);

      console.log("Downloading:", fileUrl);
      const response = await fetch(fileUrl, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Gagal mengunduh file. Kode status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType.includes('application/pdf')) {
        setShowNotFoundModal(true);
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        await RNFS.writeFile(filePath, base64data, 'base64');
        console.log("File downloaded:", filePath);
        setSuccessModalVisible(true);
        FileViewer.open(filePath);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error downloading file:", error);
      setErrorMessage(error.message || 'Terjadi kesalahan saat mengunduh file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Pilih Tahun <Text style={styles.required}>*</Text>:
            </Text>

            <View style={styles.dropdownRows}>
              <Dropdown
                data={listTahun}
                labelField="tahun"
                valueField="id"
                value={postData.tahun_id}
                onChange={(item) => handleSelectTahun(item.id)}
                placeholder="-- PILIH TAHUN --"
                style={styles.dropdown}
              />
              <Dropdown
                data={listBulan}
                labelField="bulan"
                valueField="id"
                value={postData.bulan_id}
                onChange={(item) => handleSelectBulan(item.id)}
                placeholder="-- PILIH BULAN --"
                style={styles.dropdown}
              />
            </View>
          </View>

          {postData.tahun_id && postData.bulan_id ? (
            <Button title="Unduh PDF" onPress={downloadAndOpenPdf} />
          ) : (
            postData.tahun_id && <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan.</Text>
          )}
        </View>
      </View>

      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Mengunduh file, harap tunggu...</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={showNotFoundModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={64} color="red" />
            <Text style={styles.successText}>File tidak ditemukan</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNotFoundModal(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={successModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={64} color="green" />
            <Text style={styles.successText}>Unduhan Selesai!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSuccessModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: {
    flexDirection: 'column',
  },
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  // Tambahkan 
  row: {
    marginBottom: 20,
  },
  dropdownRows: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  required: {
    color: 'red',
  },
  dropdown: {
    flex: 1,
    marginTop: 10,
    height: 50,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 20,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  noDataText: {
    marginTop: 20,
    color: '#4B5563',
    fontSize: 14,
  },
  pdfView: {
    marginTop: 20,
    height: 500,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default PencapaianKerja;