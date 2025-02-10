import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import GlobalStyle from '../../src/utils/GlobalStyle';

const customToastConfig = {
  success: ({text1, text2}) => (
    <View style={styles.toastContainer}>
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
    backgroundColor: '#FFF', // Background putih khas iOS
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,

    // Shadow khas iOS
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},

    // Untuk Android (agar shadow tetap terlihat)
    elevation: 5,
  },

  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    color: '#000',
  },
  toastMessage: {
    fontSize: 14,
    color: '#555',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
  },
});

export default customToastConfig;
