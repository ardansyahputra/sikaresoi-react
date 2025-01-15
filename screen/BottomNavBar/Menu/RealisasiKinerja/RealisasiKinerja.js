import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";

const RealisasiKinerja = () => {
  const navigation = useNavigation();

  // States
  const [selectedMonth, setSelectedMonth] = useState(null); // Null for now
  const [selectedYear, setSelectedYear] = useState(null); // Null for now
  const [jabatanId, setJabatanId] = useState(null); // State for jabatan_id
  const [modalVisible, setModalVisible] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(true);
  const [dataDetail, setDataDetail] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [listBulan, setListBulan] = useState([]);
  const [listTahun, setListTahun] = useState([]);
  const [listJabatan, setListJabatan] = useState([]); // List of jabatan
  const [loading, setLoading] = useState(true);
  const [months] = useState([
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]);
  const [years] = useState(["2021", "2022", "2023", "2024"]);

  const baseURL = "http://192.168.60.230:8000/api/v1";
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1MjYyODcwLCJleHAiOjE3MzUyODg2OTUsIm5iZiI6MTczNTI4NTA5NSwianRpIjoiRm4yY1pqbTZKYW1LZzZVcyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.8a5B0kRt_mMYlfeCEJ4-VlyntnKNC7OrT5K9Z5Kb_YE';

  // Fetch data from Laravel (List Bulan, Tahun, and Jabatan)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tahunResponse = await axios.get(`${baseURL}/tahun/show`, {},
          {
          headers: {
            Authorization: token,
          },
        });
        const tahunData = await tahunResponse.json();
        setListTahun(tahunData.data);
 {}
         const bulanResponse = await axios.get(`${baseURL}/bulan/show`, {},
          {
          headers: {
            Authorization: token,
          },
        });
        const bulanData = await bulanResponse.json();
        setListBulan(bulanData.data);

        const jabatanResponse = await axios.get(`${baseURL}/jabatan/show`, {
          headers: {
            Authorization: token,
          },
        });
        const jabatanData = await jabatanResponse.json();
        setListJabatan(jabatanData.data); // Store jabatan data

        // Set default selected values
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        setSelectedYear(tahunData.data.find(tahun => tahun.tahun === currentYear)?.id || tahunData.data[0]?.id);
        setSelectedMonth(bulanData.data.find(bulan => bulan.id === currentMonth)?.id || bulanData.data[0]?.id);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Fetch realisasi kinerja based on selected month, year, and jabatan_id
  useEffect(() => {
    if (selectedMonth && selectedYear && jabatanId) {
      const fetchRealisasi = async () => {
        try {
          const response = await axios.post(`${baseURL}/user/kinerja/list/target/realisasi/index`, {},
            {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              bulan_id: selectedMonth,
              tahun_id: selectedYear,
              user_jabatan_id: jabatanId, // Pass jabatan_id to API
            }),
          });
          const data = await response.json();
          setDataDetail(data.kinerja);
          setDataTable(data.utama); // assuming 'utama' data is what you want to display in the table
          setLoading(false);
        } catch (error) {
          console.error('Error fetching realisasi data:', error);
          setLoading(false);
        }
      };

      fetchRealisasi();
    }
  }, [selectedMonth, selectedYear, jabatanId, token]);


  const handleOpenModal = (isMonth) => {
    console.log("Opening modal for", isMonth ? "month" : "year");
    setIsMonthPicker(isMonth);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal...");
    setModalVisible(false);
  };

  const handleSelect = (value) => {
    console.log("Selected value:", value);
    if (isMonthPicker) {
      setSelectedMonth(value);
    } else {
      setSelectedYear(value);
    }
    handleCloseModal();
  };

  if (loading) {
    console.log("Loading data...");
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
        <Image
          source={require('../../../assets/images/sikaresoi.png')} // Path gambar sesuai
          style={styles.headerImage}
        />
        <View>
          <Text style={styles.headerTitle}>Realisasi Kinerja</Text>
          <Text style={styles.headerSubtitle}>User • Kinerja • Realisasi</Text>
        </View>
        </View>
      </View>

      {/* Notification */}
      <View style={styles.notification}>
        <Text style={styles.notificationText}>
          ❓ Mohon Kirim Permohonan SKP Anda Ke Atasan Terlebih Dahulu
        </Text>
      </View>

      {/* Detail Informasi = Table Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Detail Informasi</Text>
        </View>
        {dataTable.length > 0 ? (
          <View style={styles.infoContainer}>
            {dataTable.map((row, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.label}>Nomor</Text>
                <Text style={styles.value}>{row.nomor}</Text>
                <Text style={styles.label}>Uraian Kegiatan</Text>
                <Text style={styles.value}>{row.kegiatan}</Text>
                <Text style={styles.label}>Biaya</Text>
                <Text style={styles.value}>{row.biaya}</Text>
                <Text style={styles.label}>AK</Text>
                <Text style={styles.value}>{row.ak}</Text>
                <Text style={styles.label}>Kuantitas</Text>
                <Text style={styles.value}>{row.kuantitas}</Text>
                <Text style={styles.label}>Kualitas</Text>
                <Text style={styles.value}>{row.kualitas}</Text>
                <Text style={styles.label}>BOBOT</Text>
                <Text style={styles.value}>{row.bobot}</Text>
                <Text style={styles.label}>STATUS</Text>
                <Text style={styles.value}>{row.status}</Text>
                <Text style={styles.label}>Action</Text>
                <Text style={styles.value}>{row.action}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>Data Kosong atau Gagal Dimuat!</Text>
        )}
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={isMonthPicker ? months : years}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.modalItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, elevation: 5 },
  backButton: { marginRight: 12 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#000" },
  headerSubtitle: { color: "#000", marginTop: 4 },
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
    borderRadius: 5,
  },

  tableContainer: { marginTop: 20 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#F9FAFB", padding: 10, borderRadius: 8 },
  tableHeaderText: { flex: 1, fontWeight: "bold", textAlign: "center" },
  tableRow: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#E5E7EB" },
  noDataText: { textAlign: "center", color: "#6B7280" },
  modalContainer: { backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1, justifyContent: "center", alignItems: "center" },
  modalItem: { backgroundColor: "#fff", padding: 10, marginVertical: 5, width: 200, alignItems: "center", justifyContent: "center", borderRadius: 4 },

});

export default RealisasiKinerja;
