import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../../auth/AuthContext';
import useApiClient from '../../../../src/api/apiClient';
import GlobalStyle from '../../../../src/utils/GlobalStyle';

const ProfileScreen = ({navigation}) => {
  const {user, pangkatItems, logout} = useAuth();
  const [pangkat, setPangkat] = useState(null);
  const apiClient = useApiClient();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user && pangkatItems.length > 0) {
      const foundPangkat = pangkatItems.find(
        item => item.value === user.pangkat_id,
      );

      if (foundPangkat) {
        setPangkat(foundPangkat.label); // Set the user's pangkat if found
      } else {
        setPangkat('Pangkat Tidak Ditemukan'); // Fallback message
      }
    }
  }, [user, pangkatItems]); // Re-run when user or pangkatItems change

  // console.log('User data di ProfileScreen:', user);

  // Menambahkan console log untuk memverifikasi data user
  console.log('User data:', user);

  const handleLogout = () => {
    setModalVisible(false);
    logout();
    navigation.replace('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/poltekpol-barombong-bg.jpg')} // Replace with your desired background image
      style={[styles.container, styles.backgroundStyle]}>
      {/* Modal Logout */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.modalText]}>
              Apa kamu yakin ingin keluar?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={[GlobalStyle.SemiBold, styles.cancelText]}>
                  Tidak
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleLogout}>
                <Text style={[GlobalStyle.SemiBold, styles.confirmText]}>
                  Ya
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* App Bar */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      <View>
        {/* Card Wrapper */}
        <View style={styles.cardWrapper}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{uri: user?.photo_url}}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.profileHandle}>
              {pangkat || 'Loading Pangkat'}
            </Text>
            <Text style={styles.profileHandle}>{user?.nip || 'User Nip'}</Text>
          </View>

          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.navigateTo) {
                    navigation.navigate(item.navigateTo);
                  } else if (item.label === 'Log out') {
                    setModalVisible(true);
                  }
                }}>
                <View style={styles.menuItemLeft}>
                  <Icon name={item.icon} size={40} color="#000" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#000" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const menuItems = [
  {label: 'Edit Profile', icon: 'person', navigateTo: 'ProfileEdit'},
  {label: 'Password', icon: 'lock', navigateTo: 'Password'},
  {label: 'Log out', icon: 'logout'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  backgroundStyle: {
    marginBottom: 500,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#0A3D62',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  confirmText: {
    color: '#fff',
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  cardWrapper: {
    marginTop: 180,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 300,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 120, // Increased size
    height: 120,
    borderRadius: 60, // Ensure it's a perfect circle
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 16, // Add spacing below the image
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHandle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  menuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 19,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ProfileScreen;
