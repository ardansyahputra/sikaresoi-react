import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ion from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../../src/api/apiClient';

const Password = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const apiClient = useApiClient(); // Gunakan apiClient dari useApiClient

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Semua field harus diisi.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password Baru dan Konfirmasi Password tidak cocok.',
      });
      return;
    }

    try {
      // Lakukan permintaan API untuk mengganti password
      const response = await apiClient.post('/user/change_password', {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      // Cek apakah respon berhasil
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password berhasil diubah.',
        });
        // Reset form setelah berhasil
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Gagal mengubah password.',
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/poltekpol-barombong-bg.jpg')} // Ganti dengan gambar latar belakang yang diinginkan
      style={[styles.container, styles.backgroundStyle]}>
      <ScrollView contentContainerStyle={styles.formWrapper}>
        <Text style={styles.label}>Password Lama</Text>
        <TextInput
          style={[styles.input, {color: 'black'}]}
          secureTextEntry
          placeholder="Masukkan Password Lama"
          placeholderTextColor="#888"
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <Text style={styles.label}>Password Baru</Text>
        <TextInput
          style={[styles.input, {color: 'black'}]}
          secureTextEntry
          placeholder="Masukkan Password Baru"
          placeholderTextColor="#888"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Konfirmasi Password Baru</Text>
        <TextInput
          style={[styles.input, {color: 'black'}]}
          secureTextEntry
          placeholder="Konfirmasi Password Baru"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <View style={styles.buttonContent}>
              <FontAwesome name="check-square" size={20} color="white" />
              <Text style={styles.saveButtonText}>SIMPAN</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.buttonContent}>
              <Ion name="arrow-back-circle" size={20} color="white" />
              <Text style={styles.backButtonText}>KEMBALI</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundStyle: {
    alignItems: 'center',
  },
  formWrapper: {
    width: '85%',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 220,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#07ed13',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10, // Add spacing between buttons
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    backgroundColor: '#d9270f',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 10, // Add spacing between buttons
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Password;
