import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data from the API
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('http://192.168.60.176:8000/api/v1/auth/user', {
        headers: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjYwLjE3Njo4MDAwXC9hcGlcL3YxXC9hdXRoXC9yZWZyZXNoIiwiaWF0IjoxNzM2ODIwMjUyLCJleHAiOjE3MzY4MjM4NzEsIm5iZiI6MTczNjgyMDI3MSwianRpIjoiTllIMHV0VnU4Y0lEVHBXYyIsInN1YiI6OCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.KMMxNxXiz3yLYFfNzh0BGh7sXqlFeQJsb4k5jF4Ssw0',
        },
      });
      setProfileData(response.data); // Assuming the response data contains the profile info
    } catch (error) {
      console.error('Error fetching profile data', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ImageBackground
      source={require('../../assets/background.jpg')} // Replace with your desired background image
      style={[styles.container, styles.backgroundStyle]}
    >
      {/* App Bar */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/sikaresoi.png')}
          style={styles.headerImage}
        />
      </View>

      <View>
        {/* Card Wrapper */}
        <View style={styles.cardWrapper}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={require('../../assets/kemenhub.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{profileData ? profileData.data.name : 'Loading...'}</Text>
            <Text style={styles.profileHandle}>{profileData ? profileData.data.nip : 'Loading...'}</Text>
          </View>

          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.navigateTo) {
                    navigation.navigate(item.navigateTo);
                  } else if (item.label === 'Log out') {
                    // Add logout logic here
                    console.log('Logging out...');
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <Icon name={item.icon} size={40} color="#000" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#000" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const menuItems = [
  { label: 'Edit Profile', icon: 'person', navigateTo: 'ProfileEdit' },
  { label: 'Password', icon: 'lock', navigateTo: 'Password' },
  { label: 'Log out', icon: 'logout' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  backgroundStyle: {
    marginBottom: 500,
  },
  headerImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 5,
    marginRight: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  cardWrapper: {
    marginTop: 180,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 300,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 120, // Increased size
    height: 120,
    borderRadius: 60, // Ensure it's a perfect circle
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16, // Add spacing below the image
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHandle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  menuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 19,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ProfileScreen;
