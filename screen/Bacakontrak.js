import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const PerformanceTable = ({ data = [], onSaveKinerja, onDelete }) => {
  const [listKinerja, setListKinerja] = useState(data);

  const renderPerformanceCard = (item, index) => (
    <Card key={index} style={styles.performanceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.angka}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.uraian?.nm_uraian}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Biaya:</Text>
          <View style={styles.currencyContainer}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <Text style={styles.currencyValue}>
              {item.uraian?.biaya?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Angka Kredit:</Text>
          <Text style={styles.value}>{item.uraian?.angka_kredit}</Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kuantitas</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.kuantitas?.toString()}
                onChangeText={(value) => {
                  const updatedItem = { ...item, kuantitas: value };
                  onSaveKinerja(updatedItem);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>{item.uraian?.satuan}</Text>
            </View>
            {item.kuantitas <= 0 && (
              <Text style={styles.errorText}>Tidak boleh 0</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kualitas</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.kualitas?.toString()}
                onChangeText={(value) => {
                  const updatedItem = { ...item, kualitas: value };
                  onSaveKinerja(updatedItem);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
            {item.kualitas <= 0 && (
              <Text style={styles.errorText}>Tidak boleh 0</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Waktu</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.waktu?.toString()}
                onChangeText={(value) => {
                  const updatedItem = { ...item, waktu: value };
                  onSaveKinerja(updatedItem);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>BULAN</Text>
            </View>
            {item.waktu <= 0 && (
              <Text style={styles.errorText}>Tidak boleh 0</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bobot</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.bobot?.toString()}
                onChangeText={(value) => {
                  const updatedItem = { ...item, bobot: value };
                  onSaveKinerja(updatedItem);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>
            {item.bobot <= 0 && (
              <Text style={styles.errorText}>Tidak boleh 0</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>WPT</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={item.wpt?.toString()}
                onChangeText={(value) => {
                  const updatedItem = { ...item, wpt: value };
                  onSaveKinerja(updatedItem);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>
            {item.wpt <= 0 && (
              <Text style={styles.errorText}>Tidak boleh 0</Text>
            )}
          </View>
        </View>

        <View style={styles.statusSection}>
          {item.kuantitas <= 0 || item.kualitas <= 0 || item.waktu <= 0 || item.bobot <= 0 || item.wpt <= 0 ? (
            <View style={styles.statusBadgeDanger}>
              <Icon name="alert" size={16} color="white" />
              <Text style={styles.statusText}>LENGKAPI DATA</Text>
            </View>
          ) : item.total_target === null ? (
            <View style={styles.statusBadgeWarning}>
              <Icon name="clock-alert" size={16} color="white" />
              <Text style={styles.statusText}>BELUM BREAKDOWN</Text>
            </View>
          ) : (
            <View style={styles.statusBadgeSuccess}>
              <Icon name="check-circle" size={16} color="white" />
              <Text style={styles.statusText}>LENGKAP</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {/* Handle edit */}}
          >
            <Icon name="pencil" size={20} color="white" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {listKinerja.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Icon name="clipboard-text-off" size={48} color="#999" />
              <Text style={styles.emptyStateText}>Data Kosong!</Text>
            </View>
          </Card>
        ) : (
          listKinerja.map((item, index) => renderPerformanceCard(item, index))
        )}
      </ScrollView>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total WPT:</Text>
          <Text style={styles.summaryValue}>XX Jam (xx%)</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Angka Kredit:</Text>
          <Text style={styles.summaryValue}>XX</Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  performanceCard: {
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fe',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  numberBadge: {
    backgroundColor: '#4C6FFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontSize: 14,
    color: '#718096',
    marginRight: 4,
  },
  currencyValue: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  inputSection: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#2D3748',
  },
  inputSuffix: {
    paddingRight: 12,
    fontSize: 12,
    color: '#718096',
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 4,
  },
  statusSection: {
    marginVertical: 16,
  },
  statusBadgeDanger: {
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeWarning: {
    backgroundColor: '#D69E2E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeSuccess: {
    backgroundColor: '#38A169',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#4C6FFF',
  },
  deleteButton: {
    backgroundColor: '#E53E3E',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
});

const sampleData = [
  {
    uuid: '1',
    angka: 1,
    uraian: {
      nm_uraian: 'Meningkatkan Penjualan',
      biaya: 15000000,
      angka_kredit: 3.5,
      satuan: 'Unit',
    },
    kuantitas: 10,
    kualitas: 90,
    waktu: 6,
    bobot: 20,
    wpt: 12,
    total_target: 100,
  },
  {
    uuid: '2',
    angka: 2,
    uraian: {
      nm_uraian: 'Mengurangi Biaya Operasional',
      biaya: 7500000,
      angka_kredit: 2.5,
      satuan: 'Unit',
    },
    kuantitas: 5,
    kualitas: 80,
    waktu: 4,
    bobot: 15,
    wpt: 8,
    total_target: null,
  },
  {
    uuid: '3',
    angka: 3,
    uraian: {
      nm_uraian: 'Meningkatkan Kepuasan Pelanggan',
      biaya: 10000000,
      angka_kredit: 4.0,
      satuan: 'Unit',
    },
    kuantitas: 8,
    kualitas: 85,
    waktu: 5,
    bobot: 25,
    wpt: 10,
    total_target: 90,
  },
];

export default function App() {
  const handleSaveKinerja = (updatedItem) => {
    console.log('Saved:', updatedItem);
  };

  const handleDeleteKinerja = (uuid) => {
    console.log('Deleted item with uuid:', uuid);
  };

  return (
    <PerformanceTable
      data={sampleData}
      onSaveKinerja={handleSaveKinerja}
      onDelete={handleDeleteKinerja}
    />
  );
}