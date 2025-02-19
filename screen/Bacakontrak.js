import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useApiClient from '../src/api/apiClient';
import {useNavigation} from '@react-navigation/native';

export default function PerformanceTableScreen({route}) {
  const [data, setData] = useState([]);
  const {userJabatanId, tahunId} = route.params;

  const handleSaveKinerja = updatedItem => {
    console.log('Saved:', updatedItem);
    setData(prevData =>
      prevData.map(item =>
        item.uuid === updatedItem.uuid ? updatedItem : item,
      ),
    );
  };

  return (
    <PerformanceTable
      data={data}
      onSaveKinerja={handleSaveKinerja}
      userJabatanId={userJabatanId}
      tahunId={tahunId}
    />
  );
}

const PerformanceTable = ({data, onSaveKinerja, userJabatanId, tahunId}) => {
  const [listKinerja, setListKinerja] = useState(data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const apiClient = useApiClient();
  const navigation = useNavigation();

  // Fetch Data
  const fetchKinerjaData = async () => {
    try {
      const response = await apiClient.post('user/kinerja/list/index', {
        tahun_id: tahunId,
        user_jabatan_id: userJabatanId,
      });

      if (!response.data || !response.data.kinerja || !Array.isArray(response.data.data)) {
        throw new Error('Invalid data structure');
      }

      setListKinerja(response.data.data);
      setError(null);
    } catch (err) {
      setError(`Gagal memuat data. Silakan coba lagi. Error: ${err.message}`);
      console.error('Error fetching data:', err.toJSON());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchKinerjaData();
  };

  useEffect(() => {
    fetchKinerjaData();
  }, []);

  // Save Data
  const handleSaveKinerja = async updatedItem => {
    try {
      const response = await apiClient.put(
        `user/kinerja/update/${updatedItem.uuid}`,
        updatedItem,
      );

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      fetchKinerjaData();
    } catch (error) {
      console.error('Error saving data:', error.toJSON());
    }
  };

  // Components
  const Card = ({children, style}) => (
    <View style={[styles.card, style]}>{children}</View>
  );

  const InputField = ({
    label,
    value,
    onChange,
    suffix,
    keyboardType = 'numeric',
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value?.toString()}
          onChangeText={onChange}
          keyboardType={keyboardType}
          placeholder="0"
          placeholderTextColor="#999"
        />
        {suffix && <Text style={styles.inputSuffix}>{suffix}</Text>}
      </View>
      {value <= 0 && <Text style={styles.errorText}>Tidak boleh 0</Text>}
    </View>
  );

  const StatusBadge = ({type, icon, text}) => {
    const badgeStyles = {
      danger: styles.statusBadgeDanger,
      warning: styles.statusBadgeWarning,
      success: styles.statusBadgeSuccess,
    };

    return (
      <View style={badgeStyles[type]}>
        <Icon name={icon} size={16} color="white" />
        <Text style={styles.statusText}>{text}</Text>
      </View>
    );
  };

  const PerformanceCard = ({item, index}) => {
    const getStatus = () => {
      if (
        item.kuantitas <= 0 ||
        item.kualitas <= 0 ||
        item.waktu <= 0 ||
        item.bobot <= 0 ||
        item.wpt <= 0
      ) {
        return {
          type: 'danger',
          icon: 'alert-circle',
          text: 'LENGKAPI DATA',
        };
      }
      if (item.total_target === null) {
        return {
          type: 'warning',
          icon: 'time',
          text: 'BELUM BREAKDOWN',
        };
      }
      return {
        type: 'success',
        icon: 'checkmark-circle',
        text: 'LENGKAP',
      };
    };

    const {type, icon, text} = getStatus();

    return (
      <Card style={styles.performanceCard}>
        <View style={styles.cardHeader}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.uraian?.nm_uraian}
          </Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Biaya:</Text>
            <View style={styles.currencyContainer}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <Text style={styles.currencyValue}>
                {item.uraian?.biaya
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Angka Kredit:</Text>
            <Text style={styles.value}>{item.uraian?.angka_kredit}</Text>
          </View>

          <View style={styles.inputSection}>
            <InputField
              label="Kuantitas"
              value={item.kuantitas}
              onChange={value => handleInputChange('kuantitas', value)}
              suffix={item.list?.uraian?.satuan}
            />
            <InputField
              label="Kualitas"
              value={item.kualitas}
              onChange={value => handleInputChange('kualitas', value)}
              suffix="%"
            />
            <InputField
              label="Waktu"
              value={item.waktu}
              onChange={value => handleInputChange('waktu', value)}
              suffix="BULAN"
            />
            <InputField
              label="Bobot"
              value={item.bobot}
              onChange={value => handleInputChange('bobot', value)}
            />
            <InputField
              label="WPT"
              value={item.wpt}
              onChange={value => handleInputChange('wpt', value)}
            />
          </View>

          <View style={styles.statusSection}>
            <StatusBadge type={type} icon={icon} text={text} />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.navigate('TargetPersetujuan')}>
              <Icon name="pencil" size={20} color="white" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  // Loading State
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C6FFF" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#E53E3E" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchKinerjaData}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main Render
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('./assets/images/sikaresoi.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4C6FFF']}
          />
        }>
        {listKinerja.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Icon name="clipboard-text-off" size={48} color="#999" />
              <Text style={styles.emptyStateText}>Data Kosong!</Text>
            </View>
          </Card>
        ) : (
          listKinerja.map((item, index) => (
            <PerformanceCard
              key={item.uuid}
              item={item}
              index={index}
              onSaveKinerja={onSaveKinerja}
            />
          ))
        )}
      </ScrollView>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total WPT:</Text>
          <Text style={styles.summaryValue}>
            {listKinerja.reduce(
              (total, item) => total + (Number(item.wpt) || 0),
              0,
            )}{' '}
            Jam
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Bobot:</Text>
          <Text style={styles.summaryValue}>
            {listKinerja
              .reduce((total, item) => total + (Number(item.bobot) || 0), 0)
              .toFixed(2)}
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  performanceCard: {
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fe',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  numberBadge: {
    backgroundColor: '#4C6FFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontSize: 14,
    color: '#718096',
    marginRight: 4,
  },
  currencyValue: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  inputSection: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#2D3748',
  },
  inputSuffix: {
    paddingRight: 12,
    fontSize: 12,
    color: '#718096',
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 4,
  },
  statusSection: {
    marginVertical: 16,
  },
  statusBadgeDanger: {
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeWarning: {
    backgroundColor: '#D69E2E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeSuccess: {
    backgroundColor: '#38A169',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#4C6FFF',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  },
  iconWrapper: {
    marginLeft: 16,
  },
});

  