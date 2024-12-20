import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PersetujuanR =  ({ navigation }) => {
  const handleCheckDetails = () => {
    alert('Detail persetujuan realisasi.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                
                  <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
        <Text style={styles.subtitle}>Persetujuan Realisasi</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, styles.boxYellow]}>
          <Icon name="flame" size={30} color="#FF6F00" />
          <Text style={styles.statValue}>2,000</Text>
          <Text style={styles.statLabel}>Realisasi Target</Text>
        </View>
        <View style={[styles.statBox, styles.boxBlue]}>
          <Icon name="water" size={30} color="#4FC3F7" />
          <Text style={styles.statValue}>10</Text>
          <Text style={styles.statLabel}>Realisasi Dokumen</Text>
        </View>
        <View style={[styles.statBox, styles.boxPink]}>
          <Icon name="walk" size={30} color="#F06292" />
          <Text style={styles.statValue}>5,000</Text>
          <Text style={styles.statLabel}>Langkah Verifikasi</Text>
        </View>
      </View>

      {/* Weekly Progress Section */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Your Weekly Progress</Text>
        <Text style={styles.progressSubtitle}>Weekly Report</Text>
        <View style={styles.progressCircle}>
          <Text style={styles.progressValue}>65%</Text>
        </View>
      </View>

      {/* Learn More Section */}
      <View style={styles.learnContainer}>
        <Text style={styles.learnTitle}>Learn About Realisasi</Text>
        <TouchableOpacity style={styles.learnButton} onPress={handleCheckDetails}>
          <Text style={styles.learnButtonText}>Check Now</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '30%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  boxYellow: {
    backgroundColor: '#FFF3E0',
  },
  boxBlue: {
    backgroundColor: '#E3F2FD',
  },
  boxPink: {
    backgroundColor: '#FCE4EC',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#BBDEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  learnContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  learnButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  learnButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersetujuanR;
