import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const KontrakKerja = () => {
  const [jabatanAktif, setJabatanAktif] = useState(false);
  const [jabatan, setJabatan] = useState(null);
  const [url, setUrl] = useState("");
  const [tahunId, setTahunId] = useState("");
  const [listTahun, setListTahun] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = 'http://192.168.60.230:8000/api/v1';
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NjExMzYwLCJleHAiOjE3MzU2MjE2OTQsIm5iZiI6MTczNTYxODA5NCwianRpIjoiV0RxeGQ0M0o4WVcxMFNrbyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vYyg-5ZbHk1iqgyijxRcSbklvpBeZUJt45KUGAIDyhY';

  const getAktif = async () => {
    try {
      const response = await axios.post(`${baseURL}/user/jabatan/aktif`, 
        {},
        { headers: { Authorization: token } }
      );
      setJabatan(response.data.data);
      setJabatanAktif(true);
    } catch (error) {
      Alert.alert('Error', 'Silakan pilih jabatan terlebih dahulu.', [
        { text: 'OK', onPress: () => console.log('Redirect to Jabatan screen') },
      ]);
      setJabatanAktif(false);
    }
  };

  const getTahun = async () => {
    try {
      const response = await axios.get(`${baseURL}/tahun/show`, 
        {},
        { headers: { Authorization: token } }
      );
      setListTahun(response.data.data);
    } catch (error) {
      console.error('Error fetching tahun:', error);
    }
  };

  const refresh = () => {
    if (jabatan && tahunId) {
      setUrl(`${baseURL}/report/kontrak_kinerja/${jabatan.uuid}?type=stream&keuangan=0&tahun_id=${tahunId}`,
        {},
        { headers: { Authorization: token } }
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTahun();
      await getAktif();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pilih Tahun <Text style={{ color: 'red' }}>*</Text> :</Text>
      <Picker
        selectedValue={tahunId}
        onValueChange={(value) => {
          setTahunId(value);
          refresh();
        }}
        style={styles.picker}
      >
        <Picker.Item label="-- PILIH --" value="" />
        {listTahun.map((tahun) => (
          <Picker.Item key={tahun.id} label={tahun.tahun.toString()} value={tahun.id} />
        ))}
      </Picker>

      {tahunId && jabatanAktif ? (
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          onLoad={() => console.log('WebView loaded')}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  webview: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default KontrakKerja;