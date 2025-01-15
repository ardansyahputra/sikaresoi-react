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
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const SettingJabatan = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentJabatan, setCurrentJabatan] = useState(null);
  const [formData, setFormData] = useState({
    detail_jabatan: '',
    detail_pimpinan: '',
    periode: '',
  });
  const [loading, setLoading] = useState(false);

  const baseURL = 'http://192.168.61.230:8000/api/v1';
  const token = 'Bearer token';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/user/jabatan/index`,
        {},
        { headers: { Authorization: token } }
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jabatan data', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = async (id) => {
    const jabatanToUpdate = data.find((item) => item.id === id);
    if (!jabatanToUpdate) return;

    const updatedStatus = !jabatanToUpdate.aktif;

    try {
      await axios.patch(
        `${baseURL}/user/jabatan/${id}/changeAktif`,
        { aktif: updatedStatus },
        { headers: { Authorization: token } }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, aktif: updatedStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating jabatan status', error);
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
      console.error('Error deleting jabatan', error);
    }
  };

  const openModal = (jabatan = null) => {
    setIsEditMode(!!jabatan);
    setCurrentJabatan(jabatan);
    setFormData({
      detail_jabatan: jabatan?.detail_jabatan || '',
      detail_pimpinan: jabatan?.detail_pimpinan || '',
      periode: jabatan?.periode || '',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setFormData({ detail_jabatan: '', detail_pimpinan: '', periode: '' });
    setCurrentJabatan(null);
  };

  const handleSave = async () => {
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
      console.error('Error saving jabatan', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.aktif && styles.cardActive]}>
      <View style={styles.rowBetween}>
        <View style={styles.textContainer}>
          <Text style={[styles.jabatan, item.aktif && styles.textActive]}>
            {item.detail_jabatan}
          </Text>
          <Text style={[styles.pimpinan, item.aktif && styles.textActive]}>
            {item.detail_pimpinan.replace(/<br>/g, '\n')}
          </Text>
          <Text style={[styles.periode, item.aktif && styles.textActive]}>
            {item.periode}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#BDBDBD', true: '#A1887F' }}
          thumbColor={item.aktif ? '#FFD600' : '#FAFAFA'}
          onValueChange={() => toggleSwitch(item.id)}
          value={!!item.aktif}
        />
      </View>
      <View style={[styles.rowBetween, styles.buttonRow]}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openModal(item)}
        >
          <Icon name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteJabatan(item.id)}
        >
          <Icon name="delete" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jabatan</Text>
      </View>

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari jabatan..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Icon name="add" size={24} color="#FAFAFA" />
          <Text style={styles.buttonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* List Data */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFD600" />
      ) : (
        <FlatList
          data={data.filter((item) =>
            item.detail_jabatan.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {/* Modal Tambah/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Detail Jabatan"
              value={formData.detail_jabatan}
              onChangeText={(text) => setFormData({ ...formData, detail_jabatan: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Detail Pimpinan"
              value={formData.detail_pimpinan}
              onChangeText={(text) => setFormData({ ...formData, detail_pimpinan: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Periode"
              value={formData.periode}
              onChangeText={(text) => setFormData({ ...formData, periode: text })}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSave} style={styles.addButton}>
                <Text style={styles.buttonText}>{isEditMode ? 'Update' : 'Simpan'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    padding: 16,
  },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#2563EB", paddingHorizontal: 16, paddingVertical: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, elevation: 5, marginBottom: 20, width: '100%',  },
  backButton: {
    marginRight: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    color: '#424242',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD600',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items at the top to prevent overlap
    flexWrap: 'wrap', // Allows wrapping if space is needed
  },
  
  textContainer: {
    flex: 1, // Ensures that the text container takes up available space
  },
  
  jabatan: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    flexWrap: 'wrap', // Allow text to wrap if it's too long
    flex: 1, // Ensures it takes up available space without pushing the switch button out of view
  },
  
  switchContainer: {
    justifyContent: 'center', // Ensure the switch is centered vertically
  },

  pimpinan: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  periode: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ACC1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },

  headerImage: {
    size: 10,
    width: 200,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },
  
  headerContent: {
    flex:1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAFAFA', // Warna teks
    marginTop: 10,
    marginBottom: 5,
  },

  headerSubtitle: { color: "#D1D5DB", marginTop: 4 },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    color: '#424242',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#FFD600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
  },
  

});

export default SettingJabatan;
    

///// VERSI 2 /////
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

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

  const baseURL = 'http://192.168.60.230:8000/api/v1'
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM1NTIyNDkzLCJleHAiOjE3MzU1Mjc4NTcsIm5iZiI6MTczNTUyNDI1NywianRpIjoiaVYzQU1HcnZSN3dyM0pLbyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.NYZeEM4CpgDND4GDWyChJf1Hb1ZOdTnYVuNPoU6kIVI.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjIzMDo4MDAwXC9hcGlcL3YxXC9hdXRoXC9sb2dpbiIsImlhdCI6MTczNTUyMjQ5MywiZXhwIjoxNzM1NTI2MDkzLCJuYmYiOjE3MzU1MjI0OTMsImp0aSI6Im0wV0FMWmN5TWVFeEd4RFIiLCJzdWIiOjcsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.bN9_euaDXSWkRzWQKgTju6fGZrnar5C4_rfyWNsQBzI';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        ` ${baseURL}/user/jabatan/index`,
        {},
        { headers: { Authorization: token } }
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jabatan data', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = async (id) => {
    const jabatanToUpdate = data.find((item) => item.id === id);
    if (!jabatanToUpdate) return;

    const updatedStatus = !jabatanToUpdate.aktif;

    try {
      await axios.get(
        `${baseURL}/user/jabatan/${id}/changeAktif`,
        { aktif: updatedStatus },
        { headers: { Authorization: token } }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, aktif: updatedStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating jabatan status', error);
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
      console.error('Error deleting jabatan', error);
    }
  };

  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date });
  };

  const openModal = (jabatan = null) => {
    setIsEditMode(!!jabatan);
    setCurrentJabatan(jabatan);
    setFormData({
      detail_jabatan: jabatan?.detail_jabatan || '',
      detail_pimpinan: jabatan?.detail_pimpinan || '',
      periode: jabatan?.periode ? new Date(jabatan.periode) : new Date(),
    });
    setModalVisible(true);
    console.log('Periode:', jabatan?.periode);
  };

  const closeModal = () => {
    setModalVisible(false);
    setFormData({
      detail_jabatan: '',
      detail_pimpinan: '',
      periode: new Date(),
    });
    setCurrentJabatan(null);
  };

  const handleSave = async () => {
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
      console.error('Error saving jabatan', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.aktif && styles.cardActive]}>
      <View style={styles.rowBetween}>
        <View style={styles.textContainer}>
          <Text style={[styles.jabatan, item.aktif && styles.textActive]}>
            {item.detail_jabatan}
          </Text>
          <Text style={[styles.pimpinan, item.aktif && styles.textActive]}>
            {item.detail_pimpinan.replace(/<br>/g, '\n')}
          </Text>
          <Text style={[styles.periode, item.aktif && styles.textActive]}>
            {item.periode}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#BDBDBD', true: '#A1887F' }}
          thumbColor={item.aktif ? '#FFD600' : '#FAFAFA'}
          onValueChange={() => toggleSwitch(item.id)}
          value={!!item.aktif}
        />
      </View>
      <View style={[styles.rowBetween, styles.buttonRow]}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openModal(item)}
        >
          <Icon name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteJabatan(item.id)}
        >
          <Icon name="delete" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jabatan</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari jabatan..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Icon name="add" size={24} color="#FAFAFA" />
          <Text style={styles.buttonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD600" />
      ) : (
        <FlatList
          data={data.filter((item) =>
            item.detail_jabatan.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

    <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Detail Jabatan"
                value={formData.detail_jabatan}
                onChangeText={(text) =>
                  setFormData({ ...formData, detail_jabatan: text })
                }
                style={styles.input}
              />
              <Picker
                selectedValue={formData.detail_pimpinan}
                style={styles.input}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, detail_pimpinan: itemValue })
                }
              >
                <Picker.Item label="Pimpinan 1" value="pimpinan_1" />
                <Picker.Item label="Pimpinan 2" value="pimpinan_2" />
              </Picker>
              <DatePicker
                date={formData.periode_mulai}
                onDateChange={(date) => handleDateChange('periode_mulai', date)}
              />
              <DatePicker
                date={formData.periode_selesai}
                onDateChange={(date) => handleDateChange('periode_selesai', date)}
              />
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    padding: 16,
  },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#2563EB", paddingHorizontal: 16, paddingVertical: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, elevation: 5, marginBottom: 20, width: '100%',  },
  backButton: {
    marginRight: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    color: '#424242',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD600',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items at the top to prevent overlap
    flexWrap: 'wrap', // Allows wrapping if space is needed
  },
  
  textContainer: {
    flex: 1, // Ensures that the text container takes up available space
  },
  
  jabatan: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    flexWrap: 'wrap', // Allow text to wrap if it's too long
    flex: 1, // Ensures it takes up available space without pushing the switch button out of view
  },
  
  switchContainer: {
    justifyContent: 'center', // Ensure the switch is centered vertically
  },

  pimpinan: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  periode: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ACC1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },

  headerImage: {
    size: 10,
    width: 200,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },
  
  headerContent: {
    flex:1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAFAFA', // Warna teks
    marginTop: 10,
    marginBottom: 5,
  },

  headerSubtitle: { color: "#D1D5DB", marginTop: 4 },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    color: '#424242',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#FFD600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
  },
  

});



export default SettingJabatan;
