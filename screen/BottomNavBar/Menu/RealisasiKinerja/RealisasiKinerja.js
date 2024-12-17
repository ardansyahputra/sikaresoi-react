import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';


const RealisasiKinerja = () => {
  const navigation = useNavigation(); // Untuk navigasi antar layar

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
          <Text style={styles.headerTitle}>Realisasi Kinerja</Text>
          <Text style={styles.headerSubtitle}>User • Kinerja • Realisasi</Text>
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
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>Desember</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+ TUGAS TAMBAHAN</Text>
        </TouchableOpacity>
      </View>

      {/* Table Section */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Data Kosong!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  headerSubtitle: { color: "#D1D5DB", marginTop: 4 },

  // Notification styles
  notification: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderColor: "#F59E0B",
  },
  notificationText: { color: "#92400E", fontSize: 14 },

  // Card styles
  card: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 4,
  },
  cardHeader: { marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  infoContainer: { marginTop: 8 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontWeight: "bold", color: "#6B7280", fontSize: 14 },
  value: { color: "#111827", fontSize: 14 },

  // Action Row
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
  periodButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  periodText: { fontSize: 14, fontWeight: "600", color: "#4B5563" },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  buttonText: { color: "#FFF", fontWeight: "bold" },

  // Table Section
  tableContainer: {
    backgroundColor: "#FFF",
    margin: 16,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 4,
  },
  tableHeader: { color: "#6B7280", fontSize: 16, fontWeight: "bold" },
});

export default RealisasiKinerja;
