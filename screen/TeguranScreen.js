import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function TeguranScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Configuration
  const API_BASE_URL = 'http://192.168.2.155:8000/api/v1/teguran/index_user'; // Ensure this URL is correct
  const AUTH_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjIuMTU1OjgwMDBcL2FwaVwvdjFcL2F1dGhcL3JlZnJlc2giLCJpYXQiOjE3MzQ0MDQ2MDgsImV4cCI6MTczNDQxMjcwMSwibmJmIjoxNzM0NDA5MTAxLCJqdGkiOiJQUzNuNndyZnM5NW93Zk1tIiwic3ViIjo5LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.i2OoprpmzhBy-FgQDlKvVRNiHWbVzQmwXqEdkRNJpiY';

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Make sure to pass the AUTH_TOKEN in the headers
      const response = await axios.post(API_BASE_URL, {}, {
        headers: { Authorization: AUTH_TOKEN },
        timeout: 10000,
      });

      // Data validation and transformation
      if (response.data?.data && Array.isArray(response.data.data)) {
        const processedData = response.data.data.map((item, index) => ({
          no: index + 1,
          id: item.id || Math.random().toString(),
          jenisTeguran: item.jenis || 'Tidak Diketahui',
          // Display potongan as a number
          potongan: item.potongan 
            ? Number(item.potongan).toLocaleString('id-ID')  // Format as number with thousands separator
            : '-',
          tanggalPelanggaran: item.tgl_pelanggaran 
            ? new Date(item.tgl_pelanggaran).toLocaleDateString('id-ID') 
            : 'Tanggal Tidak Valid',
          user: item.user?.name || 'Pengguna Tidak Dikenal',
          action: item.action 
            ? item.action.replace(/<.*?>/g, '').trim() 
            : 'Tidak Ada Aksi',
          dibaca: item.dibaca ? 'Sudah' : 'Belum',
        }));

        setData(processedData);
      } else {
        throw new Error('Format data tidak valid');
      }
    } catch (error) {
      const errorMessage = error.response 
        ? error.response.data?.message || 'Gagal mengambil data' 
        : error.message || 'Kesalahan Jaringan';

      setError(errorMessage);
      Alert.alert('Kesalahan', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Table Container */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.noCell]}>No</Text>
          <Text style={[styles.headerCell, styles.jenisTeguranCell]}>Jenis Teguran</Text>
          <Text style={[styles.headerCell, styles.potonganCell]}>Potongan</Text>
          <Text style={[styles.headerCell, styles.tanggalCell]}>Tgl Pelanggaran</Text>
          <Text style={[styles.headerCell, styles.userCell]}>User</Text>
          <Text style={[styles.headerCell, styles.actionCell]}>Aksi</Text>
          <Text style={[styles.headerCell, styles.dibacaCell]}>Dibaca</Text>
        </View>

        {/* Table Content */}
        {data.length === 0 ? (
          <Text style={styles.noDataText}>Tidak ada data yang ditemukan</Text>
        ) : (
          <View>
            {data.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.cell, styles.noCell]}>{item.no}</Text>
                <Text style={[styles.cell, styles.jenisTeguranCell]} numberOfLines={1}>{item.jenisTeguran}</Text>
                <Text style={[styles.cell, styles.potonganCell]}>{item.potongan}</Text>
                <Text style={[styles.cell, styles.tanggalCell]}>{item.tanggalPelanggaran}</Text>
                <Text style={[styles.cell, styles.userCell]} numberOfLines={1}>{item.user}</Text>
                <Text style={[styles.cell, styles.actionCell]} numberOfLines={1}>{item.action}</Text>
                <Text style={[styles.cell, styles.dibacaCell]}>{item.dibaca}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6fa',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 11,
  },
  noCell: { 
    flex: 0.5,
    backgroundColor: '#f8f9fa',
    color: '#6c757d', // You can remove this line if you don't want any color
  },
  jenisTeguranCell: { 
    // No color here anymore
  },
  potonganCell: { 
    // No color here anymore
  },
  tanggalCell: { 
    // No color here anymore
  },
  userCell: { 
    // No color here anymore
  },
  actionCell: { 
    // No color here anymore
  },
  dibacaCell: { 
    // No color here anymore
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#6c757d',
    padding: 20,
  },
});
