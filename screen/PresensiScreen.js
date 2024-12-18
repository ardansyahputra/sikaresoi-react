import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ardan from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';  // <-- Import useNavigation

const PresensiScreen = () => {
  const [clock, setClock] = useState('00:00:00');
  const [attendanceData, setAttendanceData] = useState([
    { id: '1', date: '22 November 2024', masuk: '07:30:28', keluar: '19:48:25', type: 'WFO', pemotongan: '0,00 %' },
    { id: '2', date: '21 November 2024', masuk: '07:54:47', keluar: '19:18:38', type: 'WFO', pemotongan: '0,00 %' },
    { id: '3', date: '20 November 2024', masuk: '07:24:16', keluar: '21:25:20', type: 'WFO', pemotongan: '0,00 %' },
    { id: '4', date: '19 November 2024', masuk: '07:18:20', keluar: '20:43:12', type: 'WFO', pemotongan: '0,00 %' },
    { id: '5', date: '18 November 2024', masuk: '07:30:14', keluar: '19:05:32', type: 'WFO', pemotongan: '0,00 %' },
  ]);

  // Digital clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setClock(timeString);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigation = useNavigation();  // <-- Use the hook to access navigation

  // Render item for the table
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { width: 150 }]}>{item.date}</Text>
      <Text style={[styles.tableCell, { width: 150 }]}>{item.masuk}</Text>
      <Text style={[styles.tableCell, { width: 150 }]}>{item.keluar}</Text>
      <Text style={[styles.tableCell, { width: 150 }]}>{item.type}</Text>
      <Text style={[styles.tableCell, { width: 150 }]}>{item.pemotongan}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}> {/* Keep ScrollView here */}
      {/* Clock Section */}
      <View style={styles.clockContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Ardan
          name="book-edit"
          size={24}
          color="#FFFFFF"
          style={{ marginHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        />
        <Text style={styles.clockTitle}>Presensi</Text>
        <View style={styles.clockCircle}>
          <Text style={styles.clockText}>{clock}</Text>
        </View>
      </View>

      {/* Attendance History */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>History Presensi</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#7B47FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
              <FontAwesome name="repeat" size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={styles.actionText}>Fetch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF3B3B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
              <FontAwesome name="repeat" size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={styles.actionText}>Perubahan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View>
            <View style={styles.tableRowHeader}>
              <Text style={[styles.tableHeaderCell, { width: 150 }]}>Tanggal</Text>
              <Text style={[styles.tableHeaderCell, { width: 150 }]}>Jam Masuk</Text>
              <Text style={[styles.tableHeaderCell, { width: 150 }]}>Jam Keluar</Text>
              <Text style={[styles.tableHeaderCell, { width: 150 }]}>Type</Text>
              <Text style={[styles.tableHeaderCell, { width: 150 }]}>Pemotongan</Text>
            </View>
            {/* Enable vertical scroll for table rows */}
            <FlatList
              data={attendanceData}
              style={{ height: 500, width: "100%", flex: 1, }}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={true} // Enable vertical scroll for FlatList
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F4F6F9', padding: 20 },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#3DA9FC',
    borderRadius: 10,
    padding: 20,
  },
  backButton: {
    marginRight: 320,
  },
  clockTitle: { fontSize: 18, color: '#FFF', marginBottom: 10, fontWeight: 'bold' },
  clockCircle: {
    borderWidth: 10,
    borderColor: 'red',
    borderRadius: 150,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  clockText: { fontSize: 36, fontWeight: 'bold', color: '#333' },
  tableContainer: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, elevation: 3 },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 80 },
  actionsContainer: { flexDirection: 'row' },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    marginTop: 30,
  },
  actionText: { color: '#FFF', fontWeight: 'bold' },
  table: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#3DA9FC',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    maxHeight: 400,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#DDD' },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    color: '#333',
  },
});

export default PresensiScreen;
