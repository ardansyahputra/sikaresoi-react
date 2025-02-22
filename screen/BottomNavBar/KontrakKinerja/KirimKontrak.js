import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useApiClient from '../../../src/api/apiClient'; // Adjust the import path

const KirimKontrak = ({ kinerja, user }) => {
  const navigation = useNavigation();
  const apiClient = useApiClient();
  const [revisi, setRevisi] = useState('');
  const [userJabatanData, setUserJabatanData] = useState(null);

   useEffect(() => {
      fetchUserJabatanData();
    }, []);

  const fetchUserJabatanData = async () => {
    try {
      const response = await apiClient.post('user/jabatan/aktif');
      if (response?.data?.data) {
        setUserJabatanData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user jabatan data:', error);
    }
  };

  const resendKinerja = async () => {
    try {
      const response = await apiClient.post('/user/kinerja/resend', {
        ...kinerja,
        note_ke_atasan: revisi,
      });
      Alert.alert('Sukses', response.data.data);
      // Emit event or trigger a callback if needed
    } catch (error) {
      Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const sendKinerja = async () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin? Anda tidak bisa mengubah data hingga atasan Anda memberi tanggapan!',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Kirim!',
          onPress: async () => {
            try {
              const response = await apiClient.get(`/user/kinerja/${kinerja.uuid}/send`);
              Alert.alert('Sukses', response.data.data);
              // Emit event or trigger a callback if needed
            } catch (error) {
              Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan');
            }
          },
        },
      ]
    );
  };

  const batalKinerja = async () => {
    try {
      const response = await apiClient.post(`/user/kinerja/${kinerja.uuid}/batal`);
      Alert.alert('Sukses', response.data.data);
      // Emit event or trigger a callback if needed
    } catch (error) {
      Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Card for Jabatan ID 1 */}
      {kinerja.userJabatanData?.id === 1 && (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            {kinerja.status === 2 && (
              <TouchableOpacity style={styles.dangerButton} onPress={batalKinerja}>
                <Text style={styles.buttonText}>BATAL KONTRAK</Text>
              </TouchableOpacity>
            )}
            {(kinerja.status === 0 || kinerja.status === 1) && (
              <TouchableOpacity style={styles.primaryButton} onPress={sendKinerja}>
                <Text style={styles.buttonText}>SETUJUI KONTRAK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Card for Status 0 and No Revisi */}
      {kinerja.status === 0 && !kinerja.revisi && (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <TouchableOpacity style={styles.primaryButton} onPress={sendKinerja}>
              <Text style={styles.buttonText}>KIRIM KE ATASAN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Card for Status Not 0 and Has Revisi */}
      {kinerja.status !== 0 && kinerja.revisi && (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Catatan Dari Atasan:</Text>
                <View style={styles.separator} />
                <Text style={styles.noteText}>"{kinerja.note_dari_atasan}"</Text>
                <Text style={styles.footerText}>
                  {userJabatanData.pimpinan.name}, {userJabatanData.pimpinan.nip}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Catatan Untuk Atasan:</Text>
                <View style={styles.separator} />
                {kinerja.note_ke_atasan ? (
                  <>
                    <Text style={styles.noteText}>"{kinerja.note_ke_atasan}"</Text>
                    <Text style={styles.footerText}>
                      {userJabatanData.pimpinan.name}, {userJabatanData.pimpinan.nip}
                    </Text>
                    <View style={styles.separator} />
                  </>
                ) : (
                  <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Ketik catatan Anda..."
                    value={revisi}
                    onChangeText={setRevisi}
                  />
                )}
              </View>
              <View style={styles.centerColumn}>
                <TouchableOpacity style={styles.dangerButton} onPress={resendKinerja}>
                  <Text style={styles.buttonText}>RESEND DATA</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    marginBottom: 10,
  },
  cardBody: {
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  centerColumn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteText: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
  },
  primaryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default KirimKontrak;