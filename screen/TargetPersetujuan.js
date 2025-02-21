import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card, Button} from 'react-native-paper';
import axios from 'axios';
import useApiClient from '../src/api/apiClient';

// Konfigurasi base URL untuk axios
const api = axios.create({
  baseURL: 'https://your-api-url', // Ganti dengan base URL API Anda
  timeout: 10000, // Timeout 10 detik
  headers: {
    'Content-Type': 'application/json',
    // Tambahkan header lain jika diperlukan
    // 'Authorization': 'Bearer your-token'
  },
});

const PerformanceBreakdown = ({onBack, uuid}) => {
  const [kinerja, setKinerja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useApiClient();

  const fetchKinerjaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/kinerja/${uuid}`);
      setKinerja(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Terjadi kesalahan saat mengambil data',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKinerjaData();
  }, [uuid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button mode="contained" onPress={fetchKinerjaData}>
          Coba Lagi
        </Button>
      </View>
    );
  }

  if (!kinerja) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Performance Breakdown"
          left={() => (
            <TouchableOpacity onPress={onBack}>
              <Icon name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <DetailRow
            label="Sub Unsur"
            value={kinerja.uraian?.sub_unsur?.nm_sub_unsur}
          />
          <DetailRow
            label="Kegiatan Tugas Jabatan"
            value={kinerja.uraian?.nm_uraian}
          />
          <DetailRow
            label="Angka Kredit"
            value={kinerja.uraian?.angka_kredit}
          />
          <DetailRow label="Kuantitas" value={kinerja.kt_satuan} />
          <DetailRow label="Kualitas" value={kinerja.kl_persen} />
          <DetailRow label="Waktu (Bulan)" value={kinerja.waktu_bulan} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Total Kuantitas</Text>
          <TextInput
            style={styles.input}
            value={kinerja.total_target?.toString()}
            editable={false}
          />
          <Button mode="contained" disabled={true} style={styles.button}>
            SIMPAN
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" disabled={true} style={styles.autoButton}>
            SET OTOMATIS
          </Button>
          <View style={styles.targetGrid}>
            {kinerja.target?.map((target, index) => (
              <View key={index} style={styles.targetItem}>
                <Text style={styles.targetLabel}>{target.bulan}:</Text>
                <TextInput
                  style={styles.targetInput}
                  value={target.kuantitas?.toString()}
                  editable={false}
                />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const DetailRow = ({label, value}) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
  },
  autoButton: {
    backgroundColor: '#28a745',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  targetItem: {
    width: '48%',
    marginBottom: 10,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  targetInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
});

export default PerformanceBreakdown;
