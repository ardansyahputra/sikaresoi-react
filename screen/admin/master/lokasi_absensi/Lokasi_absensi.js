import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function LokasiAbsensi() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lokasi Absensi Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});