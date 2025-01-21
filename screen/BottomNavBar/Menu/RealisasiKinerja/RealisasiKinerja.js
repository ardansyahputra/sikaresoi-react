import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";

const RealisasiKinerja = ({ dataAktif, showAsPage, setBulanId, setTahunId, setUserJabatanId }) => {
  const [postData, setPostData] = useState({
    bulan_id: setBulanId,
    tahun_id: setTahunId,
    user_jabatan_id: setUserJabatanId || null,
  });

  const [listTahun, setListTahun] = useState([]);
  const [listBulan, setListBulan] = useState([]);
  const [listRealisasi, setListRealisasi] = useState({
    utama: [],
    tambahan: [],
  });

  const [kinerja, setKinerja] = useState({});
  const [selectedKirimRealisasi, setSelectedKirimRealisasi] = useState({});
  const [selectedFile, setSelectedFile] = useState('');
  const [showIndex, setShowIndex] = useState(null);

  const baseURL = 'http://192.168.60.230:8000/api/v1';
  const token = ''

  useEffect(() => {
    getTahun();
    getBulan();
    getRealisasi();
  }, []);

  const getTahun = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/tahun/show`,
      { headers: { 
        Authorization: 'Bearer ' + token, 
        Accept: 'application/json', } }
      );
      setListTahun(response.data.data);

      if (!postData.tahun_id) {
        const currentYear = new Date().getFullYear();
        const tahun = response.data.data.find((item) => item.tahun === currentYear) || { id: 2 };
        setPostData((prev) => ({ ...prev, tahun_id: tahun.id }));
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data', error.response?.data || error.message);
    }
  };

  const getBulan = async () => {
    try {
      const response = await axios.get(`${baseURL}/bulan/show`,
        { headers: { 
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
         } }
      );
      setListBulan(response.data.data);

      if (!postData.bulan_id) {
        const currentMonth = new Date().getMonth() + 1;
        const bulan = response.data.data.find((item) => item.id === currentMonth) || { id: 1 };
        setPostData((prev) => ({ ...prev, bulan_id: bulan.id }));
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data', error.response?.data || error.message);
    }
  };

  const getRealisasi = async () => {
    try {
      const response = await axios.post(`${baseURL}/user/kinerja/list/target/realisasi/index`,
        { headers: { 
          Authorization: 'Bearer ' + token, 
          Accept: 'application/json',
         } }, 
        postData);
      const data = response.data;

      if (data.kinerja) {
        setKinerja(data.kinerja);
        setListRealisasi({
          utama: data.utama,
          tambahan: data.tambahan,
        });

        const selected = data.kinerja.kirim_realisasi.find((a) => a.bulan_id === postData.bulan_id) || {
          status: 0,
          alert: { show: false },
        };
        setSelectedKirimRealisasi(selected);
      } else {
        setKinerja({ alert: { show: false } });
        setListRealisasi({ utama: [], tambahan: [] });
        setSelectedKirimRealisasi({ status: 0, alert: { show: false } });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data', error.response?.data || error.message);
    }
  };

  const saveRealisasi = async (uuid) => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(`${baseURL}/user/kinerja/list/target/realisasi/${uuid}/update`,
        { headers: { 
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
         } }, 
        formData);
      fetchRealisasi();
      Alert.alert('Success', 'Realisasi updated successfully');
    } catch (error) {
      fetchRealisasi();
      Alert.alert('Error', error.response?.data?.message || 'Failed to save realisasi');
      console.error('Error fetching data', error.response?.data || error.message);
    }
  };

  const resetRealisasi = async (data) => {
    try {
      const result = await Alert.alert(
        'Are you sure?',
        "You won't be able to revert this!",
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, reset it!',
            onPress: async () => {
              await axios.get(`${baseURL}/user/kinerja/list/target/realisasi/${data.uuid}/reset`,
                { headers: { Authorization: 'Bearer ' + token, 
                  Accept: 'application/json',
                 } },
              );
              fetchRealisasi();
              Alert.alert('Success', 'Realisasi reset successfully');
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      fetchRealisasi();
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset realisasi');
      console.error('Error fetching data', error.response?.data || error.message);
    }
  };

  const changePimpinan = async (kinerja, postData, pimpinan_id) => {
      try {
          const response = await axios.post(`${baseURL}/user/kinerja/list/target/realisasi/${kinerja.uuid}/updateJabatan`, 
            {
              headers: { 
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
               },
              fromBulan: postData.bulan_id,
              pimpinan_id: pimpinan_id,
            });
          console.log('Success:', response.data);
          // Handle the success response
      } catch (error) {
          console.error('Error:', error.response?.data?.message || error.message);
          // Handle the error
      }
  };

  const select2_pimpinan = async (searchTerm, page) => {
      try {
          const response = await axios.get(`${baseURL}/api/v1/user_master/show`, {
              headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json', 
              },
              params: {
                  search: searchTerm,
                  page: page,
              },
          });
          const data = response.data.data;
          const pagination = {
              more: (page * 30) < response.data.total,
          };
          return { data, pagination };
      } catch (error) {
          console.error('Error fetching pimpinan data:', error.response?.data?.message || error.message);
          return { data: [], pagination: {} }; // Return empty data on error
      }
  };

  const changeRealisasi = (data) => {
      data.kualitas = ((parseFloat(data.kuantitas) / parseFloat(data.target.kuantitas)) * 100);
      data.usulan_kualitas = ((parseFloat(data.usulan_kuantitas) / parseFloat(data.target.kuantitas)) * 100);
      return data;
  };

  const updateListKinerja = async (data, postData) => {
      try {
          data.bulan_id = postData.bulan_id;
          const response = await axios.post(`${baseURL}/user/kinerja/list/${data.uuid}/update`,
            { headers: { 
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
             } },
            data);
          console.log('Success:', response.data);
          // Handle success, maybe trigger getRealisasi()
      } catch (error) {
          console.error('Error:', error.response?.data?.message || error.message);
          // Handle error
      }
  };

  const updateTargetKinerja = async (data) => {
      try {
          const response = await axios.post(`${baseURL}/user/kinerja/list/target/${data.uuid}/update`,
            { headers: { 
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
             } },
            data);
          console.log('Success:', response.data);
          // Handle success, maybe trigger getRealisasi()
      } catch (error) {
          console.error('Error:', error.response?.data?.message || error.message);
          // Handle error
      }

      const previewBerkas = (data) => {
        if (data.path != null && data.path.split('.')[1] === 'pdf') {
            // You would use a PDF viewer in React Native, such as react-native-pdf
            console.log('Previewing PDF file:', data.path);
        } else {
            console.error('Only PDF files are supported');
        }
    };
    
    const deleteBerkas = async (uuid) => {
        Alert.alert(
            'Are you sure?',
            "You won't be able to revert this!",
            [
                { text: 'Cancel' },
                {
                    text: 'Yes, delete it!',
                    onPress: async () => {
                        try {
                            await axios.delete(`${baseURL}/user/kinerja/list/target/realisasi/file/${uuid}/delete`,
                              { headers: { 
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                              } }
                            );
                            console.log('File deleted successfully');
                            // Call a function to refresh or reload the data
                        } catch (error) {
                            console.error('Error deleting file:', error.response?.data?.message || error.message);
                        }
                    }
                }
            ]
        );
    };
    
    const deleteKegiatanBerkas = async (uuid) => {
        Alert.alert(
            'Are you sure?',
            "You won't be able to revert this!",
            [
                { text: 'Cancel' },
                {
                    text: 'Yes, delete it!',
                    onPress: async () => {
                        try {
                            await axios.delete(`${baseURL}/user/kinerja/list/kegiatan/target/realisasi/file/${uuid}/delete`,
                              { headers: { 
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                               } }
                            );
                            console.log('File deleted successfully');
                            // Call a function to refresh or reload the data
                        } catch (error) {
                            console.error('Error deleting file:', error.response?.data?.message || error.message);
                        }
                    }
                }
            ]
        );
    };
    
    const deleteUraianTambahan = async (data) => {
        const index = listRealisasi.tambahan.findIndex(a => a.id === data.id);
        console.log(data);
        Alert.alert(
            'Are you sure?',
            "You won't be able to revert this!",
            [
                { text: 'Cancel' },
                {
                    text: 'Yes, delete it!',
                    onPress: async () => {
                        try {
                            await axios.delete(`${baseURL}/user/kinerja/list/target/realisasi/${data.uuid}/delete_tambahan`,
                              { headers: { 
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                               } }
                            );
                            console.log('Uraian Tambahan deleted successfully');
                            // Update or reload the data
                        } catch (error) {
                            console.error('Error deleting Uraian Tambahan:', error.response?.data?.message || error.message);
                        }
                    }
                }
            ]
        );
    };
    
    const saveRealisasiKegiatan = async (uuid, formData) => {
        try {
            const response = await axios.post(`${baseURL}/user/kinerja/list/kegiatan/target/realisasi/${uuid}/update`, 
              { headers: { Authorization: 'Bearer ' + token } },
              formData);
            console.log('Realisasi Kegiatan updated:', response.data);
            // Handle success response and reset form fields if necessary
        } catch (error) {
            console.error('Error saving Kegiatan:', error.response?.data?.message || error.message);
            // Handle error
        }
    };
    
    const resetRealisasiKegiatan = async (data) => {
        Alert.alert(
            'Are you sure?',
            "You won't be able to revert this!",
            [
                { text: 'Cancel' },
                {
                    text: 'Yes, reset it!',
                    onPress: async () => {
                        try {
                            const response = await axios.post(`${baseURL}/user/kinerja/list/kegiatan/target/realisasi/${data.uuid}/reset`,
                              { headers: { 
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                               } }
                            );
                            console.log('Realisasi Kegiatan reset:', response.data);
                            // Handle success response
                        } catch (error) {
                            console.error('Error resetting Kegiatan:', error.response?.data?.message || error.message);
                            // Handle error
                        }
                    }
                }
            ]
        );
    };
    
    const changeRealisasiKegiatan = (data) => {
        data.kualitas = ((parseFloat(data.volume) / parseFloat(data.target_kegiatan.volume)) * 100);
        data.usulan_kualitas = ((parseFloat(data.usulan_volume) / parseFloat(data.target_kegiatan.volume)) * 100);
        return data;
    };
    
    const reload = () => {
        getRealisasi(bulan_id);
        console.log('Reloading data');
    };
    
    const mounted = async () => {
        await getTahun();
        await getBulan();
        getRealisasi();
    };
  };



  const renderRealisasiItem = ({ item, index }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.index}>{index + 1}</Text>
        <Text style={styles.description}>{item.target.list_kinerja.uraian.nm_uraian}</Text>
        <Text style={styles.biaya}>Rp. {item.target.list_kinerja.uraian.biaya.rupiah()}</Text>
        <Text style={styles.ak}>{item.target.list_kinerja.uraian.angka_kredit}</Text>
        <Text style={styles.kuantitas}>{item.target.kuantitas}</Text>
        <Text style={styles.kualitas}>{item.target.list_kinerja.kualitas}%</Text>
        <Text style={styles.bobot}>{item.target.list_kinerja.bobot}</Text>
        <Text style={styles.status}>{item.status ? 'Realisasi Telah Diisi' : 'Belum Mengisi Realisasi'}</Text>
        <TouchableOpacity onPress={() => setShowIndex(showIndex === item.uuid ? null : item.uuid)}>
          <Text style={styles.action}>REALISASI</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showAsPage && (
        <View style={styles.filterContainer}>
          <View style={styles.selectContainer}>
            <Text>Bulan:</Text>
            <TextInput
              style={styles.input}
              value={postData.bulan_id}
              onChangeText={(value) => setPostData({ ...postData, bulan_id: value })}
            />
          </View>
          <View style={styles.selectContainer}>
            <Text>Tahun:</Text>
            <TextInput
              style={styles.input}
              value={postData.tahun_id}
              onChangeText={(value) => setPostData({ ...postData, tahun_id: value })}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => {/* Show modal for Tugas Tambahan */}}>
            <Text style={styles.buttonText}>TUGAS TAMBAHAN</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <FlatList
          data={listRealisasi.utama}
          renderItem={renderRealisasiItem}
          keyExtractor={(item) => item.uuid}
          ListEmptyComponent={<Text style={styles.emptyText}>Data Kosong!</Text>}
        />
        <FlatList
          data={listRealisasi.tambahan}
          renderItem={renderRealisasiItem}
          keyExtractor={(item) => item.uuid}
          ListEmptyComponent={<Text style={styles.emptyText}>Data Kosong!</Text>}
        />
      </View>
      <Modal visible={!!selectedFile} onRequestClose={() => setSelectedFile('')}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Preview File</Text>
          <TouchableOpacity onPress={() => setSelectedFile('')} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          {/* Add PDF viewer or image viewer here */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  index: {
    width: 40,
  },
  description: {
    flex: 1,
  },
  biaya: {
    width: 80,
  },
  ak: {
    width: 40,
  },
  kuantitas: {
    width: 80,
  },
  kualitas: {
    width: 80,
  },
  bobot: {
    width: 40,
  },
  status: {
    width: 150,
  },
  action: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  
});

export default RealisasiKinerja;
