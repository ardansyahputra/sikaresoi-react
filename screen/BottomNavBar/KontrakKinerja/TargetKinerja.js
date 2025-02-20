import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiService from './apiService'; // Import your API service
import useApiClient from '../../../src/api/apiClient';

const TargetKinerja = ({ navigation, route }) => {
  const { selectedKinerja } = route.params;
  const [kinerja, setKinerja] = useState(selectedKinerja);
  const [checked, setChecked] = useState(selectedKinerja.otomatis);
  const [checkedKumulatif, setCheckedKumulatif] = useState(selectedKinerja.is_kumulatif);
  const [errorCount, setErrorCount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiClient = useApiClient();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await apiClient.get(`user/kinerja/list/${item.uuid}`);
      setKinerja(response.data.data);
      setChecked(response.data.data.otomatis);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };

  const saveTarget = async () => {
    try {
      const response = await apiClient.post(`user/kinerja/list/${item.uuid}/save`);
      console.log(response.data.data);
      getData();
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };

  const saveTotalTarget = async () => {
    try {
      const response = await apiClient.post(`user/kinerja/list/${item.uuid}/total-target`);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };

  const hitungRerata = async () => {
    if (kinerja.auto_sum) {
      try {
        const response = await apiClient.post(`user/kinerja/list/${item.uuid}/auto-sum`, {
          uraian_id: kinerja.uraian_id,
          tahun_id: kinerja.kinerja.tahun_id,
        });
        setKinerja({ ...kinerja, target: response.data.data });
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show a toast message)
      }
    } else {
      const hasil = (kinerja.kuantitas / kinerja.waktu);
      const newTargets = kinerja.target.map((target, index) => ({
        ...target,
        kuantitas: parseFloat(hasil).toFixed(2),
      }));
      setKinerja({ ...kinerja, target: newTargets });
    }
  };

  const changeOtomatis = async () => {
    try {
      const response = await apiClient.post(`user/kinerja/list/target/${item.uuid}/otomatis`, {
        otomatis: !kinerja.otomatis,
      });
      console.log(response.data.data);
      getData();
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };

  const changeKumulatif = async () => {
    try {
      const response = await apiClient.post(`user/kinerja/list/target/${item.uuid}/kumulatif`, {
        kumulatif: checkedKumulatif ? 1 : 0,
      });
      console.log(response.data.data);
      setCheckedKumulatif(!checkedKumulatif);
      getData();
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };

  const checkTarget = () => {
    if (checkedKumulatif) {
      const lastTarget = kinerja.target[kinerja.target.length - 1]?.kuantitas;
      if (parseFloat(lastTarget) > parseFloat(kinerja.kuantitas)) {
        setErrorCount(true);
        setErrorMessage(`Maaf, Target Kumulatif Anda (Bulan Terakhir) Tidak Boleh Lebih Dari ${kinerja.kuantitas}`);
      } else if (parseFloat(lastTarget) < parseFloat(kinerja.kuantitas)) {
        setErrorCount(true);
        setErrorMessage(`Maaf, Target Kumulatif Anda (Bulan Terakhir) Tidak Boleh Kurang Dari ${kinerja.kuantitas}`);
      } else {
        setErrorCount(false);
        setErrorMessage('');
      }
      return lastTarget; 
    } else {
      const totalTarget = kinerja.target.reduce((sum, target) => sum + parseFloat(target.kuantitas || 0), 0);
      if (parseFloat(totalTarget).toFixed(2) > parseFloat(kinerja.kuantitas)) {
        setErrorCount(true);
        setErrorMessage(`Maaf, Target Anda Tidak Boleh Lebih Dari ${kinerja.kuantitas}`);
      } else if (parseFloat(totalTarget).toFixed(2) < parseFloat(kinerja.kuantitas)) {
        setErrorCount(true);
        setErrorMessage(`Maaf, Target Anda Tidak Boleh Kurang Dari ${kinerja.kuantitas}`);
      } else {
        setErrorCount(false);
        setErrorMessage('');
      }
      return totalTarget.toFixed(2);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      <Card style={styles.card}>
        <Card.Title
          title="Performance Breakdown"
          left={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <DetailRow label="Sub Unsur" value={kinerja.uraian?.sub_unsur?.nm_sub_unsur} />
          <DetailRow label="Kegiatan Tugas Jabatan" value={kinerja.uraian?.nm_uraian} />
          <DetailRow label="Angka Kredit" value={kinerja.uraian?.angka_kredit} />
          <DetailRow label="Kuantitas" value={kinerja.kt_satuan} />
          <DetailRow label="Kualitas" value={kinerja.kl_persen} />
          <DetailRow label="Waktu (Bulan)" value={kinerja.waktu_bulan} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Total Kuantitas</Text>
          <TextInput
            style={styles.input}
            value={kinerja.total_target?.toString()}
            editable={false}
          />
          <Button mode="contained" onPress={saveTotalTarget} style={styles.button}>
            SIMPAN
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={changeOtomatis} style={styles.autoButton}>
            SET OTOMATIS
          </Button>
          <View style={styles.targetGrid}>
            {kinerja.target?.map((target, index) => (
              <View key={index} style={styles.targetItem}>
                <Text style={styles.targetLabel}>{target.bulan}:</Text>
                <TextInput
                  style={styles.targetInput}
                  value={target.kuantitas?.toString()}
                  editable={false}
                />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);
  
  const styles = StyleSheet.create({
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
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
    },
    card: {
      marginBottom: 15,
      borderRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
      textAlign: 'center',
      backgroundColor: '#fff',
    },
    button: {
      marginTop: 10,
      backgroundColor: '#007bff',
    },
    autoButton: {
      backgroundColor: '#28a745',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    value: {
      fontSize: 14,
    },
    targetGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    targetItem: {
      width: '48%',
      marginBottom: 10,
    },
    targetLabel: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    targetInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 8,
      fontSize: 14,
      backgroundColor: '#fff',
    },
  });
  
  export default TargetKinerja;