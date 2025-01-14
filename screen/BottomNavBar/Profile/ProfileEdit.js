import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import AwesomeAlert from 'react-native-awesome-alerts';

const ProfileEdit = () => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Pembina (IV/a)');
  const [items, setItems] = useState([
    { label: 'PPPK (X/-)', value: 'PPPK (X/-)' },
    { label: 'PPPK (VII/-)', value: 'PPPK (VII/-)' },
    { label: 'PPPK (XI/-)', value: 'PPPK (XI/-)' },
    { label: 'Pembina (VI/a)', value: 'Pembina (VI/a)' },
    { label: 'Pembina Tingkat 1 (IV/b)', value: 'Pembina Tingkat 1 (IV/b)' },
    { label: 'Pembina Utama Muda (IV/c)', value: 'Pembina Utama Muda (IV/c)' },
    { label: 'Pembina Utama Madya (IV/d)', value: 'Pembina Utama Madya (IV/d)' },
    { label: 'Pembina Utama (IV/e)', value: 'Pembina Utama (IV/e)' },
    { label: 'Penata Muda (III/a)', value: 'Penata Muda (III/a)' },
    { label: 'Pembina Muda (III/a)', value: 'Pembina Muda (III/a)' },
    { label: 'Pembina Muda Tingkat 1 (III/b)', value: 'Pembina Muda Tingkat 1 (III/b)' },
    { label: 'Penata (III/c)', value: 'Penata (III/c)' },
    { label: 'Penata Tingkat 1 (III/d)', value: 'Penata Tingkat 1 (III/d)' },
    { label: 'Pengatur Muda (II/a)', value: 'Pengatur Muda (II/a)' },
    { label: 'Pengatur Muda Tingkat 1 (II/b)', value: 'Pengatur Muda Tingkat 1 (II/b)' },
    { label: 'Pengatur (II/c)', value: 'Pengatur (II/c)' },
    { label: 'Pengatur Tingkat 1 (II/d)', value: 'Pengatur Tingkat 1 (II/d)' },
    { label: 'Juru Muda (I/a)', value: 'Juru Muda (I/a)' },
    { label: 'Juru Muda Tingkat 1 (I/b)', value: 'Juru Muda Tingkat 1 (I/b)' },
    { label: 'Juru (I/c)', value: 'Juru (I/c)' },
    { label: 'Juru Tingkat (I/d)', value: 'Juru Tingkat (I/d)' },
  ]);
  const [nip, setNip] = useState('19740714 200502 1 007');
  const [name, setName] = useState('OBET LUMALAN BIJANG, S.Si.T.M.Ap,M.Mar');
  const [imageUri, setImageUri] = useState(require('../../assets/300-14.jpg'));
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    if (!selectedValue) {
      Toast.show({
        type: 'error',
        text1: 'Gagal Menyimpan',
        text2: 'Pangkat/Gol. Ruang belum dipilih.',
      });
      return;
    }
    Toast.show({
      type: 'success',
      text1: 'Data Disimpan!',
      text2: `NIP: ${nip}\nNama: ${name}\nPangkat/Gol. Ruang: ${selectedValue}`,
    });
  };

  const confirmSave = () => {
    setShowAlert(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Toast.show({
          type: 'info',
          text1: 'Pemilihan Dibatalkan',
        });
      } else if (response.errorMessage) {
        Toast.show({
          type: 'error',
          text1: 'Terjadi Kesalahan',
          text2: response.errorMessage,
        });
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri({ uri });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Terjadi Kesalahan',
          text2: 'Gagal memilih gambar.',
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Foto Profil */}

      {/* Form Input */}
      <View style={styles.formWrapper}>
        <Text style={styles.label}>Nama</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={isEditing}
        />

        <Text style={styles.label}>NIP / NRP</Text>
        <TextInput
          value={nip}
          onChangeText={setNip}
          style={styles.input}
          editable={isEditing}
        />

        <Text style={styles.label}>Pangkat/Gol. Ruang</Text>
        <DropDownPicker
          open={open}
          value={selectedValue}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedValue}
          setItems={setItems}
          style={styles.select}
          dropDownContainerStyle={styles.dropDownContainer}
          disabled={!isEditing}
          scrollViewProps={{
            showsVerticalScrollIndicator: true, // Menampilkan indikator scroll
            nestedScrollEnabled: true, // Memungkinkan scroll dalam scroll
          }}
        />

        <TouchableOpacity
          style={[styles.saveButton, isEditing ? styles.saveActive : styles.saveInactive]}
          onPress={isEditing ? confirmSave : handleEdit}
        >
          <Text style={styles.saveButtonText}>{isEditing ? 'SIMPAN' : 'UBAH'}</Text>
        </TouchableOpacity>
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan perubahan ini?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Batal"
        confirmText="Ya"
        confirmButtonColor="#007bff"
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => {
          setShowAlert(false);
          handleSave();
        }}
      />

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Set to transparent background
    padding: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
  },
  editIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formWrapper: {
    width: '90%',
    backgroundColor: '#fff', // You can also make this transparent if needed by changing to transparent
    padding: 20,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  select: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dropDownContainer: {
    borderColor: '#ddd',
    maxHeight: 200, // Batasan tinggi dropdown
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveActive: {
    backgroundColor: '#007bff',
  },
  saveInactive: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileEdit;
