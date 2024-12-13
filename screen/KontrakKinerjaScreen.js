import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>NAMA</Text>
        <Text style={styles.infoValue}>: Capt. SIDROTUL MUNTAHA, M.Si.,M.Mar</Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>NIP</Text>
        <Text style={styles.infoValue}>: 19670712 199808 1 001</Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>JABATAN</Text>
        <Text style={styles.infoValue}>: Direktur</Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>UNIT KERJA</Text>
        <Text style={styles.infoValue}>: Politeknik Pelayaran Barombong</Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>PERIODE</Text>
        <Text style={styles.infoValue}>: 02 Januari 2024 s/d 31 Desember 2024</Text>
      </View>
    </View>
  );
};

const KontrakKinerjaScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchKinerjaData = async () => {
    try {
      const response = await fetch('http://192.168.2.135:8000/api/v1/user/kinerja/list/index', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjIuMTM1OjgwMDBcL2FwaVwvdjFcL2F1dGhcL3JlZnJlc2giLCJpYXQiOjE3MzM4ODkzODEsImV4cCI6MTczMzg5NTQ0NSwibmJmIjoxNzMzODkxODQ1LCJqdGkiOiJKS0JvSGlmYnU5OTZHbTIxIiwic3ViIjoyLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ucvZE8r_R83fKW7YmgnGPzsSOVVMN95vE3LB8dia4MQ`

      }
  });
  setData(response.data.data);  // Assuming response.data.data contains the paginated data
  setTotalPages(response.data.total_pages); // Assuming the API returns total pages
} catch (error) {
  Alert.alert('Error', 'Gagal mengambil data.');
} finally {
  setLoading(false);
}
  };

  useEffect(() => {
    fetchKinerjaData();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Nomor:</Text>
        <Text style={styles.cardValue}>{item.id}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Indikator:</Text>
        <Text style={styles.cardValue}>{item.indikator}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Biaya:</Text>
        <Text style={styles.cardValue}>{item.biaya}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>AK:</Text>
        <Text style={styles.cardValue}>{item.ak}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Kuantitas:</Text>
        <Text style={styles.cardValue}>{item.kuantitas}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Kualitas:</Text>
        <Text style={styles.cardValue}>{item.kualitas}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Waktu:</Text>
        <Text style={styles.cardValue}>{item.waktu}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>WPT:</Text>
        <Text style={styles.cardValue}>{item.wpt}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Bobot:</Text>
        <Text style={styles.cardValue}>{item.bobot}</Text>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Menjamin id sebagai string untuk keyExtractor
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  infoColumn: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
    width: '30%',
  },
  infoValue: {
    color: '#555',
    width: '70%',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  cardValue: {
    color: '#333',
  },
});

export default KontrakKinerjaScreen;
