import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'moment/locale/id';
import useApiClient from '../src/api/apiClient';
import axios from 'axios';

function zxc(str) {
  var result = '';
  var b = btoa(str);
  for (var i = 0; i < b.length; i++) {
    result += b.charCodeAt(i).toString(16);
  }
  return btoa(result);
}

const PresensiScreen = ({ navigation }) => {
  const [vm, setVm] = useState({
    location: { lat: -7.250445, long: 112.768845 }, // Contoh koordinat (Surabaya)
    hadirTime: null,
    keluarTime: null,
    setHadirTime: (time) => setVm((prev) => ({ ...prev, hadirTime: time })),
    setKeluarTime: (time) => setVm((prev) => ({ ...prev, keluarTime: time }))
  });
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Jakarta").format('HH:mm:ss'));
  const [circleColor, setCircleColor] = useState('#d3d3d3');
  const [textColor, setTextColor] = useState('orange');
  const [hadirTime, setHadirTime] = useState(null);
  const [keluarTime, setKeluarTime] = useState(null);
  const [tipeKehadiran, setTipeKehadiran] = useState(null); // "WFO" | "WFH"
  const animatedValue = useState(new Animated.Value(0))[0];
  const [loading, setLoading] = useState(true);
  const apiClient = useApiClient();


  const getStatusAbsensi = async () => {
    try {
      const response = await apiClient.get('/user/absensi/now');
      console.log("🟢 Berhasil mendapatakan status absensi: ", response.data.data);
      const data = response.data.data;
      setHadirTime(data.jam_masuk);
      setKeluarTime(data.jam_keluar);
      setTipeKehadiran(Boolean(data.jam_keluar) ? "KELUAR" : data.type)
      setTextColor(data.color);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("❌ Gagal mendapatakan status absensi. Error:", error.toJSON());
      } else {
        console.log("❌ Gagal mendapatakan status absensi. Error:", error);
      }
    }
  }



  useEffect(() => {
    getStatusAbsensi();

    const interval = setInterval(() => {
      setCurrentTime(moment().tz("Asia/Jakarta").format('HH:mm:ss'));
    }, 1000);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      clearInterval(interval);
      animation.stop();
    };
  }, []);



  const handlePresence = async (type, vm) => {
    if (!vm) {
      console.error("❌ Error: Data presensi tidak ditemukan.");
      return;
    }

    const { location, setCircleColor, setTextColor } = vm;

    console.log("🟢 Memulai handlePresence dengan type:", type);

    if (!type) {
      console.error("❌ Error: Parameter type tidak boleh kosong.");
      return;
    }

    if (type === 'WFO' && (!location || !location.lat || !location.long)) {
      console.error("❌ Lokasi tidak valid atau tidak berada dalam radius.");
      return;
    }

    if (hadirTime) {
      console.log("⚠️ User sudah melakukan presensi sebelumnya pada:", hadirTime);
      return;
    }

    function pad(val) {
      return val > 9 ? val : "0" + val;
    }

    let today = new Date();
    // let enc = (today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate())).toString();
    let enc = (new Date().getFullYear() + "-" + pad(new Date().getMonth()) + "-" + pad(new Date().getDate())).toString();

    try {
      console.log("📡 Mengirim request ke API: /user/absensi/in");

      const requestData = {
        enc: zxc(enc), // Pastikan zxc() tersedia, jika tidak gunakan nilai asli
        type: zxc(type),
        lat: zxc(location.lat),
        long: zxc(location.long)
      };

      console.log("📝 Data yang dikirim:", requestData);

      const response = await apiClient.post('/user/absensi/in', requestData);

      console.log("✅ Response dari API:", response.data);

      console.log("🎉 Presensi berhasil! Data:", response.data);
      // ✅ Perbarui status presensi setelah berhasil absen
      setTipeKehadiran(type);
      getStatusAbsensi();
    } catch (error) {
      console.error("🔥 Terjadi error saat request!", error.response?.data || error.message);
    }
  };

  const handleKeluar = async (vm) => {
    if (!vm) {
      console.error("❌ Error: Data presensi tidak ditemukan.");
      return;
    }

    const { location, setCircleColor, setTextColor } = vm;

    console.log("🟢 Memulai handleKeluar");

    if (!hadirTime) {
      console.error("❌ Error: Anda belum melakukan presensi masuk.");
      return;
    }

    if (keluarTime) {
      console.log("⚠️ User sudah melakukan presensi keluar sebelumnya pada:", keluarTime);
      return;
    }

    function pad(val) {
      return val > 9 ? val : "0" + val;
    }

    let today = new Date();
    let enc = (new Date().getFullYear() + "-" + pad(new Date().getMonth()) + "-" + pad(new Date().getDate())).toString();

    try {
      console.log("📡 Mengirim request ke API: /user/absensi/out");

      const requestData = {
        enc: zxc(enc),  // Pastikan zxc() tersedia, jika tidak gunakan nilai asli
        type: zxc(tipeKehadiran),
      };

      console.log("📝 Data yang dikirim:", requestData);

      const response = await apiClient.post('/user/absensi/out', requestData);

      console.log("✅ Response dari API:", response.data);

      console.log("🎉 Presensi keluar berhasil! Data:", response.data);
      setTipeKehadiran('KELUAR');
      getStatusAbsensi();
    } catch (error) {
      console.error("🔥 Terjadi error saat request!", error.response?.data || error.message);
    }
  };


  const rotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Presensi</Text>
      </View>
      </View>
      

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.dateContainer}>
            <View style={styles.dateSection}>
              <Icon name="calendar" size={20} color="#4caf50" />
              <Text style={styles.dateText}>{moment().tz("Asia/Jakarta").format('dddd, D MMMM YYYY')}</Text>
            </View>
          </View>

          <View style={styles.stopwatchContainer}>
            <Animated.View style={[styles.animatedCircle, { transform: [{ rotate: rotation }], borderColor: circleColor }]} />
            <Text style={styles.stopwatchLabel}>Presensi Kehadiran</Text>
            <Text style={[styles.realtimeText, { color: textColor }]}>{currentTime}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Status Presensi</Text>
            <View style={styles.statusContent}>

              {/* Status Kehadiran */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[
                  styles.statusValue,
                  tipeKehadiran === 'WFO' || tipeKehadiran === 'WFH'
                    ? styles.statusHadir
                    : tipeKehadiran === 'KELUAR'
                      ? styles.statusKeluar
                      : styles.statusBelumHadir
                ]}>
                  {tipeKehadiran || 'BELUM HADIR'}
                </Text>
              </View>

              {/* Menampilkan Waktu Hadir jika sudah absen masuk */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Hadir pada:</Text>
                <Text style={styles.statusValue}>{hadirTime || '-'}</Text>
              </View>

              {/* Menampilkan Waktu Keluar jika sudah absen keluar */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Keluar pada:</Text>
                <Text style={styles.statusValue}>{keluarTime || '-'}</Text>
              </View>

            </View>
          </View>


          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.hadirButton,
                tipeKehadiran === 'WFO' ? styles.selectedButton : styles.unselectedButton
              ]}
              disabled={Boolean(hadirTime)}
              onPress={() => handlePresence('WFO', vm)}
            >
              <Text style={styles.buttonText}>WFO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.hadirButton,
                tipeKehadiran === 'WFH' ? styles.selectedButton : styles.unselectedButton
              ]}
              disabled={Boolean(hadirTime)}
              onPress={() => handlePresence('WFH', vm)}
            >
              <Text style={styles.buttonText}>WFH</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                tipeKehadiran === "KELUAR" ? styles.keluarButton : styles.keluarButtonUnselected
              ]}
              onPress={() => handleKeluar(vm)}
              disabled={!hadirTime || Boolean(keluarTime)}
            >
              <Text style={styles.buttonText}>Keluar</Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('HistoryPresensi')}>
            <Text style={styles.historyButtonText}>Lihat History Presensi</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: '#4caf50', // Warna hijau untuk tombol yang dipilih

  },

  unselectedButton: {
    backgroundColor: '#d3d3d3', // Warna abu-abu untuk tombol yang tidak dipilih
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
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
  backButton: {
    marginTop: 1,
    marginLeft: 3,
    marginRight: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Optional: Adjust positioning
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: -10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  stopwatchContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  animatedCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 100,
    borderWidth: 10,
    opacity: 0.5,
    marginTop: 45,
  },
  realtimeText: {
    fontSize: 35,
    marginTop: 90,
    fontFamily: 'Poppins-SemiBold',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    marginTop: 70,
    fontFamily: 'Poppins-Regular',
  },
  statusTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  statusContent: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  statusValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  statusHadir: {
    color: '#4caf50',
  },
  statusKeluar: {
    color: '#f44336',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  hadirButton: {
    backgroundColor: '#4caf50',
  },
  keluarButton: {
    backgroundColor: '#f44336',
    padding: 15,
  },
  keluarButtonUnselected: {
    backgroundColor: '#d3d3d3',
    padding: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  historyButton: {
    backgroundColor: '#3b82f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  stopwatchLabel: {
    fontSize: 20,
    color: '#555',
    fontFamily: 'Poppins-SemiBold',
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#000",
  },
  separatorText: {
    fontSize: 20,
    color: "#000",
    marginBottom: 3,
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#000",
    marginLeft: 0,
  },
});

export default PresensiScreen;
