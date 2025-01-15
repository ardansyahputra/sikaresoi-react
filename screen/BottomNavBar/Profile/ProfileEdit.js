import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileEdit = ({ navigation }) => {
  const [name, setName] = useState('19750615 199808 1 001');
  const [email, setEmail] = useState('BUDIAWAN, S.Si.T, MT');
  const [profileImage, setProfileImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPangkatData();
  }, []);

  const fetchPangkatData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.60.176:8000/api/v1/pangkat/show', {
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE3Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2ODIwMjUyLCJleHAiOjE3MzY4MjYyMDMsIm5iZiI6MTczNjgyMjYwMywianRpIjoiY1NoUDZhclZtVlY1elZhayIsInN1YiI6OCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.esERNPZQFUFe-9yllVw3BnPPx4kIBULo-Ehqfv_vABw',
        },
      });

      console.log('API Response:', response.data); // Debugging log

      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((item) => ({
          label: `${item.nm_pangkat} - ${item.golongan}/${item.ruang}`,
          value: item.id,
        }));
        setDropdownItems(formattedData);

        // Set default value (optional)
        if (formattedData.length > 0) {
          setDropdownValue(formattedData[0].value);
        }
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pangkat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/sikaresoi.png')}
            style={styles.profileImage}
          />
          <View style={styles.cameraIconContainer}>
            <Feather name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>NIP / NRP</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Pangkat / Gol.Ruang</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#FF3D00" />
        ) : (
          <DropDownPicker
            open={dropdownOpen}
            value={dropdownValue}
            items={dropdownItems}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            setItems={setDropdownItems}
            placeholder="Pilih Pangkat"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            nestedScrollEnabled
          />
        )}

        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Kirim / Update</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 120,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 5,
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  updateButton: {
    backgroundColor: '#FF3D00',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ProfileEdit;
