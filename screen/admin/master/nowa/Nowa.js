import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function NoWhatsapp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Whatsapp Atasan Screen</Text>
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
