import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

const BottomNavigationBar = () => {
  const navigation = useNavigation(); // Menggunakan hook useNavigation untuk mendapatkan objek navigation

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#333" />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Presensi')}>
        <Ionicons name="calendar-outline" size={24} color="#333" />
        <Text style={styles.menuText}>Presensi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Laporan')}>
        <Ionicons name="document-outline" size={24} color="#333" />
        <Text style={styles.menuText}>Laporan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color="#333" />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
});

export default BottomNavigationBar;
