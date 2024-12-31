import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingJabatan = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentJabatan, setCurrentJabatan] = useState(null);
  const [formData, setFormData] = useState({
    detail_jabatan: '',
    detail_pimpinan: '',
    periode_mulai: new Date(),
    periode_selesai: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const baseURL = 'http://192.168.60.230:8000/api/v1';
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NTIyNDkzLCJleHAiOjE3MzU1NDg0MjYsIm5iZiI6MTczNTU0NDgyNiwianRpIjoicEcxem55bkJTQ0M2UTBmWSIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ofr1Pwng1T9hwbflfze9GzjFSnJX3JL3U79BLyaee8E';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${baseURL}/user/jabatan/index`,
        {},
        { headers: { Authorization: token } }
      );
      setData(response.data.data || []);
    } catch (err) {
      setError('Gagal memuat data, silakan coba lagi.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSwitch = async (id) => {
    const jabatanToUpdate = data.find((item) => item.id === id);
    if (!jabatanToUpdate) return;

    const updatedStatus = !jabatanToUpdate.aktif;

    try {
      await axios.get(
        `${baseURL}/user/jabatan/${id}/changeAktif`,
        { headers: { Authorization: token } }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, aktif: updatedStatus } : item
        )
      );
    } catch (error) {
      setError('Gagal mengubah status.');
      console.error(error.response?.data || error.message);
    }
  };

  const deleteJabatan = async (id) => {
    try {
      await axios.delete(
        `${baseURL}/user/jabatan/${id}/delete`,
        { headers: { Authorization: token } }
      );
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      setError('Gagal menghapus data.');
      console.error(error.response?.data || error.message);
    }
  };

  const openModal = (jabatan = null) => {
    setIsEditMode(!!jabatan);
    setCurrentJabatan(jabatan);
    setFormData({
      detail_jabatan: jabatan?.detail_jabatan || '',
      detail_pimpinan: jabatan?.detail_pimpinan || '',
      periode_mulai: jabatan?.periode_mulai ? new Date(jabatan.periode_mulai) : new Date(),
      periode_selesai: jabatan?.periode_selesai ? new Date(jabatan.periode_selesai) : new Date(),
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setFormData({
      detail_jabatan: '',
      detail_pimpinan: '',
      periode_mulai: new Date(),
      periode_selesai: new Date(),
    });
    setCurrentJabatan(null);
  };

  const handleSave = async () => {
    setError('');
    const endpoint = isEditMode
      ? `${baseURL}/user/jabatan/${currentJabatan.id}/update`
      : `${baseURL}/user/jabatan/store`;

    try {
      setLoading(true);
      const response = await axios.post(
        endpoint,
        formData,
        { headers: { Authorization: token } }
      );

      if (isEditMode) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === currentJabatan.id ? { ...item, ...formData } : item
          )
        );
      } else {
        setData((prevData) => [...prevData, response.data.data]);
      }
      closeModal();
    } catch (error) {
      setError('Gagal menyimpan data.');
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.detail_jabatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jabatan</Text>
        <TouchableOpacity onPress={() => openModal()}>
          <Ionicons name="add" size={24} color="#FAFAFA" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari jabatan..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD600" />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <Text>{item.detail_jabatan}</Text>
                <Switch
                  value={item.aktif}
                  onValueChange={() => toggleSwitch(item.id)}
                />
              </TouchableOpacity>
              {expandedId === item.id && (
                <View>
                  <Text>Periode: {item.periode_mulai} - {item.periode_selesai}</Text>
                  <TouchableOpacity onPress={() => openModal(item)}>
                    <Ionicons name="create" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteJabatan(item.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Modal */}
      {modalVisible && (
        <Modal transparent visible={modalVisible}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Detail Jabatan"
              value={formData.detail_jabatan}
              onChangeText={(text) =>
                setFormData({ ...formData, detail_jabatan: text })
              }
            />
            <DatePicker
              date={formData.periode_mulai}
              onDateChange={(date) =>
                setFormData({ ...formData, periode_mulai: date })
              }
            />
            <DatePicker
              date={formData.periode_selesai}
              onDateChange={(date) =>
                setFormData({ ...formData, periode_selesai: date })
              }
            />
            <TouchableOpacity onPress={handleSave}>
              <Text>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text>Batal</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFD600',
  },
  backButton: {
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAFAFA',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FAFAFA',
    marginLeft: 5,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFD600',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
  },
  numberCell: {
    width: 50,
  },
  nameCell: {
    flex: 2,
  },
  tableStatusCell: {
    width: 100,
  },
  expandIconCell: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowHeader: {
    flexDirection: 'row',
    padding: 10,
  },
  tableCell: {
    fontSize: 14,
  },
  statusCellContainer: {
    justifyContent: 'center',
  },
  statusCell: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 14,
    color: '#fff',
  },
  expandedContent: {
    paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  expandedText: {
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#FFD600',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
  },
});

export default SettingJabatan;
