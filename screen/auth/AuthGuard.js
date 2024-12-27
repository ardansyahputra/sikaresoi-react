import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import * as Keychain from 'react-native-keychain';

const AuthGuard = ({navigation, children, allowedLevels}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials.password;
          // Simpan level akses user untuk validasi (misalnya dari context atau API fetch)
          const userLevel = await getUserLevel(token);
          if (allowedLevels.includes(userLevel)) {
            setIsAuthenticated(true);
          } else {
            navigation.replace('Login'); // Redirect jika level tidak cocok
          }
        } else {
          navigation.replace('Login'); // Redirect jika tidak login
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigation.replace('Login'); // Redirect jika ada error
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigation, allowedLevels]);

  const getUserLevel = async token => {
    // Lakukan fetch user untuk mendapatkan level akses
    try {
      const response = await fetch(
        'http://192.168.60.85:8000/api/v1/auth/user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userData = await response.json();
      return userData.data.level; // Ambil level user
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Memeriksa autentikasi...</Text>
      </View>
    );
  }

  return isAuthenticated ? children : null;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthGuard;
