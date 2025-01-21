import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

const KontrakKerja = () => {
  const [postData, setPostData] = useState({ tahun_id: '' });
  const [showTable, setShowTable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Daftar tahun statis
  const listTahun = [
    { id: 2020, tahun: '2020' },
    { id: 2021, tahun: '2021' },
    { id: 2022, tahun: '2022' },
    { id: 2023, tahun: '2023' },
    { id: 2024, tahun: '2024' },
    { id: 2025, tahun: '2025' },
  ];

  const refreshData = () => {
    setShowTable(false);
    setTimeout(() => {
      setShowTable(true); // Trigger re-render for table
    }, 10);
  };

  const handleSelectTahun = (value) => {
    setPostData((prevData) => ({ ...prevData, tahun_id: value }));
    setModalVisible(false);
    refreshData();
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
            <Text style={styles.label}>Pilih Tahun <Text style={styles.required}>*</Text>:</Text>
            <TouchableOpacity
              style={styles.yearButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.yearText}>{getSelectedTahun()}</Text>
            </TouchableOpacity>
          </View>

          {postData.tahun_id !== '' && (
            <View style={styles.tableContainer}>
              <Text style={styles.tableTitle}>Laporan Kontrak Kerja</Text>
              {showTable ? (
                <View style={styles.iframeContainer}>
                  <Text>Data for tahun ID: {postData.tahun_id}</Text>
                </View>
              ) : (
                <Text>Loading...</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Modal for year selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={listTahun}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectTahun(item.id)}
                >
                  <Text style={styles.modalItemText}>{item.tahun}</Text>
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
  required: {
    color: 'red',
  },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearText: {
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

export default KontrakKerja;
