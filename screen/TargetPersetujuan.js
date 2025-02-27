import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Surface, Button, ProgressBar, Divider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../src/api/apiClient';

const {width} = Dimensions.get('window');

const Kumulatif = ({navigation, route}) => {
  const {item} = route.params;
  const [kinerja, setKinerja] = useState(item);
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(false);

  const apiClient = useApiClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`user/kinerja/list/index`);
      
      if (response.data.data.length > 0) {
        const fetchedKinerja = response.data.data; // Ambil item pertama
        setKinerja({
          ...fetchedKinerja,
          target: fetchedKinerja.target || [] // Pastikan target ada
        });
      } else {
        Alert.alert('Data Kosong', 'Tidak ada data kinerja yang ditemukan.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      Alert.alert('Error', 'Gagal mengambil data.');
    } finally {
      setLoading(false);
    }
  };
  const saveTarget = async () => {
    if (errorCount) {
      Alert.alert('Error', 'Total target melebihi kuantitas yang diizinkan');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        `user/kinerja/list/target/${kinerja.id}/save`,
        kinerja.target,
      );
      Alert.alert('Success', 'Data berhasil disimpan');
      fetchData();
    } catch (err) {
      // console.error('Error saving data:', err);
      // Alert.alert('Error', 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const hitungRerata = () => {
    const hasil = kinerja.kuantitas / kinerja.waktu;
    const updatedTargets = kinerja.target.map(target => ({
      ...target,
      kuantitas: parseFloat(hasil).toFixed(2),
    }));
    setKinerja({...kinerja, target: updatedTargets});
    countTarget(updatedTargets);
  };

  const countTarget = (targets = kinerja.target) => {
    let totalTarget = 0;
    targets.forEach(target => {
      if (target.kuantitas) {
        totalTarget += parseFloat(target.kuantitas);
      }
    });

    const isExceeded = totalTarget > parseFloat(kinerja.kuantitas);
    setErrorCount(isExceeded);
    setKinerja(prev => ({...prev, total_target: totalTarget.toFixed(2)}));
  };

  const handleTargetChange = (index, value) => {
    const updatedTargets = [...kinerja.target];
    updatedTargets[index].kuantitas = value;
    setKinerja(prev => ({...prev, target: updatedTargets}));
    countTarget(updatedTargets);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const progressValue = kinerja.total_target
    ? Math.min(
        parseFloat(kinerja.total_target) / parseFloat(kinerja.kuantitas),
        1,
      )
    : 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kumulatif</Text>
      </View>

      <ScrollView style={styles.content}>
        <Surface style={styles.card}>
          <Text style={styles.sectionTitle}>Kegiatan Tugas Jabatan</Text>
          <Text style={styles.description}>{item.uraian?.nm_uraian}</Text>

          <Divider style={styles.divider} />

          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Ionicons name="star-outline" size={24} color="#6366f1" />
              <Text style={styles.metricLabel}>Angka Kredit</Text>
              <Text style={styles.metricValue}>
                {kinerja.uraian?.angka_kredit}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Ionicons name="trending-up-outline" size={24} color="#6366f1" />
              <Text style={styles.metricLabel}>Kuantitas</Text>
              <Text style={styles.metricValue}>{kinerja.kt_satuan}</Text>
            </View>
            <View style={styles.metricBox}>
              <Ionicons name="time-outline" size={24} color="#6366f1" />
              <Text style={styles.metricLabel}>Waktu</Text>
              <Text style={styles.metricValue}>
                {kinerja.waktu_bulan} Bulan
              </Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.card}>
          <Text style={styles.sectionTitle}>Progress Kuantitas</Text>
          <Text style={styles.totalValue}>{kinerja.total_target || '0'}</Text>
          <Text style={styles.targetMax}>dari {kinerja.kuantitas}</Text>

          <ProgressBar
            progress={progressValue}
            color={errorCount ? '#ef4444' : '#6366f1'}
            style={styles.progressBar}
          />

          {errorCount && (
            <Text style={styles.errorText}>
              Target melebihi kuantitas maksimum ({kinerja.kuantitas})
            </Text>
          )}
        </Surface>

        <Surface style={styles.card}>
          <View style={styles.targetHeader}>
            <Text style={styles.sectionTitle}>Target Bulanan</Text>
            <Button
              mode="contained"
              onPress={hitungRerata}
              style={[styles.button, styles.autoButton]}
              labelStyle={styles.buttonLabel}>
              Set Otomatis
            </Button>
          </View>

          <View style={styles.targetGrid}>
            {kinerja.target?.map((target, index) => (
              <Surface key={index} style={styles.targetCard}>
                <Text style={styles.monthLabel}>{target.bulan}</Text>
                <TextInput
                  style={styles.targetInput}
                  value={target.kuantitas?.toString()}
                  onChangeText={value => handleTargetChange(index, value)}
                  keyboardType="numeric"
                  placeholder="0.00"
                />
              </Surface>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={saveTarget}
            style={[styles.button, styles.saveButton]}
            labelStyle={styles.buttonLabel}
            disabled={errorCount}>
            Simpan
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e2e8f0',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
  metricValue: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  totalValue: {
    fontSize: 32,
    color: '#1e293b',
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
  },
  targetMax: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  targetCard: {
    width: (width - 64) / 2,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: 'white',
  },
  monthLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  targetInput: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Poppins-Medium',
    padding: 0,
  },
  button: {
    borderRadius: 8,
    elevation: 0,
  },
  autoButton: {
    backgroundColor: '#6366f1',
  },
  saveButton: {
    backgroundColor: '#06b6d4',
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default Kumulatif;
