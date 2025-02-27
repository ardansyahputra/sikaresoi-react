import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomCheckbox = ({ checked, onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.checkbox, checked && styles.checked]}>
      {checked && <Ionicons name="checkmark" size={20} color="#fff" style={styles.checkmark} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6, // Kotak dengan sudut sedikit melengkung
    borderWidth: 2,
    borderColor: '#007AFF', // Warna border biru
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#007AFF', // Warna biru saat dicentang
  },
  checkmark: {
    position: 'absolute',
  },
});

export default CustomCheckbox;
