import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Modal, StyleSheet, Alert 
} from "react-native";
import { Calendar } from "react-native-calendars";
import { TimerPickerModal } from "react-native-timer-picker";
import DocumentPicker from 'react-native-document-picker';
import useApiClient from "../src/api/apiClient";
import Header from "./Header";  // Import Header
import GlobalStyle from "./GlobalStyle"; // Import GlobalStyle

const AbsenPresensi = ({ navigation }) => {
  const [date, setDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("in");
  const [file, setFile] = useState("");
  const apiClient = useApiClient();


  const showTimePicker = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit() dipanggil");
  
    // 1️⃣ Cek apakah data sudah diisi
    console.log("🗓️ Tanggal:", date);
    console.log("⏰ Jam Masuk:", timeIn);
    console.log("⏳ Jam Keluar:", timeOut);
  
    if (!date || !timeIn || !timeOut) {
      console.log("⚠️ Data tidak lengkap, validasi gagal!");
      Alert.alert("Peringatan", "Harap lengkapi semua data!");
      return;
    }
  
    console.log("✅ Lolos Validasi Awal");
  
    try {
      console.log("⏳ Memformat tanggal dan waktu...");
  
      // Format tanggal ke YYYY-MM-DD tanpa moment.js
      const selectedDate = new Date(date);
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Ambil hanya YYYY-MM-DD
  
      // Format jam masuk & keluar ke HH:mm:ss (pastikan sesuai)
      const formattedTimeIn = timeIn.length === 8 ? timeIn : `${timeIn}:00`;
      const formattedTimeOut = timeOut.length === 8 ? timeOut : `${timeOut}:00`;
  
      console.log("📆 Formatted Tanggal:", formattedDate);
      console.log("⏱️ Formatted Jam Masuk:", formattedTimeIn);
      console.log("⏳ Formatted Jam Keluar:", formattedTimeOut);
  
      if (!formattedDate || !formattedTimeIn || !formattedTimeOut) {
        console.log("❌ Gagal memformat tanggal atau waktu!");
        Alert.alert("Kesalahan", "Format tanggal atau waktu salah!");
        return;
      }
  
      if (formattedTimeOut <= formattedTimeIn) {
        console.log("⚠️ Jam Keluar harus lebih besar dari Jam Masuk!");
        Alert.alert("Peringatan", "Jam Keluar harus setelah Jam Masuk!");
        return;
      }
  
      console.log("✅ Melewati validasi jam_keluar");
  
      const formData = new FormData();
      formData.append("tanggal", formattedDate);
      formData.append("jam_masuk", formattedTimeIn);
      formData.append("jam_keluar", formattedTimeOut);
  
      console.log("✅ FormData dibuat");
      
      if (file) {
        console.log("📂 File sebelum ditambahkan ke FormData:", file);
      
        if (!file.name || !file.uri || !file.type) {
          console.log("❌ File tidak valid! Pastikan file diambil dengan benar.");
      
          // Log ulang untuk debugging
          console.log("🔍 Debugging File:");
          console.log("📛 file:", file);
          console.log("📛 file.name:", file.name || "⚠️ Tidak ada");
          console.log("📛 file.uri:", file.uri || "⚠️ Tidak ada");
          console.log("📛 file.type:", file.type || "⚠️ Tidak ada");
      
          Alert.alert("Kesalahan", "File tidak valid! Silakan pilih ulang.");
          return;
        }
      
        formData.append("file", {
          name: file.name,
          uri: file.uri,
          type: file.type,
        });
      }
      
        
      
  
      console.log("📤 Data yang dikirim ke server:", {
        tanggal: formattedDate,
        jam_masuk: formattedTimeIn,
        jam_keluar: formattedTimeOut,
        file: file ? file.name : "Tidak ada file",
      });
  
      console.log("🔄 Mengirim data ke server...");
      const response = await apiClient.post("/perubahan_absensi/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("✅ Response dari server:", response.data);
      Alert.alert("Sukses", response.data.message);
    } catch (error) {
      console.error("❌ Error submitting data:", error);
  
      if (error.response) {
        console.log("🛑 Detail Error:", error.response.data);
        Alert.alert("Terjadi Kesalahan", error.response.data.message || "Gagal mengirim data");
      } else if (error.request) {
        console.log("⚠️ Tidak ada response dari server.");
        Alert.alert("Kesalahan", "Tidak ada respon dari server. Periksa koneksi internet Anda.");
      } else {
        console.log("❓ Error lainnya:", error.message);
        Alert.alert("Kesalahan", "Terjadi kesalahan yang tidak diketahui.");
      }
    }
  };
  

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
  
      console.log("📂 File yang dipilih:", result);
  
      if (!result || !result.name || !result.uri || !result.type) {
        console.log("⚠️ File yang dipilih tidak valid!");
        Alert.alert("Kesalahan", "File tidak valid! Silakan pilih ulang.");
        return;
      }
  
      setFile(result); // Simpan seluruh objek, bukan hanya namanya
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("ℹ️ Pemilihan file dibatalkan oleh pengguna.");
        Alert.alert("Info", "Pemilihan file dibatalkan");
      } else {
        console.error("❌ Error saat memilih file:", err);
        Alert.alert("Kesalahan", "Terjadi kesalahan saat memilih file.");
      }
    }
  };
  

  const formatTime = (pickedDuration) => {
    const { hours, minutes, seconds } = pickedDuration;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleConfirm = (time) => {
    const formattedTime = formatTime(time);
    if (pickerMode === "in") {
      setTimeIn(formattedTime);
    } else {
      setTimeOut(formattedTime);
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Absen Presensi" />  

      <Text style={[GlobalStyle.SemiBold, styles.label]}>Tanggal</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
        <Text style={[GlobalStyle.Regular, styles.inputText]}>{date || "Pilih Tanggal 📅"}</Text>
      </TouchableOpacity>

      <Modal visible={showCalendar} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Calendar
            onDayPress={(day) => {
              setDate(day.dateString);
              setShowCalendar(false);
            }}
          />
        </View>
      </Modal>

      <Text style={[GlobalStyle.SemiBold, styles.label]}>Jam Masuk</Text>
      <TouchableOpacity style={styles.input} onPress={() => showTimePicker("in")}>
        <Text style={[GlobalStyle.Regular, styles.inputText]}>{timeIn || "Pilih Jam Masuk ⏰"}</Text>
      </TouchableOpacity>

      <Text style={[GlobalStyle.SemiBold, styles.label]}>Jam Keluar</Text>
      <TouchableOpacity style={styles.input} onPress={() => showTimePicker("out")}>
        <Text style={[GlobalStyle.Regular, styles.inputText]}>{timeOut || "Pilih Jam Keluar ⏰"}</Text>
      </TouchableOpacity>

      <TimerPickerModal
        visible={showPicker}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
      />

      <Text style={[GlobalStyle.SemiBold, styles.label]}>File</Text>
      <TouchableOpacity style={styles.fileInput} onPress={pickDocument}>
        <Text style={[GlobalStyle.Regular, styles.inputText]}>{file?.name || "Pilih File 📁"}</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>SIMPAN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>BATAL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  fileInput: {
    borderWidth: 1,
    borderColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: "#e3f2fd",
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default AbsenPresensi;
