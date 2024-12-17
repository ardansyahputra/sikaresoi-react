import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingJabatan = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([
    {
      id: '1',
      jabatan: 'Sub Koordinator Bidang Adm Akademik',
      pimpinan: 'Capt. EGBERT EDWARD DJAJASASANA, M.Pd\nNIP: 19660416 199803 1 001',
      periode: '01 Oktober 2021 s/d 28 Februari 2022',
      aktif: false,
    },
    {
      id: '2',
      jabatan: 'Sub Koordinator Bidang Adm Akademik',
      pimpinan: 'SAMSUDDIN, M.T., M.Mar.E.\nNIP: 19720117 200212 1 001',
      periode: '01 Maret 2022 s/d 31 Desember 2022',
      aktif: false,
    },
    {
      id: '3',
      jabatan: 'Pengembang teknologi pembelajaran',
      pimpinan: 'Dr. Ir. RUKMINI, S.T., M.T.\nNIP: 19740311 199803 2 001',
      periode: '02 Januari 2023 s/d 31 Desember 2023',
      aktif: false,
    },
    {
      id: '4',
      jabatan: 'Analis PTP (Ketua TIM Administrasi Akademik)',
      pimpinan: 'Dr. Ir. SUPARDIM, M.Si., M.Mar.E., IPM\nNIP: 19730825 200212 1 002',
      periode: '02 Januari 2024 s/d 31 Desember 2024',
      aktif: true,
    },
    {
      id: '5',
      jabatan: 'Analis PTP (Ketua TIM Administrasi Akademik)',
      pimpinan: 'Dr. Ir. SUPARDIM, M.Si., M.Mar.E., IPM\nNIP: 19730825 200212 1 002',
      periode: '02 Januari 2024 s/d 31 Desember 2024',
      aktif: true,
    },
    {
      id: '6',
      jabatan: 'Analis PTP (Ketua TIM Administrasi Akademik)',
      pimpinan: 'Dr. Ir. SUPARDIM, M.Si., M.Mar.E., IPM\nNIP: 19730825 200212 1 002',
      periode: '02 Januari 2024 s/d 31 Desember 2024',
      aktif: true,
    },
    {
      id: '7',
      jabatan: 'Analis PTP (Ketua TIM Administrasi Akademik)',
      pimpinan: 'Dr. Ir. SUPARDIM, M.Si., M.Mar.E., IPM\nNIP: 19730825 200212 1 002',
      periode: '02 Januari 2024 s/d 31 Desember 2024',
      aktif: true,
    },
    {
      id: '8',
      jabatan: 'Analis PTP (Ketua TIM Administrasi Akademik)',
      pimpinan: 'Dr. Ir. SUPARDIM, M.Si., M.Mar.E., IPM\nNIP: 19730825 200212 1 002',
      periode: '02 Januari 2024 s/d 31 Desember 2024',
      aktif: true,
    },
    
  ]);

  const toggleSwitch = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, aktif: !item.aktif } : item
      )
    );
  };
  
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.aktif && styles.cardActive, // Add active style if applicable
      ]}
    >
      <View style={styles.rowBetween}>
        <View style={styles.textContainer}>
          <Text
            style={[styles.jabatan, item.aktif && styles.textActive]}
            numberOfLines={2} // Allow the jabatan text to wrap if it's too long
          >
            {item.jabatan}
          </Text>
          <Text
            style={[styles.pimpinan, item.aktif && styles.textActive]}
            numberOfLines={2}
          >
            {item.pimpinan}
          </Text>
          <Text style={[styles.periode, item.aktif && styles.textActive]}>
            {item.periode}
          </Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: '#BDBDBD', true: '#A1887F' }}
            thumbColor={item.aktif ? '#FFD600' : '#FAFAFA'}
            ios_backgroundColor="#BDBDBD"
            onValueChange={() => toggleSwitch(item.id)}
            value={item.aktif}
          />
        </View>
      </View>
      <View style={[styles.rowBetween, styles.buttonRow]}>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Icon name="delete" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  

  return (
    <View style={styles.container}>
      {/* Header dengan Tombol Back */}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>

         {/* Image and Title */}
      <View style={styles.headerContent}>
        <Image
          source={require('./images/sikaresoi.png')} // Path gambar sesuai
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>Jabatan</Text>
        <Text style={styles.headerSubtitle}>User • Jabatan </Text>
      </View>
      </View>

      {/* Search dan Tombol Tambah */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari jabatan..."
          placeholderTextColor="#BDBDBD"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color="#FAFAFA" />
          <Text style={styles.buttonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    padding: 16,
  },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#2563EB", paddingHorizontal: 16, paddingVertical: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, elevation: 5, marginBottom: 20, width: '100%',  },
  backButton: {
    marginRight: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    color: '#424242',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD600',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items at the top to prevent overlap
    flexWrap: 'wrap', // Allows wrapping if space is needed
  },
  
  textContainer: {
    flex: 1, // Ensures that the text container takes up available space
  },
  
  jabatan: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    flexWrap: 'wrap', // Allow text to wrap if it's too long
    flex: 1, // Ensures it takes up available space without pushing the switch button out of view
  },
  
  switchContainer: {
    justifyContent: 'center', // Ensure the switch is centered vertically
  },

  pimpinan: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  periode: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ACC1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },

  headerImage: {
    size: 10,
    width: 200,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },
  
  headerContent: {
    flex:1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAFAFA', // Warna teks
    marginTop: 10,
    marginBottom: 5,
  },

  headerSubtitle: { color: "#D1D5DB", marginTop: 4 },

});

export default SettingJabatan;
    