  import React, { useState, useEffect } from 'react';
  import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ScrollView,
    SafeAreaView,
  } from 'react-native';
  import axios from 'axios';
  const Fingerprint = ({ navigation }) => {
    const [settingTimes, setSettingTimes] = useState([]);
    const [token, setToken] = useState('Bearer YOUR_TOKEN');
    const [uuid, setUuid] = useState(null);
    const [masukStart, setMasukStart] = useState('');
    const [masukEnd, setMasukEnd] = useState('');
    const [pulangStart, setPulangStart] = useState('');
    const [pulangEnd, setPulangEnd] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
  
    useEffect(() => {
      getSettingTime();
    }, []);
  
    const getSettingTime = () => {
      axios
        .get('http://192.168.60.163:8000/api/v1/fingerprint_machine/setting/show', {
          headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE2Mzo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2Mjk5MDg2LCJleHAiOjE3MzYzMTEyMTEsIm5iZiI6MTczNjMwNzYxMSwianRpIjoiVVRiY1R3VVB6UDBrMG9wViIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.vDh8wJoEak04Zyvu-bILCQk0ycsOkAZNzE6dRaI0DkYa' },
        })
        .then((response) => {
          if (response.data.status) {
            const data = response.data.data;
            if (data && data.length > 0) {
              const firstSetting = data[0];
              setUuid(firstSetting.uuid);
              setMasukStart(firstSetting.masuk_start);
              setMasukEnd(firstSetting.masuk_end);
              setPulangStart(firstSetting.pulang_start);
              setPulangEnd(firstSetting.pulang_end);
              setCreatedAt(firstSetting.created_at);
              setUpdatedAt(firstSetting.updated_at);
              setSettingTimes(data);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
  
    const save = () => {
      const payload = {
        uuid: uuid,
        masuk_start: masukStart,
        masuk_end: masukEnd,
        pulang_start: pulangStart,
        pulang_end: pulangEnd,
      };
  
      axios
        .post('http://192.168.60.163:8000/api/v1/fingerprint_machine/setting/save', payload, {
          headers: { Authorization: 'Bearer YOUR_TOKEN' },
        })
        .then((response) => {
          if (response.data.status) {
            console.log('Saved successfully');
          } else {
            console.error('Failed to save settings:', response.data.res.message);
          }
        })
        .catch((error) => {
          console.error('Failed to save settings:', error);
        });
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.headerTitle}>Fingerprint</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Setting Jam Fingerprint</Text>
                </View>
                <View style={styles.cardDivider}></View>
                <View style={styles.cardBody}>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderCell}>Jam Mulai Masuk</Text>
                      <Text style={styles.tableHeaderCell}>Jam Selesai Masuk</Text>
                      <Text style={styles.tableHeaderCell}>Jam Mulai Pulang</Text>
                      <Text style={styles.tableHeaderCell}>Jam Selesai Pulang</Text>
                      <Text style={styles.tableHeaderCell}>Aksi</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <TextInput
                        style={styles.input}
                        value={masukStart}
                        placeholder="Jam Masuk"
                        onChangeText={setMasukStart}
                      />
                      <TextInput
                        style={styles.input}
                        value={masukEnd}
                        placeholder="Jam Keluar"
                        onChangeText={setMasukEnd}
                      />
                      <TextInput
                        style={styles.input}
                        value={pulangStart}
                        placeholder="Total Jam"
                        onChangeText={setPulangStart}
                      />
                      <TextInput
                        style={styles.input}
                        value={pulangEnd}
                        placeholder="Dispensasi"
                        onChangeText={setPulangEnd}
                      />
                      <TouchableOpacity style={styles.saveButton} onPress={save}>
                        <Text style={styles.buttonText}>Simpan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E7E9F1' },
    header: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    headerTitle: { textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
    cardContainer: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 50,
      paddingHorizontal: 10,
      borderRadius: 10,
      elevation: 4,
      marginTop: 65, // Adjust margin top to remove excess space
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      marginHorizontal: 10,
    },
    cardHeader: { marginBottom: 15 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginBottom: 10, },
    cardDivider: {
      height: 1,
      backgroundColor: '#ddd',
      marginVertical: 10,
    },
    cardBody: {
      backgroundColor: '#F7F8FB',
      borderRadius: 10,
      padding: 15,
    },
    table: { marginTop: 20 },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    tableHeaderCell: {
      fontWeight: 'bold',
      width: '18%',
      textAlign: 'center',
      fontSize: 10,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
      borderBottomColor: '#ddd',
    },
    input: {
      borderWidth: 1,
      borderColor: '#CCC',
      padding: 9,
      borderRadius: 5,
      marginVertical: 8,
      width: '18%',
      fontSize: 9,
    },
    saveButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 4,
      paddingHorizontal: 6,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      width: '18%',
      height: 32,
      marginTop: 8,
    },
    buttonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 10,
    },
  });
  
  export default Fingerprint;
  