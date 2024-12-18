import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RealisasiKinerja = () => {
  const navigation = useNavigation(); // For navigation between screens

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [modalVisible, setModalVisible] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(true); // Flag to switch between month/year picker

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

  const handleOpenModal = (isMonth) => {
    setIsMonthPicker(isMonth);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelect = (value) => {
    if (isMonthPicker) {
      setSelectedMonth(value);
    } else {
      setSelectedYear(value);
    }
    handleCloseModal();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        {/* Title */}
        <View style={styles.headerContent}>
        <Image
          source={require('../../images/sikaresoi.png')} // Path gambar sesuai
          style={styles.headerImage}
        />
        <View>
          <Text style={styles.headerTitle}>Realisasi Kinerja</Text>
          <Text style={styles.headerSubtitle}>User • Kinerja • Realisasi</Text>
            </View>
        </View>
      </View>

      {/* Notification Banner */}
      <View style={styles.notification}>
        <Text style={styles.notificationText}>
          ❓ Mohon Kirim Permohonan SKP Anda Ke Atasan Terlebih Dahulu
        </Text>
      </View>

      {/* Detail Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Detail Informasi</Text>
        </View>
        <View style={styles.infoContainer}>
          {[ 
            { label: "NAMA", value: "BUDIAWAN, S.Si.T, MT" },
            { label: "PIMPINAN", value: "Dr. Ir. RUKMINI, S.T., M.T." },
            { label: "NIP", value: "19750615 199808 1 001" },
            { label: "NIP PIMPINAN", value: "19740311 199803 2 001" },
            { label: "JABATAN", value: "Pengembang teknologi pembelajaran" },
            { label: "JABATAN PIMPINAN", value: "Wakil Direktur I" },
            { label: "UNIT KERJA", value: "Politeknik Pelayaran Barombong" },
            { label: "UNIT KERJA PIMPINAN", value: "Politeknik Pelayaran Barombong" },
            { label: "PERIODE", value: "02 Januari 2023 s/d 31 Desember 2023" },
          ].map((item, index) => (
            <View key={index} style={styles.infoRow}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Section */}
      <View style={styles.actionRow}>
        {/* Month and Year Buttons */}
        <TouchableOpacity 
          onPress={() => handleOpenModal(true)}  // Open month picker modal
          style={[
            styles.periodButton,
            selectedMonth === "Januari" && styles.selectedButton // Add conditional styling for the selected month
          ]}
        >
          <Text style={styles.periodText}>{selectedMonth}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleOpenModal(false)} // Open year picker modal
          style={[
            styles.periodButton,
            selectedYear === "2020" && styles.selectedButton // Add conditional styling for the selected year
          ]}
        >
          <Text style={styles.periodText}>{selectedYear}</Text>
        </TouchableOpacity>

          {/* Additional Actions */}
              <TouchableOpacity style={styles.button}>
            <FontAwesome name="plus" size={16} color="#FFF" style={styles.icon} />
            <Text style={styles.buttonText}>TUGAS TAMBAHAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ubahAtasanButton}>
          <FontAwesome name="exchange" size={16} color="#FFF" style={styles.icon} />
          <Text style={styles.ubahAtasanText}>UBAH ATASAN</Text>
        </TouchableOpacity>
        </View>

      {/* Table Section with Horizontal Scroll */}
      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            {[ "Nomor", "Uraian Kegiatan", "Biaya", "AK", "Kuantitas", "Kualitas", "BOBOT", "STATUS", "Action" ]
              .map((header, index) => (
              <Text key={index} style={styles.tableHeaderText}>{header}</Text>
            ))}
          </View>

          {/* Table Data */}
          <View style={styles.tableRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.noDataText}>Data Kosong!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal for Month/Year Selection */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <FlatList
              data={isMonthPicker ? months : years}
              style={{ maxHeight: 500, width: "80%" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{
                    padding: 10,
                    backgroundColor: (isMonthPicker ? item === selectedMonth : item === selectedYear) ? '#2563EB' : 'white', // Highlight selected item
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: (isMonthPicker ? item === selectedMonth : item === selectedYear) ? 'white' : 'black' }}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#ff0000", paddingHorizontal: 16, paddingVertical: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, elevation: 5 },
  backButton: { marginRight: 12 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  headerSubtitle: { color: "#D1D5DB", marginTop: 4 },
  notification: { backgroundColor: "#FEF3C7", padding: 16, margin: 16, borderRadius: 8, borderLeftWidth: 4, borderColor: "#F59E0B" },
  notificationText: { color: "#92400E", fontSize: 14 },
  card: { backgroundColor: "#FFF", margin: 16, borderRadius: 12, padding: 16, shadowColor: "#000", shadowOpacity: 0.1, elevation: 4 },
  cardHeader: { marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  infoContainer: { marginTop: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 12 },
  label: { fontWeight: "bold", color: "#6B7280", fontSize: 14 },
  value: { color: "#111827", fontSize: 14 },
  actionRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginHorizontal: 16, marginVertical: 12, flexWrap: "wrap" },
  
  periodButton: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    minWidth: 120,
    position: "relative", // Needed for the indicator
  },

  headerImage: {
    size: 10,
    width: 200,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },

  selectedButton: {
    backgroundColor: "#FEE2E2", // Light red background when selected
  },
  
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    textAlign: "center",
  },

  selectedPeriodText: {
    color: "#DC2626", // Red text when selected
  },

  indicatorDot: {
    position: "absolute",
    bottom: -5, // Positioned just below the button
    left: "50%",
    transform: [{ translateX: -5 }],
    width: 10,
    height: 10,
    backgroundColor: "#DC2626", // Red dot
    borderRadius: 5, // Makes it circular
  },
  
  button: {
    flexDirection: 'row', // Membuat ikon dan teks dalam satu baris
    alignItems: 'center', // Rata tengah secara vertikal
    backgroundColor: '#007BFF', // Warna tombol
    padding: 10, // Padding tombol
    borderRadius: 5, // Membulatkan tombol
  },
  icon: {
    marginRight: 8, // Memberikan jarak antara ikon dan teks
  },
  buttonText: {
    color: '#FFF', // Warna teks
    fontSize: 16, // Ukuran teks
  },

  ubahAtasanButton: {
    flexDirection: 'row', // Ikon dan teks sejajar dalam satu baris
    alignItems: 'center', // Rata tengah secara vertikal
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    marginBottom:90,
    minWidth: 150,
    marginHorizontal: 15,
  },

  ubahAtasanText: { color: "#FFF", fontWeight: "bold" },
  tableContainer: { backgroundColor: "#FFF", marginHorizontal: 16, padding: 16, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1, elevation: 4, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 16, overflow: "hidden" },
  tableHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, borderBottomWidth: 2, borderBottomColor: "#E5E7EB", paddingBottom: 12, flexWrap: "nowrap", alignItems: "center" },
  tableHeaderText: { fontWeight: "bold", color: "#6B7280", fontSize: 14, textAlign: "center", flex: 1, paddingVertical: 10, paddingHorizontal: 12, minWidth: 120 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1 },
  noDataText: { color: "#D1D5DB", fontSize: 16, textAlign: "center" },
});

export default RealisasiKinerja;
