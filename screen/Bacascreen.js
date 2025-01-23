import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AttendanceForm = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    dari: '',
    kepada: '',
    jenisTeguran: '',
    tanggalPelanggaran: '',
    potongan: '',
    pesan: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://192.168.60.137:8000/api/v1/teguran/e96a8fba-275f-4e6c-922e-5a4ec1f01f28/baca',
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE0Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM3MzM2ODYwLCJleHAiOjE3MzczNTkwNzMsIm5iZiI6MTczNzM1NTQ3MywianRpIjoiUXJnSm54aWpTTUZZbU5saSIsInN1YiI6OSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.LSQ6wGmjdxY0muPLzv-ecT98A5pxm8pZiNDxAhuWwRs',
          },
        }
      );
      const data = response.data.data;

      setFormData({
        dari: data.from_user,
        kepada: data.user,
        jenisTeguran: data.jenis,
        tanggalPelanggaran: data.tgl_pelanggaran,
        potongan: data.potongan,
        pesan: data.pesan,
      });
    } catch (error) {
      console.error('Error fetching data', error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <View style={styles.formField}>
              <Text style={styles.label}>Dari</Text>
              <View style={styles.input}>
                <Text>{formData.dari?.name}</Text>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Kepada</Text>
              <View style={styles.input}>
                <Text>{formData.kepada?.name}</Text>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Jenis Teguran</Text>
              <View style={styles.input}>
                <Text>{formData.jenisTeguran}</Text>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Tanggal Pelanggaran</Text>
              <View style={styles.input}>
                <Text>{formData.tanggalPelanggaran}</Text>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Potongan</Text>
              <View style={styles.inputRow}>
                <Text>{formData.potongan}</Text>
                <Text style={styles.percentageSymbol}>%</Text>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Pesan</Text>
              <View style={styles.messageInput}>
                <Text>{formData.pesan}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>TUTUP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  percentageInput: {
    flex: 1,
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
});

export default AttendanceForm;
