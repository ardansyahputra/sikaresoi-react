import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RealisasiBawahanScreen() {
  return (
    <View style={styles.container}>
      <Text>Halaman Teguran</Text>
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
