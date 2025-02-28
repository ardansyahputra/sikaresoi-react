import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import useApiClient from '../../../../src/api/apiClient';

export default function BelumKontrak() {
  const apiClient = useApiClient();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(10);
  const [activeButton, setActiveButton] = useState('kontrak');

  useEffect(() => {
    if (activeButton === 'kontrak') {
      fetchRealisasiData(1);
    } else {
      fetchRealisasiData(1); // Reset to page 1 when display changes
    }
  }, [activeButton, selectedDisplay]);

  const fetchRealisasiData = async page => {
    console.log('Fetching Realisasi Data');
    console.log('Endpoint:', 'POST /realisasi/belum_setuju');
    console.log('Request Payload:', {
      page,
      per: selectedDisplay,
      search: searchQuery,
      tahun: selectedYear,
    });

    try {
      setIsLoading(true);
      const response = await apiClient.post('/kinerja/user_sudah_kirim', {
        page,
        per: selectedDisplay,
      });
      console.log('Realisasi Data:', response.data); // Log data yang diterima
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Realisasi Error:', {
        message: error.message,
        status: error.response?.status,
        error: error.response?.data,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Gagal memuat data realisasi.',
      });
    } finally {
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const fetchKontrakData = async page => {
    console.log('Fetching Kontrak Data');
    setIsLoading(true); // Pastikan loading di-set sebelum request API

    try {
      setIsLoading(true);
      const response = await apiClient.post('/kinerja/user_belum_kirim', {
        page,
        per: selectedDisplay,
      });
      console.log('Kontrak Data:', response.data); // Log data yang diterima
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Kontrak Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Gagal memuat data kontrak.',
      });
    } finally {
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const display = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyle = status => {
    switch (status?.toUpperCase()) {
      case 'DIBUKA':
        return styles.approvedStatus;
      case 'DITUTUP':
        return styles.rejectedStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const handlePress = buttonName => {
    setActiveButton(buttonName);
    if (buttonName === 'kontrak') {
      fetchRealisasiData(1); // Load data yang belum disetujui
    } else {
      fetchKontrakData(1); // Load data yang sudah disetujui
    }
  };

  const TableHeader = () => (
    <View>
      <View style={styles.filterContainer}>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>Display</Text>
          <Dropdown
            style={styles.dropdown}
            data={display}
            labelField="label"
            valueField="value"
            placeholder="10"
            value={selectedDisplay}
            onChange={item => {
              setSelectedDisplay(item.value);
              fetchRealisasiData(currentPage);
            }}
            renderItem={item => (
              <Text style={[styles.dropdownItem, styles.customFont]}>
                {item.label}
              </Text>
            )}
            placeholderStyle={styles.customFont}
          />
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>NIP/NRP</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Nama</Text>
        <View style={styles.expandIconCell} />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.tableRow}>
        <TouchableOpacity
          style={styles.rowHeader}
          onPress={() => toggleExpand(item.id)}>
          <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
          <Text
            style={[styles.tableCell, styles.nameCell]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.nip || '-'}
          </Text>
          <View style={styles.statusCellContainer}>
            <Text
              style={[
                styles.tableCell,
                styles.statusCell,
                getStatusStyle(item.name), // Ganti item.nama menjadi item.name
              ]}>
              {item.name || '-'} {/* Ganti item.nama menjadi item.name */}
            </Text>
          </View>
          <View style={styles.expandIconCell}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#333"
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedText}>NIP/NRP: {item.nip || '-'}</Text>
            <Text style={styles.expandedText}>
              Nama: {item.name || '-'} {/* Ganti item.nama menjadi item.name */}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleApprove(item.uuid)}>
                <FontAwesome name="pencil" size={20} color="white" />
                <Text style={styles.customFont}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleHapus(item.uuid)}>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={styles.customFont}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Ionicons name="person-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Card untuk Tombol */}
      <View style={styles.card}>
        <View style={styles.tambahContainer}>
          <TouchableOpacity style={styles.y}></TouchableOpacity>
          <View style={styles.kontrakContainer}>
            <Pressable
              style={({pressed}) => [
                styles.buttonpress,
                pressed && styles.buttonPressed,
                activeButton === 'kontrak' && styles.buttonActive,
              ]}
              onPress={() => handlePress('kontrak')}>
              <View style={styles.bulanButton}>
                <Text
                  style={[
                    GlobalStyle.SemiBold,
                    styles.buttonText,
                    activeButton === 'kontrak' && styles.textActive,
                  ]}>
                  Belum Kirim
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.buttonpress,
                pressed && styles.buttonPressed,
                activeButton === 'realisasi' && styles.buttonActive,
              ]}
              onPress={() => handlePress('realisasi')}>
              <View style={styles.bulanButton}>
                <Text
                  style={[
                    GlobalStyle.SemiBold,
                    styles.buttonText,
                    activeButton === 'realisasi' && styles.textActive,
                  ]}>
                  Sudah Kirim
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.separatorLine} />

        {/* Dropdown Tahun dan Search Bar sejajar */}
        <View style={styles.rowContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={[GlobalStyle.SemiBold, styles.searchBar]}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.yearContainer}>
            <Dropdown
              style={styles.dropdownTahun}
              data={tahunOptions}
              labelField="label"
              valueField="value"
              placeholder="2025"
              value={selectedYear}
              onChange={item => setSelectedYear(item.value)}
              labelStyle={styles.dropdownLabel}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
          </View>
        </View>
      </View>

      {/* Tabel */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          ListHeaderComponent={TableHeader}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{flexGrow: 1, padding: '10'}}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.paginationContainer}>
              <Text style={[GlobalStyle.SemiBold, styles.pageInfo]}>
                {currentPage} of {lastPage}
              </Text>

              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.disabledButton,
                  ]}
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={currentPage === 1 ? '#ccc' : '#BEC2D5'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === lastPage && styles.disabledButton,
                  ]}
                  disabled={currentPage === lastPage}
                  onPress={() =>
                    setCurrentPage(prev => Math.min(prev + 1, lastPage))
                  }>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={currentPage === lastPage ? '#ccc' : '#BEC2D5'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableHeader: {
    marginTop: 15,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  yearMonthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yearContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  monthContainer: {
    flex: 1,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerCell: {
    fontSize: 13,
    color: '#9196B5',
  },

  tableRow: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 0,
  },

  rowHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F7F8FC',
    alignItems: 'center',
  },

  tableCell: {
    flexWrap: 'wrap',
    color: '#313131',
    fontSize: 14,
  },

  tableStatusCell: {
    textAlign: 'center', // Teks di tengah
    width: 100, // Sesuaikan lebar sesuai kebutuhan
  },

  numberCell: {
    width: 45,
  },

  nameCell: {
    flex: 1,
    overflow: 'hidden',
    flexShrink: 1, // Memungkinkan teks agar tidak memaksa ruang lebih
    paddingHorizontal: 8,
    minWidth: 80, // Mencegah terlalu kecil saat teks panjang
  },

  statusCellContainer: {
    width: 100,
  },

  statusCell: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  expandIconCell: {
    width: 40,
    alignItems: 'flex-end',
  },

  headerLine: {
    height: 2,
    backgroundColor: '#D3D3D3', // Garis horizontal bawah header
    marginBottom: 5,
  },
  verticalLine: {
    height: 2, // Tinggi garis horizontal
    backgroundColor: '#D3D3D3', // Warna abu-abu mirip header line
    marginBottom: 10, // Jarak atas & bawah agar tidak menempel
  },

  expandedContent: {
    padding: 15,
    backgroundColor: '#FAFAFA',
  },

  expandedText: {
    marginBottom: 5,
    fontSize: 14,
    color: '#313131',
  },

  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pageButton: {
    padding: 8, // Padding agar tombol lebih mudah diklik
    borderRadius: 5,
  },

  pageButtonText: {
    fontSize: 13,
    color: '#fff',
  },

  disabledButton: {
    opacity: 0.5, // Efek disabled lebih jelas
  },

  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },

  pageInfo: {
    fontSize: 14,
    color: '#888', // Warna abu-abu sesuai tampilan gambar
    marginRight: 10, // Jarak antara teks dan tombol navigasi
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 42, // **Tinggi sama dengan tombol tambah**
    flex: 1,
    maxWidth: '60%', // **Agar fleksibel di berbagai layar**
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 14, // **Agar proporsional dengan teks**
    alignSelf: 'center',
  },

  searchBar: {
    flex: 1,
    fontSize: 12, // **Agar lebih proporsional**
    color: '#BEC2D5',
    textAlignVertical: 'center', // **Pastikan teks sejajar secara vertikal**
    paddingVertical: 0, // **Hapus padding default agar tidak terlalu tinggi**
  },

  icon: {
    fontSize: 14, // **Ukuran disesuaikan agar sejajar dengan teks**
  },

  filterHeader: {
    marginBottom: 10,
    // borderWidth: 1,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  displayContainer: {
    flex: 1,
    maxWidth: '20%',
    marginRight: 10,
  },

  displayText: {
    fontSize: 14,
    textAlign: 'left',
    color: 'grey',
    width: '100%',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    color: 'grey',
    fontFamily: 'Poppins-SemiBold',
  },
  dropdownTahun: {
    borderColor: '#ccc',
    backgroundColor: '#F7F8FC',
    borderRadius: 5,
    padding: 5,
    height: 42,
    width: '60%',
  },
  // Style untuk dropdown display
  dropdownDisplay: {
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 80, // Lebar sesuai kebutuhan
    justifyContent: 'center',
  },

  // Style untuk dropdown bulan
  dropdownBulan: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },

  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: '#333',
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#000',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#0A3D62',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  confirmText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  separatorText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 3,
  },

  dropdownItemText: {
    fontFamily: 'Poppins-SemiBold', // Poppins untuk teks item
    fontSize: 14,
    color: 'grey',
  },
  dropdownPlaceholder: {
    fontFamily: 'Poppins-SemiBold', // Placeholder font Poppins
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
  },

  dropdownLabel: {
    fontFamily: 'Poppins-SemiBold', // Label font Poppins
    fontSize: 14,
    color: 'grey',
  },
  dropdownText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'grey',
    paddingLeft: 5,
  },
  bulanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Posisi ke kiri
    gap: 10,
    marginBottom: 20,
  },
  buttonpress: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  buttonPressed: {
    backgroundColor: '#fff',
  },
  buttonActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#A463FC', // Warna sesuai desain
  },
  buttonText: {
    fontSize: 14,
    color: 'grey',
  },
  textActive: {
    color: '#A463FC',
  },
  kontrakContainer: {
    flexDirection: 'row',
  },
  kontrakButton: {
    flexDirection: 'row',
    gap: 5,
  },
});
