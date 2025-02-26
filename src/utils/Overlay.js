// Overlay.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Overlay = ({ visible }) => {
  if (!visible) return null;

  return <View style={styles.overlay} />;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    zIndex: 999, // Ensure it appears above other content
  },
});

export default Overlay;