import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function JenisPegawai() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Jenis Pegawai Screen</Text>
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
