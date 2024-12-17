import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Ardan from 'react-native-vector-icons/MaterialIcons';
import Gusti from 'react-native-vector-icons/FontAwesome';
import Gus from 'react-native-vector-icons/FontAwesome6';
import SettingJabatan from './BottomNavBar/SettingJabatan';

const colors = ['#1c7aff', '#ff1c1c', '#ff7e1c', '#f719ff', '#999699', '#0da186'];

const Menu = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image
        source={require('./assets/sikaresoi.png')} // Path gambar sesuai
        style={styles.headerImage}
      />

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>SIKARESOI</Text>
        <Text style={styles.headerSubtitle}>
          Sistem Kaskading Remunesari Secara Optimal dan Integral
        </Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.category, { backgroundColor: colors[0] }]}
          onPress={() => navigation.navigate('SettingJabatan')}
        >
          <View style={styles.iconContainer}>
            <Ardan name="settings" size={35} color="white" />
          </View>
          <Text style={styles.categoryText}>Setting Jabatan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.category, { backgroundColor: colors[1] }]}
          onPress={() => navigation.navigate('RealisasiKinerja')} // Add navigation here
        >
          <View style={styles.iconContainer}>
            <Ionicons name="add-circle-outline" size={35} color="white" />
          </View>
          <Text style={styles.categoryText}>Realisasi Kinerja</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.category, { backgroundColor: colors[2] }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={35} color="white" />
          </View>
          <Text style={styles.categoryText}>Persetujuan Kontrak Kinerja</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.category, { backgroundColor: colors[3] }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="documents-outline" size={35} color="white" />
          </View>
          <Text style={styles.categoryText}>Persetujuan Realisasi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.category, { backgroundColor: colors[4] }]}>
          <View style={styles.iconContainer}>
            <Gusti name="book" size={35} color="white" />
          </View>
          <Text style={styles.categoryText}>Laporan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.category, { backgroundColor: colors[5] }]}>
          <View style={styles.iconContainer}>
            <Gus name="border-all" size={35} color="white" />
          </View>
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerImage: {
    width: '60%',
    height: 40,
    marginBottom: 30,
    marginTop: 10,
    resizeMode: 'contain',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  headerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#333333',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#777777',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  category: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingVertical: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 10,
  },
  iconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 200,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});


export default Menu;