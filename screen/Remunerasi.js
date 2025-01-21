import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";

const Remunerasi = () => {
  const [postData, setPostData] = useState({ bulan_id: 1, tahun_id: 2021 });
  const [modalVisible, setModalVisible] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(true);

  const data = {
    gaji: 7299960,
    insentif: 13307218,
    tugasUtama: 13307218,
    tugasTambahan: 0,
    potonganAbsensi: 1151074,
    potonganPajak: 1657998,
    totalRemunerasi: 17798105,
    remunerasiDibayar: 17798105,
  };

  const listBulan = [
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
    { id: 12, bulan: "Desember" },
  ];

  const listTahun = [
    { id: 2021, tahun: "2021" },
    { id: 2022, tahun: "2022" },
    { id: 2023, tahun: "2023" },
    { id: 2024, tahun: "2024" },
    { id: 2025, tahun: "2025" },
  ];

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
  };

  const getSelectedBulan = () => {
    const selectedBulan = listBulan.find((bulan) => bulan.id === postData.bulan_id);
    return selectedBulan ? selectedBulan.bulan : "Pilih Bulan";
  };

  const getSelectedTahun = () => {
    const selectedTahun = listTahun.find((tahun) => tahun.id === postData.tahun_id);
    return selectedTahun ? selectedTahun.tahun : "Pilih Tahun";
  };

  const formatRupiah = (value) => `Rp. ${value.toLocaleString("id-ID")}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pilih Bulan dan Tahun</Text>

      <View style={styles.pickerContainer}>
        <TouchableOpacity
          onPress={() => handleOpenModal(true)}
          style={styles.periodButton}
        >
          <Text style={styles.periodText}>{getSelectedBulan()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleOpenModal(false)}
          style={styles.periodButton}
        >
          <Text style={styles.periodText}>{getSelectedTahun()}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isMonthPicker ? "Pilih Bulan" : "Pilih Tahun"}
            </Text>
            <FlatList
              data={isMonthPicker ? listBulan : listTahun}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.id, isMonthPicker)}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>
                    {isMonthPicker ? item.bulan : item.tahun}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.rightColumn}>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>TOTAL REMUNERASI</Text>
            <Text style={styles.cardValue}>{formatRupiah(data.totalRemunerasi)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>REMUNERASI DIBAYAR</Text>
            <Text style={styles.cardValue}>{formatRupiah(data.remunerasiDibayar)}</Text>
          </View>
        </View>
      </View> 

      {/* DESKRIPSI Section */}
      <View style={[styles.card, styles.contentContainer, styles.deskripsiCard]}>
        <Text style={styles.sectionTitle}>DESKRIPSI</Text>
        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "red" }]} />
            <Text style={styles.deskripsiText}>Gaji (P1)</Text>
          </View>
          <Text style={styles.deskripsiValue}>{formatRupiah(data.gaji)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "cyan" }]} />
            <Text style={styles.deskripsiText}>Insentif (P2)</Text>
          </View>
          <Text style={styles.deskripsiValue}>{formatRupiah(data.insentif)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "purple", height: 2 }]} />
            <Text style={styles.deskripsiSubText}>Tugas Utama</Text>
          </View>
          <Text style={styles.deskripsiValue}>{formatRupiah(data.tugasUtama)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "black", height: 2 }]} />
            <Text style={styles.deskripsiSubText}>Tugas Tambahan</Text>
          </View>
          <Text style={styles.deskripsiValue}>{formatRupiah(data.tugasTambahan)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "orange" }]} />
            <Text style={styles.deskripsiText}>Potongan Absensi</Text>
          </View>
          <Text style={styles.deskripsiValue}>- {formatRupiah(data.potonganAbsensi)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "gold" }]} />
            <Text style={styles.deskripsiText}>Potongan Pajak</Text>
          </View>
          <Text style={styles.deskripsiValue}>- {formatRupiah(data.potonganPajak)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  periodButton: {
    backgroundColor: "#6D28D9",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  periodText: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Roboto-Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
  },
  deskripsiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  deskripsiLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  deskripsiText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  deskripsiSubText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 8,
  },
  deskripsiValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    textAlign: "right",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 25,
    marginBottom: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "left",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "left",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F2937",
  },
  rightColumn: {
    marginBottom: 30,
  },
  deskripsiCard: {
    maxWidth: "100%", // Adjusted width for the deskripsi card
    maxHeight: "35%",
  },
});

export default Remunerasi;
