import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../src/api/apiClient';
import GlobalStyle from '../../../src/utils/GlobalStyle';

const Kumulatif = ({ navigation, route }) => {
  const { item } = route.params; // Use item from route.params
  const [kinerja, setKinerja] = useState(item); // Initialize state with item
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = useApiClient();

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiclient.get(`user/kinerja/list/${item.uuid}/edit`);
      setKinerja(response.data.data);
    } catch (err) {
      console.error('Invalid data:', response);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Save target data
  const saveTarget = async () => {
    setLoading(true);
    try {
      const response = await apiclient.post(`user/kinerja/list/target/${kinerja.uuid}/save, kinerja.target`);
      console.log(response.data.data);
      fetchData(); // Refresh data after saving
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save target');
    } finally {
      setLoading(false);
    }
  };

  // Save total target
  const saveTotalTarget = async () => {
    setLoading(true);
    try {
      const response = await apiclient.post(`user/kinerja/list/${kinerja.uuid}/total-target, kinerja`);
      console.log(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save total target');
    } finally {
      setLoading(false);
    }
  };

  // Handle auto-sum calculation
  const hitungRerata = async () => {
    setLoading(true);
    try {
      const response = await apiclient.post(`user/kinerja/list/${kinerja.uuid}/auto-sum`, {
        uraian_id: kinerja.uraian_id,
        tahun_id: kinerja.kinerja.tahun_id,
      });
      setKinerja({ ...kinerja, target: response.data.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate auto-sum');
    } finally {
      setLoading(false);
    }
  };

  // Handle otomatis toggle
  const changeOtomatis = async () => {
    setLoading(true);
    try {
      const response = await apiclient.post(`user/kinerja/list/target/${kinerja.uuid}/otomatis`, {
        otomatis: !kinerja.otomatis
      });
      console.log(response.data.data);
      fetchData(); // Refresh data after toggling
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle otomatis');
    } finally {
      setLoading(false);
    }
  };

  // Handle kumulatif toggle
  const changeKumulatif = async () => {
    setLoading(true);
    try {
      const response = await apiclient.post(`user/kinerja/list/target/${kinerja.uuid}/kumulatif`, {
        kumulatif: kinerja.is_kumulatif ? 0 : 1,
      });
      console.log(response.data.data);
      fetchData(); // Refresh data after toggling
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle kumulatif');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={fetchData}>Retry</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Card style={[styles.customFont, styles.card]}>
        <Card.Title 
          title="Kumulatif"
          titleStyle={GlobalStyle.Bold}
          left={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#000" />
            </TouchableOpacity>
          )}
        />
        <Card.Content style={styles.userJabatanRow}>
          <View style={styles.userJabatanColumn}>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanLabel}>Kegiatan Tugas Jabatan</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanLabel}>Angka Kredit</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanLabel}>Kuantitas</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanLabel}>Kualitas</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanLabel}>Waktu</Text>
                    </View>
          </View>
          <View style={styles.userJabatanColumnR}>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanValue}>: {kinerja.uraian?.nm_uraian}</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanValue}>: {kinerja.uraian?.angka_kredit}</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanValue}>: {kinerja.kt_satuan}</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanValue}>: {kinerja.kl_persen}</Text>
                    </View>
                    <View style={styles.userJabatanItem}>
                      <Text style={styles.userJabatanValue}>: {kinerja.waktu_bulan}</Text>
                    </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={[styles.customFont, styles.title]}>Total Kuantitas</Text>
          <TextInput
            style={styles.input}
            value={kinerja.total_target?.toString()}
            editable={false}
          />
          <Button mode="contained" onPress={saveTotalTarget} style={styles.saveButton}>
            <Text style={styles.buttonText}>SIMPAN</Text>
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={changeOtomatis} style={[styles.autoButton]}>
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

// Reusable DetailRow component
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
      backgroundColor: '#fff',
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
    saveButton: {
      alignText: 'center',
      justifyContent: 'space-between',
      padding: 3,
      backgroundColor: '#3699ff',
      borderRadius: 5,
      marginVertical: 10,
    },
    autoButton: {
      alignText: 'center',
      justifyContent: 'space-between',
      padding: 3,
      borderRadius: 5,
      marginBottom: 15,
      backgroundColor: '#28a745',
    },
    buttonText: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'bold',
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
    customFont: {
    fontFamily: 'Poppins-Regular',
    },
    userJabatanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    },
    userJabatanColumn: {
      flex: 1,
      marginHorizontal: 5,
    },
    userJabatanColumnR: {
      flex: 1,
      marginHorizontal: 5,
    },
    userJabatanItem: {
      flexDirection: 'column',
      marginBottom: 8,
    },
    userJabatanLabel: {
      fontFamily: "Poppins-SemiBold",
      width: 120,
    },
    userJabatanValue: {
      fontFamily: "Poppins-Regular",
    },
  });
  
  export default Kumulatif;
  