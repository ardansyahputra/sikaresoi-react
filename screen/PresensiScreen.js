import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const PresensiScreen = ({ navigation }) => {
  const [presenceStatus, setPresenceStatus] = useState(null); // Status kehadiran
  const [keluarTime, setKeluarTime] = useState(null); // Waktu keluar
  const [animatedValue] = useState(new Animated.Value(0)); // Animasi lingkaran
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // Waktu saat ini

  // Simpan data ketika halaman ini aktif (focus)
  useFocusEffect(
    React.useCallback(() => {
      console.log("Halaman Presensi Dipanggil Kembali");
      return () => {
        console.log("Halaman Presensi Ditinggalkan");
      };
    }, [])
  );

  // Animasi lingkaran saat status berubah
  const handlePresence = (status) => {
    setPresenceStatus(status);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => animatedValue.setValue(0));
  };

  // Menangani waktu keluar
  const handleKeluar = () => {
    const keluarTime = new Date().toLocaleTimeString();
    setKeluarTime(keluarTime);
  };

  // Update waktu setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animasi scale untuk lingkaran
  const animatedScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const progressInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
      colors={['#fff', '#fff']} // Adjust colors to your preference
      style={styles.header}
    >
        <View style={styles.headerContent}>
          <Image
            source={require('./assets/images/sikaresoi.png')} // Path gambar sesuai
            style={styles.headerImage}
          />
          <Text style={styles.title}>Presensi Kehadiran</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Konten scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={20} color="#" style={{ marginRight: 8 }} />
          <Text style={styles.detailText}>Tanggal: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Lingkaran dengan animasi progress */}
        <View style={styles.circleContainer}>
          <Animated.View
            style={[styles.progressCircle, { transform: [{ rotate: progressInterpolation }] }]}
          />
          <Animated.View
            style={[styles.circle, { transform: [{ scale: animatedScale }] }]}>
            <Text style={styles.temperature}>{presenceStatus}</Text>
            <Text style={styles.timeText}>{currentTime}</Text>
          </Animated.View>
        </View>

        {/* Tombol untuk status kehadiran */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#178003' }]}
            onPress={() => handlePresence('Hadir')}
          >
            <Icon name="checkmark-circle" size={32} color="#fff" />
            <Text style={styles.buttonText}>Hadir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f44336' }]}
            onPress={handleKeluar}
          >
            <Icon name="exit" size={32} color="#fff" />
            <Text style={styles.buttonText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Status dengan Waktu */}
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Status: {presenceStatus}</Text>
          {presenceStatus && (
            <Text style={styles.statusText}>
              Hadir pada jam: {currentTime}
            </Text>
          )}
          {keluarTime && (
            <Text style={styles.statusText}>
              Keluar pada jam: {keluarTime}
            </Text>
          )}
        </View>

        {/* Tombol History */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('HistoryPresensi')}
        >
          <Text style={styles.historyButtonText}>Lihat History Presensi</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfafa',

  },
  header: {
    height: 100,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowOffset: 30,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column', // Susunan vertikal
  },
  headerImage: {
    width: '45%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
    marginRight: 160,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 40,
  },
  detailText: {
    fontSize: 16,
    color: '#000',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  progressCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 10,
    borderColor: '#4caf50',
    opacity: 0.5,
  },
  temperature: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796b',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailContainer: {
    alignItems: 'flex-start',
    width: '100%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  historyButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PresensiScreen;
