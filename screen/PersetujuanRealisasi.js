import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const PersetujuanRealisasi = () => {
  const [listTahun, setListTahun] = useState([]);
  const [listBulan, setListBulan] = useState([]);
  const [postData, setPostData] = useState({ bulan_id: 1, tahun_id: 2 });
  const [showReview, setShowReview] = useState(false);
  const [listData, setListData] = useState([]);
  const [selectedKirimRealisasi, setSelectedKirimRealisasi] = useState({});
  const tableRef = useRef();

  const baseURL = 'http://192.168.60.230:8000/api/v1';

  useEffect(() => {
    fetchTahun();
    fetchBulan();
  }, []);

  const fetchBulan = async () => {
    try {
      const response = await axios.get(`${baseURL}/bulan/show`);
      setListBulan(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTahun = async () => {
    try {
      const response = await axios.get(`${baseURL}/tahun/show`);
      setListTahun(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshData = () => {
    setShowReview(false);
    setTimeout(() => {
      tableRef.current?.refresh();
    }, 10);
  };

  const handleCallback = (data) => {
    setListData(data);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        setSelectedKirimRealisasi(item);
        setShowReview(true);
      }}
    >
      <Text>{item.kinerja.user_jabatan.user.name_nip}</Text>
      <Text>{item.kinerja.user_jabatan.jab_unit}</Text>
      <Text>{item.status_class}</Text>
      <Text>{item.revisi_class}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {showReview ? (
        <View>
          <Button title="LIST PERSETUJUAN" onPress={() => setShowReview(false)} color="#d9534f" />
          {/* Komponen Realisasi */}
          <Text>Realisasi View Placeholder</Text>
        </View>
      ) : (
        <View>
          <View style={styles.filters}>
            <Picker
              selectedValue={postData.bulan_id}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setPostData((prevState) => ({ ...prevState, bulan_id: itemValue }))
              }
            >
              {listBulan.map((bulan) => (
                <Picker.Item label={bulan.bulan} value={bulan.id} key={bulan.id} />
              ))}
            </Picker>
            <Picker
              selectedValue={postData.tahun_id}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setPostData((prevState) => ({ ...prevState, tahun_id: itemValue }))
              }
            >
              {listTahun.map((tahun) => (
                <Picker.Item label={tahun.tahun} value={tahun.id} key={tahun.id} />
              ))}
            </Picker>
          </View>
          <Text style={styles.selectedMonth}>
            {listBulan.find((a) => a.id === postData.bulan_id)?.bulan}
          </Text>
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.uuid}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text>DETAIL PENGIRIM</Text>
                <Text>JABATAN</Text>
                <Text>STATUS</Text>
                <Text>STATUS REVISI</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  selectedMonth: {
    textAlign: 'right',
    fontSize: 18,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
  },
});

export default PersetujuanRealisasi;