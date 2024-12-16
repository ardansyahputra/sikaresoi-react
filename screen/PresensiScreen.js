import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PresensiScreen() {
  return (
    <View style={styles.container}>
      <Text>Halaman Presensi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
