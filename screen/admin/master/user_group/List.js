import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import useApiClient from '../../../../src/api/apiClient';
import CustomCheckbox from '../../../components/CustomCheckbox';
import Header from '../../../components/Header';
import GlobalStyle from '../../../../src/utils/GlobalStyle';
import {BarIndicator} from 'react-native-indicators';
import {useAuth} from '../../../auth/AuthContext'; // Import useAuth from AuthContext

export default function UserGroupList({navigation, route}) {
  const {uuid} = route.params;
  const [menus, setMenus] = useState([]); // Menu utama + sub menu terstruktur
  const [selectedMenus, setSelectedMenus] = useState([]); // Menu yang digunakan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelection, setLocalSelection] = useState([]); // Local selection before saving
  const apiClient = useApiClient();
  const {fetchMenuAccess} = useAuth(); // Get fetchMenuAccess from AuthContext

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const menuResponse = await apiClient.get('/routes/show');
      const selectedResponse = await apiClient.get(`/user_group/${uuid}/list`);

      if (menuResponse.data.status && selectedResponse.data.status) {
        const allMenus = menuResponse.data.data;
        const selectedMenuIds = selectedResponse.data.data.selectedMenu;

        // Filter Master Menu (sub_menu: "1")
        const masterMenus = allMenus.filter(menu => menu.sub_menu === '1');

        // Tambahkan Sub Menu ke dalam setiap Master Menu
        const structuredMenus = masterMenus.map(masterMenu => ({
          ...masterMenu,
          sub_menus: allMenus.filter(
            sub =>
              sub.sub_menu === '0' &&
              parseInt(sub.id_parent, 10) === masterMenu.id,
          ),
        }));

        setMenus(structuredMenus);
        setSelectedMenus(selectedMenuIds);
        setLocalSelection(selectedMenuIds); // Initialize local selection
      } else {
        setError('Gagal mengambil data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSelection = async () => {
    try {
      const response = await apiClient.post(`/user_group/${uuid}/updateMenu`, {
        menus: localSelection,
      });

      if (response.data.status) {
        console.log('Data berhasil disimpan:', response.data);

        // Refresh the user's menu access after updating the selection
        await fetchMenuAccess(); // Call fetchMenuAccess to refresh the user's access rights
        setSelectedMenus(localSelection); // Update the selected menus state
      } else {
        console.log('Gagal menyimpan data:', response.data.message);
      }
    } catch (error) {
      console.log('Error saat menyimpan data:', error.message);
    }
  };

  const toggleMasterMenu = masterId => {
    setLocalSelection(prevSelected => {
      const isMasterSelected = prevSelected.includes(masterId);
      let updatedSelection = [...prevSelected];

      if (isMasterSelected) {
        updatedSelection = updatedSelection.filter(id => id !== masterId);
      } else {
        updatedSelection.push(masterId);
      }

      return updatedSelection;
    });
  };

  const toggleSubMenu = subMenuId => {
    setLocalSelection(prevSelected => {
      const isSelected = prevSelected.includes(subMenuId);
      let updatedSelection = [...prevSelected];

      if (isSelected) {
        updatedSelection = updatedSelection.filter(id => id !== subMenuId);
      } else {
        updatedSelection.push(subMenuId);
      }

      return updatedSelection;
    });
  };

  const renderMenuItem = ({item}) => {
    const isMasterChecked = localSelection.includes(item.id);

    return (
      <View>
        {/* Master Menu */}
        <View style={styles.masterMenu}>
          <CustomCheckbox
            checked={isMasterChecked}
            onPress={() => toggleMasterMenu(item.id)}
          />
          <Text style={[GlobalStyle.SemiBold, styles.menuHeader]}>
            {item.nm_menu}
          </Text>
        </View>

        {/* Sub Menus */}
        {item.sub_menus?.map(subItem => (
          <View key={subItem.uuid} style={styles.menuItem}>
            <CustomCheckbox
              checked={localSelection.includes(subItem.id)}
              onPress={() => toggleSubMenu(subItem.id)}
            />
            <Text style={[GlobalStyle.Regular, styles.menuText]}>
              {subItem.nm_menu}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header tetap ditampilkan */}
      <Header title="User Group List" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <BarIndicator color="#D4C6C6" count={5} size={24} />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMenus}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={menus}
            renderItem={renderMenuItem}
            keyExtractor={item => item.uuid}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveSelection}>
            <Text style={styles.saveButtonText}>Simpan</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  masterMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 0,
    borderRadius: 8,
  },
  menuHeader: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 0,
    marginLeft: 30,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
