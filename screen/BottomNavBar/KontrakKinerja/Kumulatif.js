import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../src/api/apiClient';
import GlobalStyle from '../../../src/utils/GlobalStyle';
import { toastConfig, Toast } from '../../../src/utils/CustomToast';

const Kumulatif = ({ navigation, route }) => {
  const { item } = route.params; // Use item from route.params
  const [kinerja, setKinerja] = useState(item); // Initialize state with item
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(false); // Track if total target exceeds kuantitas
  const apiClient = useApiClient();
  const showToast = (type, text1, text2) => {
      Toast.show({
        type,
        text1,
        text2,
      });
    };

  useEffect(() => {
    console.log('item:', item); // Check if item is defined
    if (item) {
      fetchData();
    }
  }, [item]);

  // Fetch data from the backend
   const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`user/kinerja/list/${item.id}/edit`);
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
      if (!kinerja.target || !Array.isArray(kinerja.target) || kinerja.target.length === 0) {
       showToast('error','Error', 'Data target tidak ditemukan');
        return;
    }

    // Format ulang payload agar sesuai dengan yang diharapkan backend
    const payload = kinerja.target.map(target => ({
        id: target.id, // Jika update, gunakan id. Jika insert baru, mungkin id dibiarkan kosong/null
        uuid: target.uuid || null, // Jika data baru, backend mungkin akan generate UUID
        bulan_id: target.bulan_id,
        list_kinerja_id: target.list_kinerja_id,
        kuantitas: target.kuantitas,
        biaya: target.biaya,
        pimpinan_id: target.pimpinan_id
    }));

      console.log('Payload:', JSON.stringify(payload, null, 2)); // Debugging: Log the payload

      const response = await apiClient.post(`user/kinerja/list/target/${kinerja.uuid}/save`, payload);
      console.log('Save target response:', response.data.data);
      showToast('success', 'Success', response.data.data);
      fetchData(); // Refresh data after saving
    } catch (err) {
      console.error('Error', err.response?.data || err.message);
      showToast('error', 'Error', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average and update target values (Set Otomatis)
const hitungRerata = () => {
  // Use values from the current state
  const hasil = kinerja.kuantitas / kinerja.waktu;
  
  // Create entirely new target objects to avoid modifying read-only properties
  const updatedTargets = kinerja.target.map((target, index) => {
    // Only update targets within the waktu range
    if (index < kinerja.waktu) {
      return {
        ...target, // Spread all existing properties
        kuantitas: parseFloat(hasil).toFixed(2) // Set new kuantitas value
      };
    }
    // Keep targets outside the waktu range unchanged
    return { ...target };
  });
  
  // Calculate the new total
  let totalTarget = 0;
  updatedTargets.forEach((target) => {
    if (target.kuantitas) {
      totalTarget += parseFloat(target.kuantitas);
    }
  });
  
  // Update error state
  const newErrorCount = totalTarget.toFixed(2) > parseFloat(kinerja.kuantitas);
  setErrorCount(newErrorCount);
  
  // Update the state with new objects
  setKinerja(prevState => ({
    ...prevState,
    target: updatedTargets,
    total_target: totalTarget.toFixed(2)
  }));
};

  // Calculate total target and check for errors
  const countTarget = () => {
    let totalTarget = 0;
    kinerja.target.forEach((target) => {
      if (target.kuantitas) {
        totalTarget += parseFloat(target.kuantitas);
      }
    });

    if (totalTarget.toFixed(2) > parseFloat(kinerja.kuantitas)) {
      setErrorCount(true);
    } else {
      setErrorCount(false);
    }

    setKinerja({ ...kinerja, total_target: totalTarget.toFixed(2) });
  };

  // Handle input change for target values
  const handleTargetChange = (index, value) => {
    const updatedTargets = [...kinerja.target];
    updatedTargets[index].kuantitas = value;
    setKinerja({ ...kinerja, target: updatedTargets });
    countTarget(); // Update total target
  };

  // Fetch data on component mount
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <ScrollView style={styles.container}>
      <Card style={[styles.customFont, styles.card]}>
        <Card.Title
          title="Kumulatif"
          titleStyle={GlobalStyle.Bold}
          left={() => (
            <TouchableOpacity onPress={() => navigation.navigate('KontrakKinerja')}>
              <Ionicons name="arrow-back" size={20} color="#000" />
            </TouchableOpacity>
          )}
        />
        <Card.Content style={styles.userJabatanRow}>
          <View style={styles.userJabatanColumn}>
            <View style={styles.userJabatanItem}>
              <Text style={styles.userJabatanLabel}>Kegiatan Tugas Jabatan:</Text>
              <Text style={styles.userJabatanValue}>{item.uraian?.nm_uraian}</Text>
            </View>

            <View style={styles.userJabatanItem}>
              <Text style={styles.userJabatanLabel}>Angka Kredit:</Text>
              <Text style={styles.userJabatanValue}>{item.uraian?.angka_kredit}</Text>
            </View>
          </View>
          <View style={styles.userJabatanColumnR}>
            <View style={styles.userJabatanItem}>
              <Text style={styles.userJabatanLabel}>Kuantitas:</Text>
              <Text style={styles.userJabatanValue}>{item.kt_satuan}</Text>
            </View>

            <View style={styles.userJabatanItem}>
              <Text style={styles.userJabatanLabel}>Kualitas:</Text>
              <Text style={styles.userJabatanValue}>{item.kl_persen}</Text>
            </View>

            <View style={styles.userJabatanItem}>
              <Text style={styles.userJabatanLabel}>Waktu:</Text>
              <Text style={styles.userJabatanValue}>{item.waktu_bulan}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={ styles.title}>Total Kuantitas</Text>
          <TextInput
            style={styles.input}
            value={kinerja.total_target?.toString()}
            editable={false}
          />
          {errorCount && (
            <Text style={styles.errorText}>
              Maaf, Target Anda Tidak Boleh Lebih Dari {item.kuantitas}
            </Text>
          )}
          <Button 
            mode="contained" 
            onPress={saveTarget} 
            style={styles.saveButton} 
            disabled={loading || errorCount}
          >
            {loading ? (
              <View style={styles.saveButtonContainer}>
                <Text style={styles.textLoading}>Mohon Tunggu...</Text><Text> </Text>
                <ActivityIndicator size={16} color="#fff" opacity={0.8}/>
              </View>
              
              
            ) : (
              <Text style={styles.buttonText}>SIMPAN</Text>
            )}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={hitungRerata} style={styles.autoButton} disabled={errorCount}>
            <Text style={styles.buttonText}>SET OTOMATIS</Text>
          </Button>
          <View style={styles.targetGrid}>
            {kinerja.target?.map((target, index) => (
              <View key={index} style={styles.targetItem}>
                <Text style={styles.targetLabel}>{target.bulan}:</Text>
                <TextInput
                  style={styles.targetInput}
                  value={target.kuantitas?.toString()}
                  onChangeText={(value) => handleTargetChange(index, value)}
                  keyboardType="numeric"
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
      fontFamily: 'Poppins-Bold',
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
    saveButtonContainer: {
      flexDirection: 'row',
    },
    saveButton: {
      justifyContent: 'center',
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
      color: '#fff',
      fontFamily: 'Poppins-Bold',
    },
    textLoading: {
      opacity: 0.8,
      color: '#fff',
      fontFamily: 'Poppins-Bold',
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
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 8,
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
  