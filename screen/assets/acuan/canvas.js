import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient';
import axios from 'axios';

const MasterKinerja = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDisplay, setSelectedDisplay] = useState(null);
  const [userJabatanData, setUserJabatanData] = useState(null);
  const [kinerjaId, setKinerjaId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tgsTambahan, setTgsTambahan] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const apiClient = useApiClient();

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchListUraian(query, currentPage, selectedDisplay);
  };

  const [kinerja, setKinerja] = useState({
    totalak: 0,
    totalwpt: 0,
    totalbobot: 0,
    tahun_id: null,
    user_jabatan_id: null,
    alert: {
      show: false,
    },
  });
  const [listKinerja, setListKinerja] = useState([]);
  const [totalBobot, setTotalBobot] = useState(0);
  const [totalWpt, setTotalWpt] = useState(0);

  useEffect(() => {
    fetchUserJabatanData();
    fetchKinerjaId();
    fetchListUraian(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.nm_uraian?.toLowerCase().includes(lowerCaseQuery) ||
        item.nm_satuan?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      console.log('Jabatan Id:', response.data.data.jabatan_id);
      if (response?.data?.data) {
        setUserJabatanData(response.data.data.jabatan_id);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
    }
  };

  const fetchKinerjaId = async () => {
    try {
      const response = await apiClient.post('user/kinerja/list/index');
      console.log('Kinerja Id:', response.data.data.kinerja_id);
      if (response?.data?.data) {
        setKinerjaId(response.data.data.kinerja_id);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
    }
  };

  const fetchListUraian = async (page) => {
    try {
      setLoading(true);
      const response = await apiClient.post('uraian/indexAndro_user', {
        page,
        per: selectedDisplay,
        jabatan_id: userJabatanData || null,
        kinerja_id: kinerjaId || null,
        tgs_tambahan: tgsTambahan,
      });

      if (response?.data?.data) {
        const fetchedData = response.data.data;
        const checkedIds = fetchedData
          .filter(item => item.checkbox.includes('checked="checked"')) // Check if the checkbox is checked in the HTML string
          .map(item => item.id);

        setCheckedItems(checkedIds);
        setData(fetchedData);
        setCurrentPage(response.data.current_page || []);
        setLastPage(response.data.last_page || []);
        setListKinerja(response.data.data || []);

        console.log('Data fetched:', response.data.data || []);
      } else {
        console.error('Invalid data:', response);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error)) {
        console.log(error.toJSON());
      }
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxToggle = async (item) => {
    const isChecked = checkedItems.includes(item.id);
    if (isChecked) {
      setCheckedItems(checkedItems.filter(id => id !== item.id));
    } else {
      setCheckedItems([...checkedItems, item.id]);
    }
    await saveListKinerja(item);
  };

  const saveListKinerja2 = async (item) => {
    try {
      const payload = {
        list: {
          angka: 0,
          uraian_id: item.uraian?.id,
          kuantitas: 0,
          kualitas: 0,
          kinerja_id: kinerja?.id || null,
          waktu: 0,
          bobot: 0,
          tgs_tambahan: tgsTambahan,
          uraian_point: item.uraian?.point || 0,
          target_point: 0,
          uraian: item.uraian,
        },
      };

      if (tgsTambahan) {
        payload.keterangan = {
          bulan_id: bulan?.id,
          pimpinan_id: dataAktif.pimpinan_id,
        };
      }

      const response = await apiClient.post('user/kinerja/list/save', payload);
      console.log('Response:', response.data.data);
      fetchListUraian(); // Refresh data after saving
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', error.response?.data?.message || 'Gagal menyimpan data.');
    }
  };

   const saveListKinerja = async (item) => {
      try {
        // Construct the payload
        const payload = {
          kinerja: { // Use the kinerjaId from state
            uuid: item.uuid, // Generate or fetch this if needed
            user_jabatan_id: userJabatanData?.id, // Use the userJabatanData from state
            tahun_id: selectedYear, // Use the selectedYear from state
            status: 0, // Default status
          },
          list: {
            id: item.id || null, // Use the item's ID if available
            uraian_id: item.uraian?.id || item.id, // Use uraian.id or fallback to item.id
            kuantitas: item.kuantitas || 0,
            kualitas: item.kualitas || 0,
            waktu: item.waktu || 0,
            bobot: item.bobot || 0,
            wpt: item.wpt || 0,
            tgs_tambahan: item.tgs_tambahan || false,
            target_point: item.target_point || 0,
            uraian_point: item.uraian_point || 0,
          },
        };
    
        console.log('Payload:', JSON.stringify(payload, null, 2)); // Debugging: Log the payload
    
        // Send the payload to the API
        const response = await apiClient.post('user/kinerja/list/save', payload);
        console.log('Response:', response.data);
        Alert.alert('Sukses', 'Berhasil menambah uraian');
        fetchListUraian(currentPage, selectedYear, selectedDisplay);
      } catch (error) {
        console.error('Error saving data:', error);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Gagal menyimpan data.',
        );
      }
    };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.nm_uraian}</Text>
              <Checkbox
                status={checkedItems.includes(item.id) ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxToggle(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default MasterKinerja;