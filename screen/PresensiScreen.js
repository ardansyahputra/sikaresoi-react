import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// Komponen Speedometer
const Speedometer = ({ value = 50, max = 100, time }) => {
  const size = 200; // Diameter speedometer
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Hitung progres
  const progress = Math.min(Math.max(value / max, 0), 1); // 0 hingga 1
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.speedometerContainer}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#28a745"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        {/* Center Value */}
        <SvgText
          x="50%"
          y="40%"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#fff"
        >
          {Math.round(value)}
        </SvgText>
        {/* Display Time */}
        <SvgText
          x="50%"
          y="60%"
          textAnchor="middle"
          fontSize="14"
          fill="#fff"
        >
          {time}
        </SvgText>
      </Svg>
    </View>
  );
};

// Komponen PresensiScreen
const PresensiScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const options = { timeZone: 'Asia/Jakarta', hour12: false };
      const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date);

      const formattedTime = date.toLocaleTimeString('id-ID', options);

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    alert('Check-in berhasil!');
  };

  const handleCheckOut = () => {
    alert('Check-out berhasil!');
  };

  const handleHistoryPresensi = () => {
    navigation.navigate('HistoryPresensi'); // Pastikan rute sudah diatur di navigator
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Presensi</Text>
      </View>

      {/* Date Section */}
      <View style={styles.dateContainer}>
        <Icon name="calendar" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {/* Time Section */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Waktu Saat Ini</Text>
        <Text style={styles.time}>{currentTime}</Text>
      </View>

      {/* Speedometer */}
      <Speedometer value={50} max={100} time={currentTime} />

      {/* Action Section */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCheckIn}>
          <Text style={styles.actionText}>Hadir</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Ringkasan Presensi</Text>
        <FlatList
          data={[
            { key: '1', label: 'Total Kehadiran', value: '20 Hari' },
            { key: '2', label: 'Hadir', value: '08:00 WIB' },
          ]}
          renderItem={({ item }) => (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
        {/* History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={handleHistoryPresensi}
      >
        <Text style={styles.historyButtonText}>Lihat History Presensi</Text>
      </TouchableOpacity>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 40,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timeLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  time: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  speedometerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  checkOutButton: {
    backgroundColor: '#dc3545',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 10,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
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
  backButton: {
    position: 'absolute', // Posisikan di pojok kiri
    left: 0,
    padding: 8,
  },
});

export default PresensiScreen;
