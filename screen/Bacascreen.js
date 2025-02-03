import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useApiClient from '../src/api/apiClient';

const initialFormState = {
  dari: '',
  kepada: '',
  jenisTeguran: '',
  tanggalPelanggaran: '',
  potongan: '',
  pesan: '',
};

const FormField = ({ label, children }) => (
  <View style={styles.formField}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const FormInput = ({ children }) => (
  <View style={styles.input}>
    <Text>{children}</Text>
  </View>
);

const AttendanceForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const apiClient = useApiClient();

  const fetchWarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('teguran/index_user');
      
      if (!response?.data?.data) {
        throw new Error('Data teguran tidak ditemukan');
      }

      setWarnings(response.data.data);
      
      // Jika ada data, pilih UUID pertama secara default
      if (response.data.data.length > 0) {
        setSelectedUuid(response.data.data[0].uuid);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
      setError('Gagal mengambil daftar teguran');
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const fetchWarningDetail = useCallback(async (uuid) => {
    if (!uuid) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`teguran/${uuid}/baca`);
      
      if (!response?.data?.data) {
        throw new Error('Detail teguran tidak ditemukan');
      }

      const data = response.data.data;
      setFormData({
        dari: data.from_user || '',
        kepada: data.user || '',
        jenisTeguran: data.jenis || '',
        tanggalPelanggaran: data.tgl_pelanggaran || '',
        potongan: data.potongan || '',
        pesan: data.pesan || '',
      });
    } catch (error) {
      console.error('Error fetching warning detail:', error);
      setError('Gagal mengambil detail teguran');
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  useEffect(() => {
    if (selectedUuid) {
      fetchWarningDetail(selectedUuid);
    }
  }, [selectedUuid, fetchWarningDetail]);

  const handleWarningSelect = (uuid) => {
    setSelectedUuid(uuid);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRetry = () => {
    fetchWarnings();
  };

  const renderWarningItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.warningItem,
        selectedUuid === item.uuid && styles.selectedWarning
      ]}
      onPress={() => handleWarningSelect(item.uuid)}
    >
      <Text style={styles.warningText}>
        Teguran: {item.jenis} - {item.tgl_pelanggaran}
      </Text>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>COBA LAGI</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleClose}
        >
          <Text style={styles.secondaryButtonText}>KEMBALI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('./assets/images/sikaresoi.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ff4081" />
        </View>
      ) : (
        <>
          <View style={styles.warningsList}>
            <Text style={styles.warningsTitle}>Daftar Teguran</Text>
            <FlatList
              data={warnings}
              renderItem={renderWarningItem}
              keyExtractor={item => item.uuid}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.form}>
            <FormField label="Dari">
              <FormInput>{formData.dari?.name || '-'}</FormInput>
            </FormField>

            <FormField label="Kepada">
              <FormInput>{formData.kepada?.name || '-'}</FormInput>
            </FormField>

            <FormField label="Jenis Teguran">
              <FormInput>{formData.jenisTeguran || '-'}</FormInput>
            </FormField>

            <FormField label="Tanggal Pelanggaran">
              <FormInput>{formData.tanggalPelanggaran || '-'}</FormInput>
            </FormField>

            <FormField label="Potongan">
              <View style={styles.inputRow}>
                <Text>{formData.potongan || '0'}</Text>
                <Text style={styles.percentageSymbol}>%</Text>
              </View>
            </FormField>

            <FormField label="Pesan">
              <View style={styles.messageInput}>
                <Text>{formData.pesan || '-'}</Text>
              </View>
            </FormField>

            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>TUTUP</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: 16,
  },
  warningsList: {
    padding: 16,
  },
  warningsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  warningItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedWarning: {
    backgroundColor: '#ff4081',
  },
  warningText: {
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
  percentageSymbol: {
    marginLeft: 4,
    color: '#666',
  },
  messageInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    minHeight: 80,
  },
  button: {
    backgroundColor: '#ff4081',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ff4081',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#ff4081',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4081',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AttendanceForm;