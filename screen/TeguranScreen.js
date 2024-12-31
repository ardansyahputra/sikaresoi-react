import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

export default function User() {
  const staticData = [
    {
      id: 1,
      uuid: 'abc123',
      user: {
        name: 'John Doe',
      },
      status: 'Sudah',
      tanggal: '2024-01-15',
      jenis_teguran: 'tidak apel',
      potongan: '1%',
      file: 'https://example.com/file1.pdf',
    },
  ];

  const [data, setData] = useState(staticData);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleApprove = (item) => {
    setModalContent(`Apakah Anda ingin melihat detail untuk ${item.user.name}?`);
    setModalVisible(true);
  };

  const confirmApprove = (uuid) => {
    const newData = data.map((item) => {
      if (item.uuid === uuid) {
        return {...item, status: 'DISETUJUI'};
      }
      return item;
    });
    setData(newData);
    setModalVisible(false);
    Alert.alert('Berhasil', 'Konfirmasi berhasil.');
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'DIBACA':
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
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.numberCell]}>No</Text>
      <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
      <Text style={[styles.headerCell, styles.tableStatusCell]}>Dibaca</Text>
      <View style={styles.expandIconCell} />
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
              Jenis teguran: {item.jenis_teguran || '-'}
            </Text>
            <Text style={styles.expandedText}>
              Potongan: {item.potongan || '-'}
            </Text>
            <View style={styles.filetext}>
              <Text>File:</Text>
              <Text
                style={styles.expandedLinkText}
                onPress={() => Linking.openURL(item.file)}>
                File Absensi
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApprove(item)}>
                <Ionicons name="eye-outline" size={16} color="white" />
                <Text style={styles.approveButtonText}>Baca</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{modalContent}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => confirmApprove('abc123')}>
              <Text style={styles.modalButtonText}>Ya</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../screen/assets/images/sikaresoi.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}></TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ListHeaderComponent={TableHeader}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.card}
        ListFooterComponent={
          <View>
            <Text style={styles.pageInfo}>
              Showing page {currentPage} of {lastPage}
            </Text>
            <View style={styles.paginationContainer}>
              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.disabledButton,
                  ]}
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                  <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === lastPage && styles.disabledButton,
                  ]}
                  disabled={currentPage === lastPage}
                  onPress={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, lastPage))
                  }>
                  <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 0,
  },
  rowHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  tableCell: {
    flexWrap: 'wrap',
    fontSize: 14,
  },
  tableStatusCell: {
    textAlign: 'center',
    flex: 1,
    paddingLeft: 0,
  },
  numberCell: {width: 50},
  nameCell: {
    flex: 1,
    overflow: 'hidden',
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
  approvedStatus: {
    color: '#4CAF50',
  },
  rejectedStatus: {
    color: '#F44336',
  },
  pendingStatus: {
    color: '#FFC107',
  },
  defaultStatus: {
    color: '#9E9E9E',
  },
  expandedContent: {
    padding: 15,
    backgroundColor: '#FAFAFA',
  },
  expandedText: {
    marginBottom: 5,
    fontSize: 14,
  },
  expandedLinkText: {
    color: 'blue',
    marginBottom: 5,
    fontSize: 14,
  },
  filetext: {
    flexDirection: 'row',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2', // Facebook blue color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    minWidth: 80,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 13,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  iconWrapper: {
    marginLeft: 12,
  },
});