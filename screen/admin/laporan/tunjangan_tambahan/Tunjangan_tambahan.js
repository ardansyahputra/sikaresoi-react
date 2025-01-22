import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Switch, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Linking } from 'react-native';
import useApiClient from '../../../../src/api/apiClient';

export default function TugasTambahan({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [taxReduction, setTaxReduction] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');  // Set default to 'ALL'
  const [leftSignature, setLeftSignature] = useState('');
  const [rightSignature, setRightSignature] = useState('');
  const [signatures, setSignatures] = useState([]); // State to store the list of signatures
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedAllowance, setSelectedAllowance] = useState(null); // Tunjangan Ke selection
  const [isP2Pure, setIsP2Pure] = useState(false); // Switch for P2 Murni
  const [percentage, setPercentage] = useState(''); // Input for Persentase
  const apiClient = useApiClient();  // Invoke the hook here

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await apiClient(`/user_master/show`);  // Use the environment variable here
        const data = response.data || await response.json(); // Try fetching as JSON if necessary

        console.log('Received Data:', data);

        if (data && data.res.code === 200) {
          const signatureData = data.data.map(user => ({
            label: user.name,
            value: user.id,
          }));
          setSignatures(signatureData);
        }
      } catch (error) {
        console.error('Error fetching signature data:', error);
      }
    };

    fetchSignatures();
  }, []);

  const monthData = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 },
  ];

  const yearData = [
    { label: '2020', value: '2020' },
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  const taxReductionData = [
    { label: 'Progresif', value: 'PROGRESIF' },
    { label: 'Final', value: 'FINAL' },
  ];

  const typeData = [
    { label: 'P1', value: 'P1' },
    { label: 'P2', value: 'P2' },
    { label: 'P1 & P2', value: 'ALL' },
  ];

  const allowanceData = [
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: 'Insentif', value: 'INSENTIF' },
  ];

  const handleDownload = async () => {
    // Log all state values to debug
    console.log('selectedMonth:', selectedMonth);
    console.log('selectedYear:', selectedYear);
    console.log('taxReduction:', taxReduction);
    console.log('selectedType:', selectedType);
    console.log('leftSignature:', leftSignature);
    console.log('rightSignature:', rightSignature);
    console.log('selectedAllowance:', selectedAllowance);
    console.log('percentage:', percentage);
    
    // Check if all required fields are filled
    if (!selectedMonth || !selectedYear || !taxReduction || !selectedType || !leftSignature || !rightSignature || !selectedAllowance || !percentage) {
      setModalMessage('Harap lengkapi semua pilihan!');
      setIsModalVisible(true);
      return;
    }
  
    // Construct the URL with parameters
    const downloadUrl = `http://192.168.60.163:8000/report/admin/tunjangan_tambahan_gaji/${selectedMonth}/${selectedYear}?p=${taxReduction}&kiri=${leftSignature}&kanan=${rightSignature}&tk=${selectedAllowance}&persentase=${percentage}&p2murni=${isP2Pure}`;
    
    // Open the URL in the browser
    Linking.openURL(downloadUrl).catch(() => {
      setModalMessage('Gagal membuka URL!');
      setIsModalVisible(true);
    });
  };
  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Report Tunjangan Tambahan</Text>
          </View>
          <View style={styles.cardDivider}></View>

          <Text style={styles.label}>Pilih Bulan *</Text>
          <Dropdown
            style={styles.dropdown}
            data={monthData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Bulan"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
          />

          <Text style={styles.label}>Pilih Tahun *</Text>
          <Dropdown
            style={styles.dropdown}
            data={yearData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tahun"
            value={selectedYear}
            onChange={item => setSelectedYear(item.value)}
          />

          <Text style={styles.label}>Potongan Pajak *</Text>
          <Dropdown
            style={styles.dropdown}
            data={taxReductionData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Potongan Pajak"
            value={taxReduction}
            onChange={item => setTaxReduction(item.value)}
          />

          <Text style={styles.label}>Tunjangan Ke *</Text>
          <Dropdown
            style={styles.dropdown}
            data={allowanceData}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tunjangan Ke"
            value={selectedAllowance}
            onChange={item => setSelectedAllowance(item.value)}
          />

          <Text style={styles.label}>P2 Murni</Text>
          <Switch
            value={isP2Pure}
            onValueChange={setIsP2Pure}
            trackColor={{ false: '#767577', true: '#28c4ac' }}
            thumbColor={isP2Pure ? '#f4f3f4' : '#f4f3f4'}
          />

          <Text style={styles.label}>Persentase :</Text>
          <TextInput
            style={styles.input}
            value={percentage}
            onChangeText={setPercentage}
            keyboardType="numeric"
            placeholder="Masukkan persentase"
          />

          <Text style={styles.label}>Tanda Tangan Kiri *</Text>
          <Dropdown
            style={styles.dropdown}
            data={signatures}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tanda Tangan Kiri"
            value={leftSignature}
            onChange={item => setLeftSignature(item.value)}
          />

          <Text style={styles.label}>Tanda Tangan Kanan *</Text>
          <Dropdown
            style={styles.dropdown}
            data={signatures}
            labelField="label"
            valueField="value"
            placeholder="Pilih Tanda Tangan Kanan"
            value={rightSignature}
            onChange={item => setRightSignature(item.value)}
          />

          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.buttonText}>Download Laporan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
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
  container: { flex: 1, backgroundColor: '#E7E9F1' },
  header: {
    backgroundColor: '#FFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  contentContainer: { padding: 10 },
  cardContainer: { backgroundColor: '#FFF', borderRadius: 8, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  cardDivider: { borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginVertical: 15 },
  label: { fontSize: 14, color: '#333', marginBottom: 5 },
  dropdown: { borderWidth: 1, borderColor: '#E0E0E0', padding: 10, borderRadius: 8, marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', padding: 10, borderRadius: 8, marginBottom: 15 },
  downloadButton: { backgroundColor: '#28c4ac', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, alignItems: 'center' },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  closeButton: { backgroundColor: '#28c4ac', padding: 10, borderRadius: 8 },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
});
