import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const Table = ({ navigation }) => {
  const [columnWidths, setColumnWidths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const data = [
    {
      'no': 1,
      'Jenis Teguran': 'Tidak apel',
      Potongan: '1%',
      Tanggal: '2022-09-13',
      Dibaca: 'Dibaca',
      user: 'YUDI SATRIA, M.T, M.Mar.E',
      Aksi: 'Baca',
    },
    {
      'no': 2,
      'Jenis Teguran': 'Terlambat masuk kerja',
      Potongan: '2%',
      Tanggal: '2022-09-14',
      Dibaca: 'Belum',
      user: 'ANANDA PUTRA, S.T',
      Aksi: 'Baca',
    },
  ];

  const headers = ['no', 'Jenis Teguran', 'Potongan', 'Tanggal', 'Dibaca', 'user', 'Aksi'];

  const calculateWidth = (index, event) => {
    const width = event.nativeEvent.layout.width;
    setColumnWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = Math.max(newWidths[index] || 0, width);
      return newWidths;
    });
  };

  const handleBacaPress = (rowData) => {
    // Logika ketika tombol "Baca" ditekan
    console.log('Baca tombol ditekan untuk:', rowData);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.smallBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.smallBackButtonText}>⬅</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Teguran</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Cari..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.headerRow]}>
            {headers.map((header, index) => (
              <Text
                key={index}
                style={[styles.cell, styles.headerCell, { minWidth: columnWidths[index] || 100 }]}
                onLayout={(event) => calculateWidth(index, event)}
              >
                {header}
              </Text>
            ))}
          </View>
          {filteredData.map((item, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.row,
                rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              {headers.map((header, colIndex) => (
                header === 'Aksi' ? (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.bacaButton}
                    onPress={() => handleBacaPress(item)}
                  >
                    <Text style={styles.bacaButtonText}>{item[header]}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text
                    key={colIndex}
                    style={[styles.cell, { minWidth: columnWidths[colIndex] || 100 }]}
                    onLayout={(event) => calculateWidth(colIndex, event)}
                  >
                    {item[header]}
                  </Text>
                )
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 12,
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f2f2f2',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  smallBackButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000',
  },
  smallBackButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 10,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
 bacaButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 4, // Mengurangi padding vertikal
    paddingHorizontal: 8, // Mengurangi padding horizontal
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80, // Lebar minimum tombol
    marginHorizontal: 4, // Menambahkan jarak horizontal
  },
  bacaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Table;
