import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'moment/locale/id';  // Import Indonesian locale


const PresensiScreen = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Jakarta").format('HH:mm:ss'));
  const [presenceStatus, setPresenceStatus] = useState(null);
  const [circleColor, setCircleColor] = useState('#d3d3d3');
  const [textColor, setTextColor] = useState('#4caf50');
  const [hadirTime, setHadirTime] = useState(null);
  const [keluarTime, setKeluarTime] = useState(null);
  const animatedValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().tz("Asia/Jakarta").format('HH:mm:ss'));
    }, 1000);

    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      clearInterval(interval);
      animatedValue.stopAnimation();
    };
  }, []);

  const handlePresence = () => {
    setPresenceStatus('HADIR');
    setCircleColor('#4caf50');
    setTextColor('#4caf50');
    setHadirTime(moment().tz("Asia/Jakarta").format('HH:mm:ss'));
  };

  const handleKeluar = () => {
    setPresenceStatus('KELUAR');
    setCircleColor('#f44336');
    setTextColor('#f44336');
    setKeluarTime(moment().tz("Asia/Jakarta").format('HH:mm:ss'));
  };

  const rotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image source={require('./assets/images/sikaresoi.png')} style={styles.headerImage} />
      </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Presensi</Text>
              <Text style={styles.separatorText}> • </Text>
              <Text style={styles.headerSubtitle}>Data Presensi</Text>
            </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dateContainer}>
          <View style={styles.dateSection}>
            <Icon name="calendar" size={20} color="#4caf50" />
            <Text style={styles.dateText}>{moment().tz("Asia/Jakarta").format('dddd, D MMMM YYYY')}</Text>
          </View>
        </View>

        <View style={styles.stopwatchContainer}>
          <Animated.View style={[styles.animatedCircle, { transform: [{ rotate: rotation }], borderColor: circleColor }]} />
          <Text style={styles.stopwatchLabel}>Presensi Kehadiran</Text>
          <Text style={[styles.realtimeText, { color: textColor }]}>{currentTime}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Status Presensi</Text>
          <View style={styles.statusContent}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={[styles.statusValue, presenceStatus === 'HADIR' ? styles.statusHadir : styles.statusKeluar]}>
                {presenceStatus || 'BELUM HADIR'}
              </Text>
            </View>
            {hadirTime && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Hadir pada:</Text>
                <Text style={styles.statusValue}>{hadirTime}</Text>
              </View>
            )}
            {keluarTime && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Keluar pada:</Text>
                <Text style={styles.statusValue}>{keluarTime}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.hadirButton]} onPress={handlePresence}>
            <Text style={styles.buttonText}>Hadir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.keluarButton]}
            onPress={handleKeluar}
            disabled={!presenceStatus || presenceStatus === 'KELUAR'}
          >
            <Text style={styles.buttonText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('HistoryPresensi')}>
          <Text style={styles.historyButtonText}>Lihat History Presensi</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backButton: {
    marginTop:1,
    marginLeft:3,
    marginRight:1,
    opacity: 0.4,
  },
  scrollContainer: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: -10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  stopwatchContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  animatedCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 100,
    borderWidth: 10,
    opacity: 0.5,
    marginTop: 45,
  },
  realtimeText: {
    fontSize: 35,
    marginTop: 90,
    fontFamily: 'Poppins-SemiBold',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    marginTop: 70,
    fontFamily: 'Poppins-Regular',
  },
  statusTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  statusContent: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  statusValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  statusHadir: {
    color: '#4caf50',
  },
  statusKeluar: {
    color: '#f44336',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  hadirButton: {
    backgroundColor: '#4caf50',
  },
  keluarButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  historyButton: {
    backgroundColor: '#3b82f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  stopwatchLabel: {
    fontSize: 20,
    color: '#555',
    fontFamily: 'Poppins-SemiBold',
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#000",
  },
  separatorText: {
    fontSize: 20,
    color: "#000",
    marginBottom: 3,
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#000",
    marginLeft: 0,
  },
});

export default PresensiScreen;
