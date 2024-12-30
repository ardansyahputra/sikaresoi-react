import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function PetaJabatan() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Peta Jabatan Screen</Text>
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
