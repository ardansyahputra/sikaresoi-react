import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const DataTable2 = ({ navigation }) => {
  const [activeRow, setActiveRow] = useState(null);
  const [editableItem, setEditableItem] = useState(null);
  const [editedData, setEditedData] = useState({});

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
    setEditableItem(null);
  };

  const handleEdit = (item) => {
    setEditableItem(item.id);
    setEditedData(item);
  };

  const handleSave = () => {
    const updatedData = data.map((item) =>
      item.id === editedData.id ? editedData : item
    );

    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Success!',
      text2: 'Your data has been successfully saved.',
      visibilityTime: 3000,
    });

    setEditableItem(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.noCell]}>No</Text>
        <Text style={styles.headerCell}>Indikator</Text>
        <Text style={styles.headerCell}>Biaya</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>

      {/* Data Rows */}
      {data.map((item, index) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.dataRow}>
            <Text style={[styles.cell, styles.noCell]}>{index + 1}</Text>
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
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={20} color="white" />
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

          {/* Edit Form */}
          {editableItem === item.id && (
            <View style={styles.editForm}>
              <Text style={styles.editLabel}>Edit Fields:</Text>

              <Text style={styles.inputLabel}>AK (Angka Kredit)</Text>
              <TextInput
                style={styles.input}
                value={editedData.ak}
                onChangeText={(text) => setEditedData({ ...editedData, ak: text })}
                placeholder="Edit AK"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Kuantitas</Text>
              <TextInput
                style={styles.input}
                value={editedData.kuantitas}
                onChangeText={(text) => setEditedData({ ...editedData, kuantitas: text })}
                placeholder="Edit Kuantitas"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Kualitas (%)</Text>
              <TextInput
                style={styles.input}
                value={editedData.kualitas}
                onChangeText={(text) => setEditedData({ ...editedData, kualitas: text })}
                placeholder="Edit Kualitas"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Waktu</Text>
              <TextInput
                style={styles.input}
                value={editedData.waktu}
                onChangeText={(text) => setEditedData({ ...editedData, waktu: text })}
                placeholder="Edit Waktu"
              />
              
              <Text style={styles.inputLabel}>WPT</Text>
              <TextInput
                style={styles.input}
                value={editedData.wpt}
                onChangeText={(text) => setEditedData({ ...editedData, wpt: text })}
                placeholder="Edit WPT"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Bobot (%)</Text>
              <TextInput
                style={styles.input}
                value={editedData.bobot}
                onChangeText={(text) => setEditedData({ ...editedData, bobot: text })}
                placeholder="Edit Bobot"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Status</Text>
              <TextInput
                style={styles.input}
                value={editedData.status}
                onChangeText={(text) => setEditedData({ ...editedData, status: text })}
                placeholder="Edit Status"
              />

              <Button title="Save" onPress={handleSave} />
            </View>
          )}
        </View>
      ))}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EFEFF4',
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  noCell: {
    flex: 0.2,
    textAlign: 'left',
  },
  dataRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#007BFF',
    padding: 6,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  editButton: {
    padding: 6,
    backgroundColor: '#28a745',
    borderRadius: 4,
    marginLeft: 5,
  },
  detailContainer: {
    padding: 12,
    backgroundColor: '#F1F1F1',
  },
  detailText: {
    marginVertical: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  editForm: {
    padding: 12,
    backgroundColor: '#FFF3CD',
  },
  input: {
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default DataTable2;