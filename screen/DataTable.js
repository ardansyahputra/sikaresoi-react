import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const DataTable = ({ navigation }) => {
  const [activeRow, setActiveRow] = useState(null);

  const data = [
    {
      id: 1,
      indikator: 'Mengolah',
      biaya: 'Rp. 0',
      ak: '0',
      kuantitas: '1,0',
      kualitas: '100,00',
      waktu: '12 BULAN',
      wpt: '424',
      bobot: '37',
      status: 'Disetujui',
    },
    {
      id: 2,
      indikator: 'Menyusur',
      biaya: 'Rp. 0',
      ak: '0',
      kuantitas: '1,0',
      kualitas: '100,00',
      waktu: '12 BULAN',
      wpt: '212',
      bobot: '18',
      status: 'Disetujui',
    },
    {
      id: 3,
      indikator: 'Melakukan',
      biaya: 'Rp. 0',
      ak: '0',
      kuantitas: '1,0',
      kualitas: '100,00',
      waktu: '12 BULAN',
      wpt: '110',
      bobot: '10',
      status: 'Disetujui',
    },
  ];

  const toggleDetails = (id) => {
    setActiveRow(activeRow === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>No</Text>
        <Text style={styles.headerCell}>Indikator</Text>
        <Text style={styles.headerCell}>Biaya</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>

      {/* Data Rows */}
      {data.map((item, index) => (
        <View key={item.id}>
          <View style={styles.dataRow}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.indikator}</Text>
            <Text style={styles.cell}>{item.biaya}</Text>
            <TouchableOpacity
              onPress={() => toggleDetails(item.id)}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>
                {activeRow === item.id ? 'Tutup Detail' : 'Lihat Detail'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Detail Row */}
          {activeRow === item.id && (
            <View style={styles.detailContainer}>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>AK: </Text>
                {item.ak}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Kuantitas: </Text>
                {item.kuantitas}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Kualitas: </Text>
                {item.kualitas}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Waktu: </Text>
                {item.waktu}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>WPT: </Text>
                {item.wpt}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Bobot: </Text>
                {item.bobot}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.boldText}>Status: </Text>
                {item.status}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 5,
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
  },
  detailContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  detailText: {
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default DataTable;
