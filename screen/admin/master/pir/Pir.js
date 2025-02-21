import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient'; // Custom API hook for making requests

export default function IndexRupiah({navigation}) {
  const [pir, setPir] = useState(0);
  const [updatedAt, setUpdatedAt] = useState('-');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const apiClient = useApiClient(); // Your custom hook to handle API requests

  useEffect(() => {
    const getPir = async () => {
      try {
        const response = await apiClient(`/pir/edit`);
        const data = response.data || (await response.json());
        if (data && data.res.code === 200) {
          setPir(data.data.pir);
          setUpdatedAt(data.data.updated_at);
        }
      } catch (error) {
        console.error('Error fetching PIR:', error);
        setModalMessage('Failed to fetch PIR data.');
        setIsModalVisible(true);
      }
    };
    getPir();
  }, []);

  const handleSave = async () => {
    if (pir === '' || pir === 0) {
      setModalMessage('Please enter a valid value for PIR.');
      setIsModalVisible(true);
      return;
    }

    try {
      const response = await apiClient.post(`/pir/update`, {pir});
      if (response.data && response.data.res.code === 200) {
        setPir(response.data.data.pir);
        setUpdatedAt(response.data.data.updated_at);
        setModalMessage(response.data.message);
      }
    } catch (error) {
      setModalMessage('Failed to update PIR.');
      console.error('Error updating PIR:', error);
    }
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Poin Indeks Rupiah</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Poin Indeks Rupiah</Text>
          <TextInput
            style={styles.input}
            value={String(pir)}
            keyboardType="numeric"
            onChangeText={text =>
              setPir(text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))
            }
            placeholder="PIR"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
          <Text style={styles.updatedAt}>Last Update: {updatedAt}</Text>
        </View>
      </View>

      {/* Modal for showing error/success messages */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>

      {/* Modal for showing error/success messages */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
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
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    marginHorizontal: 10,
    marginTop: 60,
    width: 387,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    padding: 16,
    marginTop: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  updatedAt: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
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
  headerTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 20,
    marginHorizontal: 10,
    marginTop: 60,
    width: 387,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    padding: 16,
    marginTop: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  updatedAt: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#EE4B2B',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#EE4B2B',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
