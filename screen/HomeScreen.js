import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Gusti from 'react-native-vector-icons/Ionicons';
import Ardhan from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.date}>Selasa, 10 Desember 2024 10:09:04</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>BUDIAWAN, S.Si.T, MT</Text>
        </View>
      </View>

      {/* Dashboard Navigation */}
      <View style={styles.dashboardNav}>
        <Gusti name="airplane" size={30} color="#000" />
        <Ardhan name="heart" size={30} color="#ff0000" />
        <TouchableOpacity style={[styles.card, { backgroundColor: '#007BFF' }]}>
          <Text style={styles.cardTitle}>Presensi</Text>
          <Text style={styles.cardSubtitle}>Data Presensi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#FF4757' }]}>
          <Text style={styles.cardTitle}>Teguran</Text>
          <Text style={styles.cardSubtitle}>Data Teguran</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFA502' }]}>
          <Text style={styles.cardTitle}>1 Kontrak Bawahan</Text>
          <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#7D5FFF' }]}>
          <Text style={styles.cardTitle}>0 Realisasi Bawahan</Text>
          <Text style={styles.cardSubtitle}>Belum Disetujui</Text>
        </TouchableOpacity>
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Remunerasi 2024</Text>
        <BarChart
          data={{
            labels: ['Gaji Pokok', 'Tunjangan', 'Bonus', 'Potongan'],
            datasets: [
              {
                data: [45000000, 20000000, 15000000, 5000000],
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              },
            ],
          }}
          width={300} // Width of the chart
          height={220} // Height of the chart
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0, // No decimal places for financial data
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForLabels: {
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Display absolute values
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: '#555',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dashboardNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  chartSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center', // Centering the chart
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});
