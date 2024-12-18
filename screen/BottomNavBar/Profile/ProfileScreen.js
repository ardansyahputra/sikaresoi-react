import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [formRequest, setFormRequest] = useState({
    nip: '',
    name: '',
    pangkat_id: '',
    photo_url: '',
  });
  const [pangkats, setPangkats] = useState([]);
  const [imageUri, setImageUri] = useState(null);

  const Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjIuMTAyOjgwMDBcL2FwaVwvdjFcL2F1dGhcL3JlZnJlc2giLCJpYXQiOjE3MzQ0MDQzMzcsImV4cCI6MTczNDQwODAzMywibmJmIjoxNzM0NDA0NDMzLCJqdGkiOiJUQVBuOElUWWlGZUxVZUtHIiwic3ViIjo3LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.jxuq7zSb4dpn4BlBcoytKQRTGIrPc19OKsH6yMa4uWk'; // Replace with your token

  useEffect(() => {
    getPangkat();
    getUser();
  }, []);

  const getUser = () => {
    // Simulate fetching user data from Laravel API
    axios
      .get('http://192.168.2.102:8000/api/v1/auth/user', {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setFormRequest(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  const getPangkat = () => {
    axios
      .get('http://192.168.2.102:8000/api/v1/pangkat/show', {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setPangkats(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching pangkat:', error);
      });
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorCode);
      } else if (response.assets) {
        setImageUri(response.assets[0].uri);
        console.log('Image URI:', response.assets[0].uri); // Debug log
      }
    });
  };
  

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('nip', formRequest.nip);
    formData.append('name', formRequest.name);
    formData.append('pangkat_id', formRequest.pangkat_id);
    if (imageUri) {
      formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg', // Adjust based on image type
        name: 'profile.jpg',
      });
    }

    axios
      .post('http://192.168.2.102:8000/api/v1/user/update_profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        alert('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <View style={styles.profileImageWrapper}>
            {imageUri || formRequest.photo_url ? (
              <Image
                source={{ uri: imageUri || formRequest.photo_url }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileImageText}>No Image</Text>
            )}
            <View style={styles.editIconContainer}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="NIP"
        value={formRequest.nip}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formRequest.name}
        onChangeText={(text) => setFormRequest({ ...formRequest, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Pangkat/Gol. Ruang"
        value={formRequest.pangkat_id}
        onChangeText={(text) => setFormRequest({ ...formRequest, pangkat_id: text })}
      />

      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#4a90e2',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImageText: {
    color: '#fff',
    fontSize: 30,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  editIcon: {
    fontSize: 18,
    color: '#4a90e2',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#4a90e2',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
});

export default ProfileScreen;
