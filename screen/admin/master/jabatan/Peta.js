import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {Alert} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';
import {Dropdown} from 'react-native-element-dropdown';

const TreeNode = ({node, level = 0, onDelete, selectedTahun}) => {
  const apiClient = useApiClient();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.pegawai_tree && node.pegawai_tree.length > 0;
  const navigation = useNavigation();
  const isRootNode = level === 0;

  const handleUraian = id => {
    if (!selectedTahun) {
      Alert.alert('Pilih Tahun', 'Silakan pilih tahun terlebih dahulu.');
      return;
    }
    navigation.navigate('UraianPeta', {id, tahun: selectedTahun});
  };

  const handleTambah = id => {
    navigation.navigate('TambahPeta', {id});
  };

  const handleHapus = async id => {
    try {
      await apiClient.post(`jabatan/tree/deletePegawai`, {
        user_id: id,
      });
      Alert.alert('Berhasil', 'Berhasil Menghapus Pegawai.');
      onDelete();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Gagal menghapus pegawai.');
    }
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleTambah(node.id)}>
          <FontAwesome name="plus" size={18} color="#fff" />
        </TouchableOpacity>

        {!isRootNode && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleHapus(node.id)}>
            <FontAwesome name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleUraian(node.id)}>
          <Text style={[GlobalStyle.SemiBold, styles.uraianButton]}>
            Uraian
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Pressable
        onPress={() => hasChildren && setIsExpanded(!isExpanded)}
        style={[
          styles.nodeContainer,
          {marginLeft: level * 20},
          isRootNode && styles.rootNode,
        ]}>
        <Text style={styles.indicator}>
          {hasChildren ? (isExpanded ? '▼' : '▶') : '•'}
        </Text>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[GlobalStyle.SemiBold, styles.jobCode]}>
              {node.kd_jabatan}
            </Text>
            <Text style={[GlobalStyle.SemiBold, styles.jobTitle]}>
              {node.nm_jabatan}
            </Text>
          </View>
          {renderButtons()}
        </View>
      </Pressable>

      {isExpanded && hasChildren && (
        <View style={styles.childrenContainer}>
          {node.pegawai_tree.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onDelete={onDelete}
              selectedTahun={selectedTahun}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const PetaJabatan = () => {
  const apiClient = useApiClient();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState(3);

  const fetchTreeData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('jabatan/getTree');

      if (response.data && response.data.status && response.data.data) {
        setTreeData(response.data.data);
      } else {
        setError('Invalid data structure received');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch organization data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTahunOptions = async () => {
    try {
      const response = await apiClient.get('/tahun/show');
      setTahunOptions(
        response.data.data.map(item => ({
          label: item.tahun,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('Error fetching tahun options:', error);
      Alert.alert('Error', 'Gagal memuat data tahun.');
    }
  };

  useEffect(() => {
    fetchTreeData();
    fetchTahunOptions();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Peta Jabatan" />
      {loading ? (
        <View style={styles.centerContainer}>
          <View style={styles.loadingContainer}>
            <BarIndicator color="#D4C6C6" count={5} size={24} />
          </View>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={[GlobalStyle.Regular, styles.errorText]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTreeData}>
            <Text style={[GlobalStyle.SemiBold, styles.retryButtonText]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : !treeData ? (
        <View style={styles.centerContainer}>
          <Text style={[GlobalStyle.Regular, styles.errorText]}>
            No data available
          </Text>
        </View>
      ) : (
        <>
          <Dropdown
            style={styles.dropdown}
            data={tahunOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Tahun"
            value={selectedTahun}
            onChange={item => {
              setSelectedTahun(item.valueOf);
            }}
            renderItem={item => (
              <Text style={[GlobalStyle.Regular, styles.dropdownItem]}>
                {item.label}
              </Text>
            )}
          />
          <ScrollView style={styles.treeContainer}>
            <TreeNode
              node={treeData}
              onDelete={fetchTreeData}
              selectedTahun={selectedTahun}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  treeContainer: {
    padding: 16,
  },
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  rootNode: {
    backgroundColor: '#e8f4ff',
  },
  indicator: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  childrenContainer: {
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#1BC5BD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  uraianButton: {
    color: '#fff',
    backgroundColor: '#007AFF',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 32,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobCode: {
    fontSize: 16,
    marginRight: 12,
    color: '#000',
  },
  jobTitle: {
    fontSize: 16,
    flex: 1,
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
  },
});

export default PetaJabatan;
