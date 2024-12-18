import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://192.168.2.102:8000/api/v1'; // Ganti dengan URL API Anda
const MANUAL_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjIuMTAyOjgwMDBcL2FwaVwvdjFcL2F1dGhcL3JlZnJlc2giLCJpYXQiOjE3MzQzMjk1OTYsImV4cCI6MTczNDM0MDAxOSwibmJmIjoxNzM0MzM2NDE5LCJqdGkiOiJnUzlLV0pCdFhiR2Z3bGR2Iiwic3ViIjo3LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.crA4yz6YvnEn07_QBoPM_GEuu75J7S8vxc93m4jPJ94'; // Ganti dengan token yang ingin digunakan

const Persetujuan = () => {
  const [listTahun, setListTahun] = useState([]);
  const [postData, setPostData] = useState({ tahun_id: 2 });
  const [showReview, setShowReview] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [listDataKinerja, setListDataKinerja] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDataKinerja, setSelectedDataKinerja] = useState({});

  useEffect(() => {
    // Ambil data tahun dan data kinerja berdasarkan tahun yang dipilih
    getTahun();
    getDataKinerja(postData.tahun_id);
  }, [postData.tahun_id]);

  // Mendapatkan data tahun
  const getTahun = async () => {
    try {
      const response = await axios.get(`${API_URL}/tahun/show`, {
        headers: {
          Authorization: `Bearer ${MANUAL_TOKEN}`, // Menambahkan token manual di header
        },
      });
      setListTahun(response.data.data);
    } catch (error) {
      console.error('Error fetching tahun:', error);
    }
  };

  // Mendapatkan data kinerja berdasarkan tahun
  const getDataKinerja = async (tahun_id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/user/kinerja/persetujuan`,
        { tahun_id },
        {
          headers: {
            Authorization: `Bearer ${MANUAL_TOKEN}`, // Menambahkan token manual di header
          },
        }
      );
      setListDataKinerja(response.data.data);
    } catch (error) {
      console.error('Error fetching kinerja:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menangani perubahan tahun
  const handleChangeTahun = (value) => {
    setPostData({ tahun_id: value });
    setShowTable(false);
    setTimeout(() => {
      setShowTable(true);
    }, 10);
  };

  // Menangani klik item untuk menampilkan detail
  const handleShowReview = (kinerja) => {
    setShowReview(true);
    setSelectedDataKinerja(kinerja);
  };

  // Menampilkan tabel data kinerja
  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.user_jabatan.user.name_nip}</Text>
      <Text>{item.user_jabatan.jab_unit}</Text>
      <Text>{item.status_class}</Text>
      <Text>{item.revisi_class}</Text>
      <Button title="Detail" onPress={() => handleShowReview(item)} />
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Picker selectedValue={postData.tahun_id} onValueChange={handleChangeTahun}>
          {listTahun.map((tahun) => (
            <Picker.Item key={tahun.id} label={tahun.tahun} value={tahun.id} />
          ))}
        </Picker>
      </View>

      <View style={{ marginBottom: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          showTable && (
            <FlatList
              data={listDataKinerja}
              renderItem={renderItem}
              keyExtractor={(item) => item.uuid.toString()}
            />
          )
        )}
      </View>

      {showReview && (
        <View style={{ marginTop: 20 }}>
          <Text>DETAIL PENGIRIM: {selectedDataKinerja.user_jabatan.user.name_nip}</Text>
          <Text>JABATAN: {selectedDataKinerja.user_jabatan.jab_unit}</Text>
          <Text>STATUS: {selectedDataKinerja.status_class}</Text>
          <Text>STATUS REVISI: {selectedDataKinerja.revisi_class}</Text>
        </View>
      )}
    </View>
  );
};

export default Persetujuan;
