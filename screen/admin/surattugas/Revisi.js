import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiClient from '../../../src/api/apiClient';
import {BarIndicator} from 'react-native-indicators';

const RevisiSuratTugas = ({navigation, route}) => {
  const {uuid} = route.params;
  const isLoading = false;
  const apiClient = useApiClient();
  const [reason, setReason] = useState('');

  const handleSave = async () => {
    try {
      await apiClient.post(`/surat-tugas/${uuid}/change`, {
        approval: 3,
        keterangan_revisi: reason,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1A1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Revisi Surat Tugas</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <BarIndicator color="#2196F3" count={5} size={30} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              {/* Reason Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alasan Perubahan</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    styles.inputFocused,
                    styles.inputFilled,
                  ]}
                  placeholder="Masukkan alasan perubahan"
                  value={reason}
                  onChangeText={setReason}
                  placeholderTextColor="#78787B"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1C1E',
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: '#1A1C1E',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputFocused: {
    borderColor: '#2196F3',
    backgroundColor: '#FFFFFF',
  },
  inputFilled: {
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    height: 48,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
  },
});

export default RevisiSuratTugas;