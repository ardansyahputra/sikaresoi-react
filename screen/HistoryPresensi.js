import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const HistoryPresensi = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.60.176:8000/api/v1/user/absensi/index',
        { page },
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE3Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM3NTk3ODgyLCJleHAiOjE3Mzc2MDE2NTYsIm5iZiI6MTczNzU5ODA1NiwianRpIjoiWlpaTTRhZXpudHk1QzVwdCIsInN1YiI6MiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.pD9h0kXpFYPI7Mskz7BK5eLNyZyYEIZohnGBALDOkoc',
          },
        }
      );

      console.log('API Response:', response.data); // Debugging log


      const apiData = response.data.data.map((item) => ({
        id: item.id,
        tanggal: item.tanggal || 'N/A',
        jam_masuk: item.jam_masuk || 'N/A',
        jam_keluar: item.jam_keluar || 'N/A',
        type: item.type?.replace(/<[^>]+>/g, '') || 'N/A', // Remove HTML tags
        pemotongan: item.pemotongan || 'N/A',
      }));

      setData(apiData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please check your network or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    [item.tanggal, item.type].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('./assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.historyHeader}>
          <Text style={styles.title}>History Presensi</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.fetchButton} onPress={() => fetchData()}>
              <Icon name="cloud-download" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Fetch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={() => setSearch('')}>
              <Icon name="refresh" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          <Icon name="search" size={20} color="#888" />
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Tanggal</Text>
            <Text style={styles.tableHeaderText}>Jam Masuk</Text>
            <Text style={styles.tableHeaderText}>Jam Keluar</Text>
            <Text style={styles.tableHeaderText}>Type</Text>
            <Text style={styles.tableHeaderText}>Pemotongan</Text>
          </View>
          {isLoading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No result found</Text>
              }
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.tanggal}</Text>
                  <Text style={styles.tableCell}>{item.jam_masuk}</Text>
                  <Text style={styles.tableCell}>{item.jam_keluar}</Text>
                  <Text style={styles.tableCell}>{item.type}</Text>
                  <Text style={styles.tableCell}>{item.pemotongan}</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>
            Showing {filteredData.length} of {data.length} entries
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerImage: {
    width: '45%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
    marginRight: 160,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 30,
  },
  fetchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6f42c1',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    color: '#333',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tableCell: {
    flex: 1,
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    paddingVertical: 16,
  },
  paginationContainer: {
    marginTop: 16,
  },
  paginationText: {
    textAlign: 'center',
    color: '#888',
  },
});

export default HistoryPresensi;
