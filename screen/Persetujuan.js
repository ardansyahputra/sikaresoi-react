import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Persetujuan = ({ navigation }) => {
  const data = [
    {
      id: 1,
      nama: 'Hastuty Bachtiar',
      jabatan: 'Penyelenggara Program Pendidikan',
      periode: '03 Januari 2022 s/d 30 Desember 2022',
      status: 'Disetujui',
      statusRevisi: 'Tidak Ada Revisi',
    },
    {
      id: 2,
      nama: 'Ardiansyah, S.A.P., M.Mar.E',
      jabatan: 'Penyelenggara Program Pendidikan',
      periode: '01 Januari 2022 s/d 31 Desember 2022',
      status: 'Disetujui',
      statusRevisi: 'Tidak Ada Revisi',
    },
    {
      id: 3,
      nama: 'Khafifah, S.Pd.I.,M.Pd',
      jabatan: 'Analis Program Diklat',
      periode: '01 Januari 2022 s/d 31 Desember 2022',
      status: 'Disetujui',
      statusRevisi: 'Tidak Ada Revisi',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Persetujuan Kontrak Kinerja</Text>
      </View>

      {/* List Section */}
      {data.map((item) => (
        <View key={item.id} style={styles.cardContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nama:</Text>
            <Text style={styles.detailValue}>{item.nama}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jabatan:</Text>
            <Text style={styles.detailValue}>{item.jabatan}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Periode:</Text>
            <Text style={styles.detailValue}>{item.periode}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.statusApproved}>{item.status}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status Revisi:</Text>
            <Text style={styles.statusRevisi}>{item.statusRevisi}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton,]}
             onPress={() => navigation.navigate('DataTable')}
           >
            <Icon name="eye" size={20} color="#fff" />
            <Text style={styles.actionText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  statusApproved: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusRevisi: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default Persetujuan;
