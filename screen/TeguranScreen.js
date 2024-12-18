import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Table = () => {
  const [columnWidths, setColumnWidths] = useState([]);

  const data = [
    {
      '#': 1,
      'Jenis Teguran': 'Tidak apel',
      Potongan: '1%',
      Tanggal: '2022-09-13',
      Dibaca: 'Dibaca',
      user: 'YUDI SATRIA, M.T, M.Mar.E',
      Aksi: 'Baca',
    },
    {
      '#': 2,
      'Jenis Teguran': 'Terlambat masuk kerja',
      Potongan: '2%',
      Tanggal: '2022-09-14',
      Dibaca: 'Belum',
      user: 'ANANDA PUTRA, S.T',
      Aksi: 'Baca',
    },
  ];

  const headers = ['#', 'Jenis Teguran', 'Potongan', 'Tanggal', 'Dibaca', 'user', 'Aksi'];

  const calculateWidth = (index, event) => {
    const width = event.nativeEvent.layout.width;
    setColumnWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = Math.max(newWidths[index] || 0, width);
      return newWidths;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          {/* Header Row */}
          <View style={[styles.row, styles.headerRow]}>
            {headers.map((header, index) => (
              <Text
                key={index}
                style={[styles.cell, styles.headerCell, { minWidth: columnWidths[index] || 50 }]}
                onLayout={(event) => calculateWidth(index, event)}
              >
                {header}
              </Text>
            ))}
          </View>
          {/* Data Rows */}
          {data.map((item, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.row,
                rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow, // Alternating row colors
              ]}
            >
              {headers.map((header, colIndex) => (
                <Text
                  key={colIndex}
                  style={[styles.cell, { minWidth: columnWidths[colIndex] || 50 }]}
                  onLayout={(event) => calculateWidth(colIndex, event)}
                >
                  {item[header]}
                </Text>
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
    backgroundColor: '#007BFF', // Blue header
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 10,
  },
  evenRow: {
    backgroundColor: '#ffffff', // White for even rows
  },
  oddRow: {
    backgroundColor: '#f2f2f2', // Light gray for odd rows
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff', // White text in header
  },
});

export default Table;
