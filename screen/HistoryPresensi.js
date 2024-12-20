import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HistoryPresensi = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([
    { id: '1', date: '2024-12-20', checkIn: '08:00', checkOut: '17:00', type: 'Normal', deduction: '0%' },
    { id: '2', date: '2024-12-19', checkIn: '08:10', checkOut: '16:50', type: 'Late', deduction: '10%' },
  ]);

  const handleFetch = () => {
    alert('Data fetched successfully!');
  };

  const handleReset = () => {
    alert('Reset changes!');
  };

  const filteredData = data.filter(
    (item) =>
      item.date.includes(search) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>History Presensi</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.fetchButton} onPress={handleFetch}>
            <Icon name="cloud-download" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Fetch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Icon name="refresh" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Perubahan</Text>
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
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No result found</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.date}</Text>
              <Text style={styles.tableCell}>{item.checkIn}</Text>
              <Text style={styles.tableCell}>{item.checkOut}</Text>
              <Text style={styles.tableCell}>{item.type}</Text>
              <Text style={styles.tableCell}>{item.deduction}</Text>
            </View>
          )}
        />
      </View>

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          Showing {filteredData.length} of {data.length} entries
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
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
