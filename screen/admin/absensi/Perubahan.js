import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function PerubahanPresensi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(null);

  const apiClient = useApiClient(); // Using useApiClient hook

  useEffect(() => {
    fetchData(currentPage, selectedDisplay);
  }, [currentPage, selectedDisplay]);

  const fetchData = async (page, per) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/perubahan_absensi/indexadmin', {
        page,
        per, // Add per to limit the data
      });
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const handleApprove = uuid => {
    setSelectedUuid(uuid);
    setApproveModalVisible(true);
  };

  const handleDecline = uuid => {
    setSelectedUuid(uuid);
    setModalVisible(true);
  };

  const submitDecline = async () => {
    try {
      await apiClient.post(`/perubahan_absensi/${selectedUuid}/change`, {
        status: '2',
        revisi: declineReason,
      });
      Alert.alert('Berhasil', 'Penolakan berhasil.');
      setModalVisible(false);
      setDeclineReason('');
      fetchData(currentPage, selectedDisplay); // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Gagal menolak data.');
    }
  };

  const submitApprove = async () => {
    try {
      await apiClient.post(`/perubahan_absensi/${selectedUuid}/change`, {
        status: '1',
        revisi: null,
      });
      Alert.alert('Berhasil', 'Persetujuan Berhasil.');
      setApproveModalVisible(false);
      fetchData(currentPage, selectedDisplay); // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Gagal menyetujui data.');
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
      case 'DISETUJUI':
        return styles.approvedStatus;
      case 'DITOLAK':
        return styles.rejectedStatus;
      case 'MENUNGGU':
        return styles.pendingStatus;
      default:
        return styles.defaultStatus;
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
              fetchData(currentPage); // Panggil fetchData setelah nilai dropdown diperbarui
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
        <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
        <Text style={[styles.headerCell, styles.tableStatusCell]}>Status</Text>
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
            {item.user?.name || '-'}
          </Text>
          <View style={styles.statusCellContainer}>
            <Text
              style={[
                styles.tableCell,
                styles.statusCell,
                getStatusStyle(item.status),
              ]}>
              {item.status || '-'}
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
            <Text style={styles.expandedText}>
              Tanggal: {item.tanggal || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Jam Masuk: {item.jam_masuk || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Jam Keluar: {item.jam_keluar || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Keterangan: {item.revisi || '-'}
            </Text>
            <View style={styles.filetext}>
              <Text>File:</Text>
              <Text
                style={styles.expandedLinkText}
                onPress={() => Linking.openURL(item.file)}>
                Lihat File
              </Text>
            </View>
            <View style={styles.actionContainer}>
              {item.status !== 'DISETUJUI' && item.status !== 'DITOLAK' ? (
                <>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item.uuid)}>
                    <Ionicons name="checkmark" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecline(item.uuid)}>
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.statusText}>{item.status}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

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
