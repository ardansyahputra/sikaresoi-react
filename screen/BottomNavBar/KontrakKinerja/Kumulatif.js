import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card, Button} from 'react-native-paper';

const Kumulatif = ({navigation}) => {
  const kinerja = {
    uuid: '12345',
    uraian: {
      nm_uraian: 'Contoh Kegiatan Tugas Jabatan',
      sub_unsur: {
        nm_sub_unsur: 'Contoh Sub Unsur',
      },
      angka_kredit: '10',
      point: '5',
      wpt: '40',
    },
    kt_satuan: '10',
    kl_persen: '90%',
    waktu_bulan: '12',
    kuantitas: '100',
    target: Array.from({length: 12}, (_, i) => ({
      bulan: new Date(0, i).toLocaleString('id-ID', {month: 'long'}),
      kuantitas: '8.33',
    })),
    total_target: '100.00',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      <Card style={styles.card}>
        <Card.Title
          title="Performance Breakdown"
          left={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <DetailRow
            label="Sub Unsur"
            value={kinerja.uraian?.sub_unsur?.nm_sub_unsur}
          />
          <DetailRow
            label="Kegiatan Tugas Jabatan"
            value={kinerja.uraian?.nm_uraian}
          />
          <DetailRow
            label="Angka Kredit"
            value={kinerja.uraian?.angka_kredit}
          />
          <DetailRow label="Kuantitas" value={kinerja.kt_satuan} />
          <DetailRow label="Kualitas" value={kinerja.kl_persen} />
          <DetailRow label="Waktu (Bulan)" value={kinerja.waktu_bulan} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Total Kuantitas</Text>
          <TextInput
            style={styles.input}
            value={kinerja.total_target?.toString()}
            editable={false}
          />
          <Button mode="contained" disabled={true} style={styles.button}>
            SIMPAN
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" disabled={true} style={styles.autoButton}>
            SET OTOMATIS
          </Button>
          <View style={styles.targetGrid}>
            {kinerja.target?.map((target, index) => (
              <View key={index} style={styles.targetItem}>
                <Text style={styles.targetLabel}>{target.bulan}:</Text>
                <TextInput
                  style={styles.targetInput}
                  value={target.kuantitas?.toString()}
                  editable={false}
                />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const DetailRow = ({label, value}) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backButton: {
    marginTop: 1,
    marginLeft: 3,
    marginRight: 1,
    opacity: 0.4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
  },
  autoButton: {
    backgroundColor: '#28a745',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  targetItem: {
    width: '48%',
    marginBottom: 10,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  targetInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
});

export default Kumulatif;
