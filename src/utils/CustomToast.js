// CustomToast.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.toastContainer}>
      <Ionicons name="checkmark-circle-outline" size={35} color="#1bc5bd" />
      <View styles={styles.textContainer}>
        <Text style={styles.toastTitleSuccess}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.toastContainer}>
      <Ionicons name="close-circle-outline" size={35} color="#ff0004" />
      <View styles={styles.textContainerError}>
        <Text style={styles.toastTitleError}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={styles.toastContainer}>
       <View styles={styles.iconContainer}>
      <Ionicons name="alert-circle-outline" size={30} color="#ffab09" />
      </View>
      <View styles={styles.textContainer}>
        <Text style={styles.toastTitleAlert}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    </View>
  ),
  interactive: ({ text1, text2 }) => (
    <View style={styles.toastContaineInteractive}>
       <View styles={styles.iconContainer}>
      <Ionicons name="alert-circle-outline" size={30} color="#ffab09" />
      </View>
      <View styles={styles.textContainerInteractive}>
        <Text style={styles.toastTitleAlert}>{text1}</Text>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    marginTop: -40,
    padding: 7,
    elevation: 3,
  },
  textContainer: {
    flexDirection: 'column',
    margin: 15,
  },
  textContainerError: {
    flexDirection: 'column',
    margin: 0,
    paddingRight: 5,
  },
  iconContainer: {
    flexDirection: 'column',
    margin: 15,
  },
  toastTitleSuccess: {
    color: '#1bc5bd',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginLeft: 5,
  },
  toastTitleError: {
    color: '#ff0004',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginLeft: 5,
  },
  toastTitleAlert: {
    color: '#ffab09',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginLeft: 5,
  },
  toastText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 5,
    marginTop: -5,
  },
});

export { toastConfig, Toast };