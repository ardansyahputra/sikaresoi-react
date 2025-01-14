import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Toast from 'react-native-toast-message';

const Password = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
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
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password berhasil diubah.',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* ScrollView to allow content to scroll if needed */}
      <ScrollView contentContainerStyle={styles.formWrapper}>
        {/* Old Password Input */}
        <Text style={styles.label}>Password Lama</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Masukkan Password Lama"
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        {/* New Password Input */}
        <Text style={styles.label}>Password Baru</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Masukkan Password Baru"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        {/* Confirm New Password Input */}
        <Text style={styles.label}>Konfirmasi Password Baru</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Konfirmasi Password Baru"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SIMPAN</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast Message */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 300,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden', // Ensure content inside header stays within the bounds
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
formWrapper: {
  width: '90%',
  padding: 30,
  backgroundColor: '#fff',
  borderRadius: 5,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  marginTop: 210,  // Adjusted to move the form upward closer to the header
  marginLeft: 20,
  marginBottom: 60,  // Reduced the bottom margin to keep it within the screen
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
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Password;
