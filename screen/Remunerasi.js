import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';

const Remunerasi = () => {
  const [postData, setPostData] = useState({ bulan_id: new Date().getMonth() + 1, tahun_id: 2025 });
  const [listBulan, setListBulan] = useState([]);
  const [listTahun, setListTahun] = useState([]);
  const [data, setData] = useState({});

  // Fetch Bulan data
  useEffect(() => {
    axios.get('http://192.168.60.146:8000/api/v1/bulan/show', {
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE0Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM3MDc3ODM5LCJleHAiOjE3MzcwODcwOTksIm5iZiI6MTczNzA4MzQ5OSwianRpIjoiV0hPT3BvVVZad2h2c1J2VCIsInN1YiI6OSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.x1n_6A0p7Df5XG2qH0VqEXAo1izxNGzm3c4Gl6l80ZY` // Ganti dengan token Anda
      }
    })
    .then(response => {
      console.log("Data Bulan:", response.data);
      setListBulan(response.data.data);
    })
    .catch(error => {
      console.error("Error fetching months:", error.response?.data || error.message);
    });

    // Hardcode Tahun dari 2020 hingga 2025
    const tahunData = [
      { id: 2020, tahun: '2020' },
      { id: 2021, tahun: '2021' },
      { id: 2022, tahun: '2022' },
      { id: 2023, tahun: '2023' },
      { id: 2024, tahun: '2024' },
      { id: 2025, tahun: '2025' }
    ];
    setListTahun(tahunData);
  }, []);

  // Fetch Data Remunerasi
  useEffect(() => {
    if (postData.bulan_id && postData.tahun_id) {
      getDataRemunerasi();
    }
  }, [postData]);

  const getDataRemunerasi = () => {
    const formRequest = {
      bulan: postData.bulan_id,
      tahun: postData.tahun_id.toString(),
    };

    axios.post('http://192.168.60.146:8000/api/v1/laporan/remunerasi', formRequest, {
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE0Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM3MDc3ODM5LCJleHAiOjE3MzcwODcwOTksIm5iZiI6MTczNzA4MzQ5OSwianRpIjoiV0hPT3BvVVZad2h2c1J2VCIsInN1YiI6OSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.x1n_6A0p7Df5XG2qH0VqEXAo1izxNGzm3c4Gl6l80ZY` // Ganti dengan token Anda
      },
    })
    .then(response => {
      setData(response.data.data);
    })
    .catch(error => {
      console.error("Error fetching remuneration data:", error.response?.data || error.message);
    });
  };

  const getSelectedBulan = () => {
    const selectedBulan = listBulan.find((bulan) => bulan.id === postData.bulan_id);
    return selectedBulan ? selectedBulan.bulan : "Pilih Bulan";
  };

  const getSelectedTahun = () => {
    const selectedTahun = listTahun.find((tahun) => tahun.id === postData.tahun_id);
    return selectedTahun ? selectedTahun.tahun : "Pilih Tahun";
  };

  const handleSelectMonth = (value) => {
    setPostData((prevData) => ({ ...prevData, bulan_id: value }));
  };

  const handleSelectYear = (value) => {
    setPostData((prevData) => ({ ...prevData, tahun_id: value }));
  };

  const formatRupiah = (value) => {
    return `Rp. ${parseInt(value).toLocaleString("id-ID")}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Bar */}
      <View style={styles.header}>
        <Image
          source={require('./assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      {/* Card for Month and Year Selector */}
      <View style={styles.card2}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text>Pilih Bulan <Text style={styles.required}>*</Text> :</Text>
            <Dropdown
              data={listBulan}
              labelField="bulan"
              valueField="id"
              value={postData.bulan_id}
              onChange={item => handleSelectMonth(item.id)}
              placeholder={getSelectedBulan()}
              style={styles.dropdown}
            />
          </View>
          <View style={styles.column}>
            <Text>Pilih Tahun <Text style={styles.required}>*</Text> :</Text>
            <Dropdown
              data={listTahun}
              labelField="tahun"
              valueField="id"
              value={postData.tahun_id}
              onChange={item => handleSelectYear(item.id)}
              placeholder={getSelectedTahun()}
              style={styles.dropdown}
            />
          </View>
        </View>
      </View>

      {/* Deskripsi Section */}
      <View style={styles.card}>
      <View style={styles.row3}>
        <Text style={styles.sectionTitle2}>Deskripsi</Text>
        <Text style={styles.totalText}>Total</Text>
      </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "red" }]} />
            <Text style={styles.text}>Gaji (P1)</Text>
          </View>
          <Text style={styles.amountLeftAligned}>{formatRupiah(data.p1)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "cyan" }]} />
            <Text style={styles.text}>Insentif (P2)</Text>
          </View>
          <Text style={styles.amountLeftAligned}>{formatRupiah(data.p2)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={[styles.deskripsiLabel, { marginLeft: 15 }]}> {/* Menambahkan margin kiri */}
            <View style={[styles.indicator, { backgroundColor: "purple", height: 2 }]} />
            <Text style={styles.text}>Tugas Utama</Text>
          </View>
          <Text style={styles.amountLeftAligned}>{formatRupiah(data.utama)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={[styles.deskripsiLabel, { marginLeft: 15 }]}> {/* Menambahkan margin kiri */}
            <View style={[styles.indicator, { backgroundColor: "black", height: 2 }]} />
            <Text style={styles.text}>Tugas Tambahan</Text>
          </View>
          <Text style={styles.amountLeftAligned}>{formatRupiah(data.tambahan)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "orange" }]} />
            <Text style={styles.text}>Potongan Absensi</Text>
          </View>
          <Text style={styles.amountLeftAlignedMinus}>- {formatRupiah(data.pot_absensi)}</Text>
        </View>

        <View style={styles.deskripsiRow}>
          <View style={styles.deskripsiLabel}>
            <View style={[styles.indicator, { backgroundColor: "darkblue" }]} />
            <Text style={styles.text}>Potongan Pajak</Text>
          </View>
          <Text style={styles.amountLeftAlignedMinus}>- {formatRupiah(data.pot_pajak)}</Text>
        </View>
      </View>

      {/* Total Remunerasi Section */}
      <View style={[styles.row1, { justifyContent: 'space-between' }]}>
        <View style={[styles.card1, styles.cardLeft]}>
          <Text style={styles.sectionTitle1}>TOTAL REMUNERASI</Text>
          <Text style={styles.totalAmount}>{formatRupiah(data.hasil)}</Text>
        </View>

        {/* Remunerasi Dibayar Section */}
        <View style={[styles.card1, styles.cardLeft]}>
          <Text style={styles.sectionTitle1}>REMUNERASI DIBAYAR</Text>
          <Text style={styles.totalAmount}>{formatRupiah(data.hasil_bayar)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: "#f7f7f7",
  },
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
card: {
  padding: 30,
  marginBottom: 30,
  borderRadius: 8,
  backgroundColor: "#fff",
  elevation: 1,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 5 },
  width: '90%', // Lebar default
  maxWidth: 400, // Batas maksimal 400px
  minWidth: 300, // Batas minimal 300px
  alignSelf: 'center', // Agar kartu selalu di tengah
},
card2: {
  padding: 15,
  marginBottom: 10,
  marginTop: 30, // Menambahkan jarak atas 20px
  borderRadius: 8,
  backgroundColor: "#fff",
  elevation: 1,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 5 },
  width: '90%', // Lebar default
  maxWidth: 400, // Batas maksimal 400px
  minWidth: 300, // Batas minimal 300px
  alignSelf: 'center', // Agar kartu selalu di tengah
},
  card1: {
    padding: 5, // Kurangi padding agar elemen lebih kompak
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    flex: 1, // Buat elemen fleksibel
    maxWidth: 180, // Batas maksimal lebar kartu
    alignSelf: "stretch", // Agar kartu menyesuaikan tinggi baris
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 10,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-around", // Atur spasi antar elemen
    alignItems: "center", // Pastikan elemen sejajar secara vertikal
    gap: 10, // Atur jarak antar elemen
    marginVertical: -20, // Sedikit margin vertikal
    paddingHorizontal: 25, // Tambahkan padding horizontal agar elemen tidak menempel ke pinggir layar
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  dropdown: {
    marginTop: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  required: {
    color: "red",
  },
row: {
  flexDirection: "row",
  justifyContent: "space-between", // Menjaga agar elemen tersebar antara kiri dan kanan
  alignItems: "center", // Menjaga agar teks tetap sejajar secara vertikal
  marginBottom: 10, // Memberikan sedikit jarak antar baris
},

totalText: {
  fontSize: 14,
  fontWeight: "bold",
  color: "rgba(0, 0, 0, 0.87)", // Anda bisa sesuaikan warna sesuai kebutuhan
  marginBottom: 10, // Memberikan jarak antara teks TOTAL dan Deskripsi
  textAlign: "right", // Menjaga agar teks TOTAL berada di sebelah kanan
},
  sectionTitle2: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    color: "rgba(0, 0, 0, 0.34)",
  },
  sectionTitle1: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.37)",
  },
  deskripsiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  deskripsiLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indicator: {
    width: 9,
    height: 9,
    borderRadius: 4,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  amountLeftAligned: {
    fontSize: 14,
    textAlign: "right",
    flex: 1,
  },
  amountLeftAlignedMinus: {
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    color: "red",
  },
  totalAmount: {
    fontSize: 21,
    fontWeight: "bold",
    color: "rgb(0, 0, 0)",
    textAlign: "center",
  },
cardLeft: {
  flex: 1, // Memungkinkan elemen mengambil ruang yang tersedia secara fleksibel
  marginHorizontal: -1, // Menambahkan margin horizontal untuk mengatur jarak antar elemen
  padding: 30, // Memberikan ruang di dalam elemen
  alignSelf: 'stretch', // Mengatur elemen agar memanjang sesuai container
  maxWidth: 200, // Membatasi lebar maksimal
  minWidth: 100, // Membatasi lebar minimal
},

});

export default Remunerasi;
