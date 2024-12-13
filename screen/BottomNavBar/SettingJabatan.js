  import React, { useState } from 'react';
  import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Switch,
    TextInput,
  } from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialIcons';

  const SettingJabatan = () => {
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
    ]);

    const toggleSwitch = (id) => {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, aktif: !item.aktif } : item
        )
      );
    };

    const renderItem = ({ item }) => (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.jabatan}>{item.jabatan}</Text>
            <Text style={styles.pimpinan}>{item.pimpinan}</Text>
            <Text style={styles.periode}>{item.periode}</Text>
          </View>
          <Switch
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={item.aktif ? '#fff' : '#fff'}
            ios_backgroundColor="#ccc"
            onValueChange={() => toggleSwitch(item.id)}
            value={item.aktif}
          />
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Icon name="delete" size={20} color="#fff" />
            <Text style={styles.buttonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Jabatan</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.buttonText}>Tambah</Text>
          </TouchableOpacity>
        </View>
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
      backgroundColor: '#f9f9f9',
      padding: 16,
    },
    header: {
      marginBottom: 16,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginRight: 8,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    jabatan: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    pimpinan: {
      fontSize: 14,
      color: '#555',
      marginTop: 4,
    },
    periode: {
      fontSize: 14,
      color: '#777',
      marginTop: 4,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2196F3',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F44336',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginLeft: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 8,
    },
    listContainer: {
      paddingBottom: 16,
    },
  });

  export default SettingJabatan;
