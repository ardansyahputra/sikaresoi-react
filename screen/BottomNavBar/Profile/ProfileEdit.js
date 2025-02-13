import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import useApiClient from '../../../src/api/apiClient';
import { useAuth } from '../../auth/AuthContext';

const ProfileEdit = ({navigation}) => {
  const {user, login, token, fetchPangkat, pangkatItems} = useAuth();
  const [nip, setNip] = useState(user?.nip || '');
  const [name, setName] = useState(user?.name || '');
  const [pangkat, setPangkat] = useState(user?.pangkat_id || '');
  const [profileImage, setProfileImage] = useState(user?.photo_url || null);
  const apiClient = useApiClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(user?.pangkat_id || null);
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    console.log('user data saya', user);
    fetchPangkat();
  }, []);

  const openGallery = async () => {
    try {
      await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image, 'image');
        setProfileImage(image.path);
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('nip', nip);
    formData.append('pangkat_id', dropdownValue);

    if (profileImage && profileImage !== user?.photo_url) {
      formData.append('photo', {
        uri: profileImage,
        type: 'image/jpeg',
        name: profileImage.split('/').pop(),
      });
    }

    apiClient
      .post('/user/update_profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Profile updated successfully:', response.data);

        // Update user data in AuthContext
        const updatedUser = {
          ...user,
          name,
          nip,
          pangkat_id: dropdownValue, // pastikan pangkat_id terbaru digunakan
          photo_url: profileImage,
        };
        login(updatedUser, token);

        // Show success message or navigate
        navigation.goBack(); // Optionally go back to the profile page
      })
      .catch(error => {
        console.log(
          'Error updating profile:',
          error.response?.data?.message || error.message,
        );
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={openGallery}>
          <Image
            source={
              profileImage
                ? {uri: profileImage}
                : require('../../assets/images/sikaresoi.png')
            }
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
          value={nip}
          editable={false}
          onChangeText={setNip}
        />

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Pangkat / Gol.Ruang</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={pangkatItems}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setDropdownItems}
          placeholder="Pilih Pangkat"
          style={styles.dropdown}
          labelStyle={styles.dropdownLabel} // Label font Poppins
          selectedTextStyle={styles.selectedTextStyle} // Font Poppins untuk teks yang dipilih
                placeholderStyle={styles.dropdownPlaceholder} // Placeholder dengan font Poppins
                itemTextStyle={styles.dropdownItemText} // Font Poppins untuk teks opsi
                itemStyle={styles.dropdownItemText} // Gaya untuk item dalam dropdown
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {/* Kirim / Update Button */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Kirim</Text>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'black',
    marginRight: 150,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30, // Increased space below profile image
  },
  profileImage: {
    width: 120, // Larger size for profile image
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
    marginTop: 20, // Increased margin for better spacing
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12, // Increased padding for better spacing
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 20, // Increased margin bottom for spacing between fields
    backgroundColor: '#f9f9f9',
  },
  updateButton: {
    backgroundColor: '#FF3D00',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 25, // Space above the button
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
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
  dropdownItemText: {
    fontFamily: 'Poppins-Regular', // Poppins untuk teks item
    fontSize: 14,
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-Regular', // Placeholder font Poppins
    fontSize: 14,
  },
  dropdownLabel: {
    fontFamily: 'Poppins-Regular', // Label font Poppins
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#333333',
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#999999',
  },
});

export default ProfileEdit;