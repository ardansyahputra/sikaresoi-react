import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Picker,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import RNFS from "react-native-fs";
import { PermissionsAndroid, Platform } from "react-native";

const LaporanKontrakKerja = () => {
  const [jabatanAktif, setJabatanAktif] = useState(false);
  const [jabatan, setJabatan] = useState({});
  const [tahunId, setTahunId] = useState("");
  const [listTahun, setListTahun] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAktif = async () => {
    try {
      const response = await axios.post("/user/jabatan/aktif");
      setJabatan(response.data.data);
      setJabatanAktif(true);
    } catch (error) {
      Alert.alert("Error", "Silakan pilih jabatan terlebih dahulu.");
      setJabatanAktif(false);
    }
  };

  const getTahun = async () => {
    try {
      const response = await axios.get("/tahun/show");
      setListTahun(response.data.data);
    } catch (error) {
      console.error("Error fetching tahun list:", error);
    }
  };

  const downloadPDF = async () => {
    if (!tahunId) {
      Alert.alert("Error", "Silakan pilih tahun terlebih dahulu.");
      return;
    }

    const downloadUrl = `/report/kontrak_kinerja/${jabatan.uuid}?type=stream&keuangan=0&tahun_id=${tahunId}`;
    const fileName = `Kontrak_Kinerja_${tahunId}.pdf`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      setLoading(true);

      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Storage permission is required.");
          setLoading(false);
          return;
        }
      }

      const response = await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
      }).promise;

      setLoading(false);

      if (response.statusCode === 200) {
        Alert.alert("Download Successful", `File saved to ${filePath}`);
      } else {
        Alert.alert("Download Failed", "Unable to download the file.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error downloading PDF:", error);
      Alert.alert("Error", "Something went wrong while downloading the file.");
    }
  };

  useEffect(() => {
    getTahun();
    getAktif();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>
          Pilih Tahun <Text style={styles.required}>*</Text>:
        </Text>
        <Picker
          selectedValue={tahunId}
          onValueChange={(itemValue) => setTahunId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- PILIH --" value="" />
          {listTahun.map((tahun) => (
            <Picker.Item key={tahun.id} label={tahun.tahun} value={tahun.id} />
          ))}
        </Picker>
      </View>

      {tahunId && jabatanAktif && (
        <View style={styles.buttonContainer}>
          <Button
            title="Download PDF"
            onPress={downloadPDF}
            disabled={loading}
          />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default LaporanKontrakKerja;
