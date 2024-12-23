import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Modal, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import ProfileEdit from './ProfileEdit';
import Password from './Password';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur'; // Untuk efek blur

const ProfileScreen = () => {
  const [currentView, setCurrentView] = useState('profile');
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../../assets/300-14.jpg'));

  // Animated value untuk efek slide-up
  const slideAnim = useState(new Animated.Value(600))[0];

  useFocusEffect(
    React.useCallback(() => {
      // Animasi slide-up saat layar fokus
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, [slideAnim])
  );

  const navigateToProfileEdit = () => {
    setShowProfileModal(true); // Tampilkan modal untuk edit profil
  };

  const navigateToPasswordEdit = () => {
    setShowPasswordModal(true); // Tampilkan modal untuk edit password
  };

  const handleLogout = () => {
    Toast.show({
      type: 'success',
      text1: 'Logout Berhasil',
      text2: 'Anda telah berhasil keluar.',
    });
    setConfirmingLogout(false);
  };

  const confirmLogout = () => {
    setConfirmingLogout(true);
    Toast.show({
      type: 'info',
      text1: 'Konfirmasi Logout',
      text2: 'Apakah Anda yakin ingin keluar? Tekan "Ya" untuk melanjutkan.',
      position: 'top',
      autoHide: false,
      onPress: handleLogout,
      onHide: () => setConfirmingLogout(false),
    });
  };

  const handleBack = () => {
    setShowProfileModal(false);
    setShowPasswordModal(false);
    Toast.show({
      type: 'info',
      text1: 'Back',
      text2: 'Kembali ke halaman utama profil.',
    });
  };

  const handleChangePhoto = () => {
    // Placeholder untuk perubahan foto
    Toast.show({
      type: 'info',
      text1: 'Change Photo',
      text2: 'Di sini Anda dapat menambahkan fungsi pemilih gambar.',
    });
    // Anda dapat menambahkan pemilih gambar untuk mengganti foto.
    // setProfileImage(newPhotoUri);
  };

  return (
    <LinearGradient
      colors={['#1D56C0', '#4A90E2']} // Gradient background
      style={styles.container}
    >
      <Animated.View
        style={[styles.formWrapper, { transform: [{ translateY: slideAnim }] }]} // Terapkan animasi slide
      >
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
            <Text style={styles.changePhotoButtonText}>UBAH FOTO</Text>
          </TouchableOpacity>
          <Text style={styles.profileName}>OBET LUMALAN BIJANG, S.Si.T.M.Ap,M.Ma</Text>
          <Text style={styles.profileSubtitle}>Pembina (IV/a)</Text>
          <Text style={styles.profileSubtitle}>19740714 200502 1 007</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuOption} onPress={navigateToProfileEdit}>
            <Ionicons name="person" size={20} color="#1D56C0" style={styles.icon} />
            <Text style={styles.menuText}>Profil Saya</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOption} onPress={navigateToPasswordEdit}>
            <Ionicons name="lock-closed" size={20} color="#1D56C0" style={styles.icon} />
            <Text style={styles.menuText}>Ubah Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={!confirmingLogout ? confirmLogout : null}
        >
          <Text style={styles.logoutText}>KELUAR</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal untuk Profil Edit */}
      <Modal
        visible={showProfileModal}
        animationType="fade"
        transparent={true} // Membuat modal transparan
        onRequestClose={handleBack}
      >
        <BlurView
          style={styles.blurBackground} // Latar belakang blur
          blurType="light"
          blurAmount={80} // Tingkat blur
        />
        <View style={styles.modalContainer}>
          <ProfileEdit />
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleBack}>
            <Text style={styles.modalCloseButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal untuk Ubah Password */}
      <Modal
        visible={showPasswordModal}
        animationType="fade"
        transparent={true} // Membuat modal transparan
        onRequestClose={handleBack}
      >
        <BlurView
          style={styles.blurBackground} // Latar belakang blur
          blurType="light"
          blurAmount={80} // Tingkat blur
        />
        <View style={styles.modalContainer}>
          <Password />
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleBack}>
            <Text style={styles.modalCloseButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formWrapper: {
    padding: 24,
    backgroundColor: 'rgb(255, 255, 255)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 180,
    width: '94%',
    height: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: -89,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#fff',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#000',
  },
  changePhotoButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(202, 201, 201, 0.8)',
    borderRadius: 20,
  },
  changePhotoButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginHorizontal: 100,
    marginTop: 7,
    paddingVertical: 9,
  },
  menuOption: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 18,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(211, 208, 208, 0.43)',
    borderRadius: 10,
    marginBottom: 15,
    width: '190%',
  },
  icon: {
    marginRight: 15,
    marginLeft: 20,
  },
  menuText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  logoutButton: {
    marginTop: 0,
    alignSelf: 'center',
    backgroundColor: '#d60f19',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1, // Memastikan konten modal di atas blur
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#E4E7EB',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  modalCloseButtonText: {
    fontSize: 15,
    color: '#6A67CE',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
