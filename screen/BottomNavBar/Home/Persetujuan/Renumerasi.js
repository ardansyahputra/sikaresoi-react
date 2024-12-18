import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker, Alert, FlatList, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';

const RemunerasiScreen = () => {
  const [tahun, setTahun] = useState('');
  const [bulanId, setBulanId] = useState('');
  const [pajak, setPajak] = useState('');
  const [listTahun, setListTahun] = useState([]);
  const [listBulan, setListBulan] = useState([]);
  const [dataRealisasi, setDataRealisasi] = useState({});
  const [formData, setFormData] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    getTahun();
    getBulan();
  }, []);

  const getTahun = async () => {
    try {
      const response = await axios.get('/tahun/show');
      setListTahun(response.data.data);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const getBulan = async () => {
    try {
      const response = await axios.get('/bulan/show');
      setListBulan(response.data.data);
    } catch (error) {
      console.error('Error fetching months:', error);
    }
  };

  const getDataRealisasi = async () => {
    try {
      const response = await axios.post('/laporan/remunerasi_direktur', {
        bulan_id: bulanId,
        tahun: tahun,
      });
      setDataRealisasi(response.data.data);
    } catch (error) {
      console.error('Error fetching realisasi data:', error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.post('/persetujuan/remunerasi/edit', {
        bulan_id: bulanId,
        tahun_id: tahun,
      });
      setFormData(response.data.status ? response.data.data : { indeks: '' });
      setShow(true);
    } catch (error) {
      setFormData({ indeks: '' });
      setShow(true);
    }
  };

  const postData = async () => {
    const url = formData.id
      ? `/persetujuan/remunerasi/${formData.uuid}/update`
      : '/persetujuan/remunerasi/create';
    const jenis = formData.id ? 'Update' : 'Verifikasi';
    
    const confirmMessage = `Apakah Anda Yakin Untuk Merubah Data ?`;

    Alert.alert('Konfirmasi', confirmMessage, [
      { text: 'Batal', style: 'cancel' },
      { text: `Ya, ${jenis} Sekarang!`, onPress: async () => {
        try {
          const response = await axios.post(url, formData);
          Alert.alert('Sukses!', response.data.data);
          getData();
        } catch (error) {
          Alert.alert('Error', 'Terjadi Kesalahan!');
        }
      }},
    ]);
  };

  const revisiData = async () => {
    Alert.alert('Data Akan Di Revisi, Apakah Anda Yakin ?', `Sisa Kesempatan Untuk Merevisi ${3 - formData.count}`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Ya, Revisi Sekarang!', onPress: async () => {
        try {
          const response = await axios.get(`/persetujuan/remunerasi/${formData.uuid}/revisi`);
          Alert.alert('Sukses!', response.data.data);
          getData();
        } catch (error) {
          Alert.alert('Error', 'Terjadi Kesalahan!');
        }
      }},
    ]);
  };

  const download = () => {
    if (!bulanId || !tahun) {
      Alert.alert('Error', 'Mohon Pilih Bulan dan Tahun Terlebih Dahulu!');
      return;
    }
    
    getDataRealisasi();
    getData();
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text>Pilih Bulan *</Text>
        <Picker selectedValue={bulanId} onValueChange={setBulanId}>
          <Picker.Item label="-- PILIH --" value="" />
          {listBulan.map(bulan => (
            <Picker.Item key={bulan.id} label={bulan.bulan} value={bulan.id} />
          ))}
        </Picker>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Pilih Tahun *</Text>
        <Picker selectedValue={tahun} onValueChange={setTahun}>
          <Picker.Item label="-- PILIH --" value="" />
          {listTahun.map(tahunItem => (
            <Picker.Item key={tahunItem.id} label={tahunItem.tahun} value={tahunItem.tahun} />
          ))}
        </Picker>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Potongan Pajak *</Text>
        <Picker selectedValue={pajak} onValueChange={setPajak}>
          <Picker.Item label="-- PILIH --" value="" />
          <Picker.Item label="Progresif" value="PROGRESIF" />
          <Picker.Item label="Final" value="FINAL" />
        </Picker>
      </View>

      <Button title="LIHAT DATA" onPress={download} />

      {show && (
        <>
          <FlatList
            data={dataRealisasi.totals}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text style={{ flex: 1 }}>{item.nm_uraian}</Text>
                <Text style={{ textAlign: 'right', flex: 1 }}>{item.target}</Text>
                <Text style={{ textAlign: 'right', flex: 1 }}>{item.total}</Text>
              </View>
            )}
          />

          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            {dataRealisasi.totals[0]?.persentase?.toFixed(0)}%
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TextInput
              style={{ borderWidth: 1, flex: 0.6, marginRight: 10, padding: 10 }}
              placeholder="Indeks"
              value={formData.indeks}
              onChangeText={text => setFormData({ ...formData, indeks: text })}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button title={!formData.status ? 'VERIFIKASI' : 'UPDATE'} onPress={postData} />
              <Button title={`BATALKAN (${formData.count || 0}/3)`} onPress={revisiData} disabled={!formData.status || formData.count === 3} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default RemunerasiScreen;
