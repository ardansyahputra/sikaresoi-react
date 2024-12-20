import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function PerubahanPresensi() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perubahan Presensi Screen</Text>
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
