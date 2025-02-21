import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import GlobalStyle from '../../src/utils/GlobalStyle';

// Mendapatkan ukuran layar
const {width} = Dimensions.get('window');

const customToastConfig = {
  success: ({text1, text2}) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={styles.toastContent}>
        <Text style={[GlobalStyle.SemiBold, styles.toastTitle]}>{text1}</Text>
        <Text style={[GlobalStyle.Regular, styles.toastMessage]}>{text2}</Text>
      </View>
      <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeButton}>
        <Text style={[GlobalStyle.Regular, styles.closeText]}>✕</Text>
      </TouchableOpacity>
    </View>
  ),

  error: ({text1, text2}) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={styles.toastContent}>
        <Text style={[GlobalStyle.SemiBold, styles.toastTitle]}>{text1}</Text>
        <Text style={[GlobalStyle.Regular, styles.toastMessage]}>{text2}</Text>
      </View>
      <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeButton}>
        <Text style={[GlobalStyle.Regular, styles.closeText]}>✕</Text>
      </TouchableOpacity>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    borderRadius: 22,
    paddingVertical: width * 0.02, // Skala padding vertikal sesuai layar
    paddingHorizontal: width * 0.05, // Skala padding horizontal sesuai layar
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.9, // Lebar toast 90% dari layar
    maxWidth: 400, // Maksimum lebar untuk layar besar
    marginHorizontal: 'auto',

    // Shadow khas iOS
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},

    // Untuk Android (agar shadow tetap terlihat)
    elevation: 5,
  },

  successToast: {
    backgroundColor: '#FFF',
  },

  errorToast: {
    backgroundColor: '#FFF',
  },

  toastContent: {
    flex: 1,
  },

  toastTitle: {
    fontSize: width * 0.04, // Ukuran font dinamis sesuai layar
    color: '#000',
  },

  toastMessage: {
    fontSize: width * 0.035, // Ukuran font dinamis sesuai layar
    color: '#555',
  },

  closeButton: {
    paddingVertical: width * 0.015,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    alignSelf: 'flex-end',
  },

  closeText: {
    fontSize: width * 0.045, // Ukuran ikon dinamis sesuai layar
    color: '#999',
    textAlign: 'right',
  },
});

export default customToastConfig;
