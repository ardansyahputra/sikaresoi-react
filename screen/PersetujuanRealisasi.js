import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const PersetujuanRealisasi = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('https://your-api-url/api/realisasi/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
          <Text style={styles.statValue}>{stats?.targetRealisasi || 0}</Text>
          <Text style={styles.statLabel}>Realisasi Target</Text>
        </View>
        <View style={[styles.statBox, styles.boxBlue]}>
          <Icon name="water" size={30} color="#4FC3F7" />
          <Text style={styles.statValue}>{stats?.dokumenRealisasi || 0}</Text>
          <Text style={styles.statLabel}>Realisasi Dokumen</Text>
        </View>
        <View style={[styles.statBox, styles.boxPink]}>
          <Icon name="walk" size={30} color="#F06292" />
          <Text style={styles.statValue}>{stats?.langkahVerifikasi || 0}</Text>
          <Text style={styles.statLabel}>Langkah Verifikasi</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

export default PersetujuanRealisasi;
