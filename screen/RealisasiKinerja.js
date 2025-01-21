import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { WebView } from 'react-native-webview';

const RealisasiKinerja = () => {
  // State management
  const [showAsPage, setShowAsPage] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [listRealisasi, setListRealisasi] = useState({
    utama: [],
    tambahan: []
  });
  const [showIndex, setShowIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [previewModal, setPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns
  const [months] = useState([
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    // ... other months
  ]);
  
  const [years] = useState([
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
  ]);

  const getRealisasi = async () => {
    setLoading(true);
    try {
      // API call implementation here
      // setListRealisasi(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch realization data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (data) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      
      // Handle file upload logic
      const newFiles = [...data.files, { path: result[0].name, uri: result[0].uri }];
      data.files = newFiles;
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Error picking document');
      }
    }
  };

  const renderRealizationForm = (data) => (
    <View style={styles.formContainer}>
      <View style={styles.formRow}>
        <Text style={styles.label}>USULAN KUANTITAS: <Text style={styles.required}>*</Text></Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={data.usulan_kuantitas}
            onChangeText={(text) => handleKuantitasChange(data, text)}
            keyboardType="numeric"
          />
          <Text style={styles.inputAddon}>{data.target?.list_kinerja?.uraian?.satuan}</Text>
        </View>
      </View>
      
      <View style={styles.formRow}>
        <Text style={styles.label}>USULAN KUALITAS: <Text style={styles.required}>*</Text></Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={data.usulan_kualitas}
            editable={false}
            keyboardType="numeric"
          />
          <Text style={styles.inputAddon}>%</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={() => handleFileUpload(data)}
      >
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.uploadButtonText}>Add Document</Text>
      </TouchableOpacity>

      {data.files?.map((file, index) => (
        <View key={index} style={styles.fileRow}>
          <Text style={styles.fileName}>{file.path}</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteFile(data, index)}
          >
            <Icon name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => handleSaveRealization(data)}
        >
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
        
        {data.status && (
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => handleResetRealization(data)}
          >
            <Icon name="refresh" size={16} color="#fff" />
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTaskRow = (data, index, type) => (
    <View style={styles.taskRow}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
      
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {data.target?.list_kinerja?.uraian?.nm_uraian}
        </Text>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Biaya:</Text>
            <Text style={styles.metricValue}>
              Rp. {data.target?.list_kinerja?.uraian?.biaya?.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>AK:</Text>
            <Text style={styles.metricValue}>
              {data.target?.list_kinerja?.uraian?.angka_kredit}
            </Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Kuantitas:</Text>
            <Text style={styles.metricValue}>
              {data.target?.kuantitas} {data.target?.list_kinerja?.uraian?.satuan}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[
            styles.status,
            data.status ? styles.statusComplete : styles.statusIncomplete
          ]}>
            {data.status ? 'Realisasi Telah Diisi' : 'Belum Mengisi Realisasi'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.realizationButton}
          onPress={() => setShowIndex(showIndex === data.uuid ? null : data.uuid)}
        >
          <Icon name="chevron-down" size={16} color="#fff" />
          <Text style={styles.buttonText}>REALISASI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {showAsPage && (
        <View style={styles.header}>
          <View style={styles.filterContainer}>
            <DropDownPicker
              open={monthOpen}
              value={selectedMonth}
              items={months}
              setOpen={setMonthOpen}
              setValue={setSelectedMonth}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
            />
            
            <DropDownPicker
              open={yearOpen}
              value={selectedYear}
              items={years}
              setOpen={setYearOpen}
              setValue={setSelectedYear}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
            />
          </View>
        </View>
      )}

      <View style={styles.content}>
        {listRealisasi.utama.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>JENIS TUGAS: UTAMA</Text>
            {listRealisasi.utama.map((data, index) => (
              <View key={data.uuid}>
                {renderTaskRow(data, index, 'utama')}
                {showIndex === data.uuid && renderRealizationForm(data)}
              </View>
            ))}
          </View>
        )}

        {listRealisasi.tambahan.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>JENIS TUGAS: TAMBAHAN</Text>
            {listRealisasi.tambahan.map((data, index) => (
              <View key={data.uuid}>
                {renderTaskRow(data, index, 'tambahan')}
                {showIndex === data.uuid && renderRealizationForm(data)}
              </View>
            ))}
          </View>
        )}
      </View>

      <Modal
        visible={previewModal}
        onRequestClose={() => setPreviewModal(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setPreviewModal(false)}
          >
            <Icon name="times" size={24} color="#000" />
          </TouchableOpacity>
          
          {selectedFile && (
            <WebView
              source={{ uri: selectedFile }}
              style={styles.webView}
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  dropdownContainer: {
    width: '45%',
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 4,
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  numberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metric: {
    marginRight: 15,
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 8,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusComplete: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusIncomplete: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  inputAddon: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 15,
    alignItems: 'flex-end',
  },
  webView: {
    flex: 1,
  },
});

export default RealisasiKinerja;