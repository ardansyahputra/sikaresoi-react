import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const PencapaianKerja = () => {
  const [postData, setPostData] = useState({ bulan_id: 1, tahun_id: 2021 });
  const [showTable, setShowTable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(true);

  const listBulan = [
    { id: 1, bulan: 'Januari' },
    { id: 2, bulan: 'Februari' },
    { id: 3, bulan: 'Maret' },
    { id: 4, bulan: 'April' },
    { id: 5, bulan: 'Mei' },
    { id: 6, bulan: 'Juni' },
    { id: 7, bulan: 'Juli' },
    { id: 8, bulan: 'Agustus' },
    { id: 9, bulan: 'September' },
    { id: 10, bulan: 'Oktober' },
    { id: 11, bulan: 'November' },
    { id: 12, bulan: 'Desember' }
  ];

  const listTahun = [
    { id: 2021, tahun: '2021' },
    { id: 2022, tahun: '2022' },
    { id: 2023, tahun: '2023' },
    { id: 2024, tahun: '2024' },
    { id: 2025, tahun: '2025' }
  ];

  const refreshData = () => {
    setShowTable(false);
    setTimeout(() => {
      setShowTable(true);
    }, 10);
  };

  const handleOpenModal = (isMonth) => {
    setIsMonthPicker(isMonth);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelect = (value, isMonth) => {
    if (isMonth) {
      setPostData((prevData) => ({ ...prevData, bulan_id: value }));
    } else {
      setPostData((prevData) => ({ ...prevData, tahun_id: value }));
    }
    handleCloseModal();
    refreshData();
  };

  const getSelectedBulan = () => {
    const selectedBulan = listBulan.find((bulan) => bulan.id === postData.bulan_id);
    return selectedBulan ? selectedBulan.bulan : 'Pilih Bulan';
  };

  const getSelectedTahun = () => {
    const selectedTahun = listTahun.find((tahun) => tahun.id === postData.tahun_id);
    return selectedTahun ? selectedTahun.tahun : 'Pilih Tahun';
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Text style={styles.label}>Pilih Bulan dan Tahun:</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.periodButton}
                onPress={() => handleOpenModal(true)}
              >
                <Text style={styles.periodText}>{getSelectedBulan()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.periodButton}
                onPress={() => handleOpenModal(false)}
              >
                <Text style={styles.periodText}>{getSelectedTahun()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showTable && (
            <View style={styles.tableContainer}>
              <Text style={styles.tableTitle}>Laporan Pencapaian Kerja</Text>
              <View style={styles.iframeContainer}>
                <Text>Data for Bulan: {getSelectedBulan()} Tahun: {getSelectedTahun()}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={isMonthPicker ? listBulan : listTahun}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelect(item.id, isMonthPicker)}
                >
                  <Text style={styles.modalItemText}>{isMonthPicker ? item.bulan : item.tahun}</Text>
                </TouchableOpacity>
              )}
            />
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
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  periodText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  tableContainer: {
    marginTop: 20,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iframeContainer: {
    height: 300,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#4B5563',
  },
});

export default PencapaianKerja;
