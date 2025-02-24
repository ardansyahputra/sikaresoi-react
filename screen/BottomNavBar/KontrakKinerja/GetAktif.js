import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GetAktifCard = ({ data }) => {
  return (
    <View style={styles.card}>
      <View style={styles.userJabatanRow}>
        <View style={styles.userJabatanColumn}>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>NAMA:</Text>
            <Text style={styles.userJabatanValue}>{data.user.name}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>NIP:</Text>
            <Text style={styles.userJabatanValue}>{data.user.nip}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>JABATAN:</Text>
            <Text style={styles.userJabatanValue}>{data.jabatan.nm_jabatan}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>UNIT KERJA:</Text>
            <Text style={styles.userJabatanValue}>{data.unit_kerja.nm_unit_kerja}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>PERIODE:</Text>
            <Text style={styles.userJabatanValue}>{data.batas_awal} s/d {data.batas_akhir}</Text>
          </View>
        </View>
        <View style={styles.userJabatanColumn}>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>PIMPINAN:</Text>
            <Text style={styles.userJabatanValue}>{data.pimpinan.name}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>NIP PIMPINAN:</Text>
            <Text style={styles.userJabatanValue}>{data.pimpinan.nip}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>JABATAN PIMPINAN:</Text>
            <Text style={styles.userJabatanValue}>{data.jabatan_pimpinan.nm_jabatan}</Text>
          </View>
          <View style={styles.userJabatanItem}>
            <Text style={styles.userJabatanLabel}>UNIT KERJA PIMPINAN:</Text>
            <Text style={styles.userJabatanValue}>{data.unit_kerja_pimpinan.nm_unit_kerja}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userJabatanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userJabatanColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  userJabatanItem: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  userJabatanLabel: {
    fontFamily: "Poppins-SemiBold",
    width: 120,
  },
  userJabatanValue: {
    fontFamily: "Poppins-Regular",
  },
});

export default GetAktifCard;