import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import useApiClient from '../../../src/api/apiClient';
import ImagePicker from 'react-native-image-crop-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_PADDING = 20;
const CONTAINER_WIDTH = SCREEN_WIDTH - 2 * CARD_PADDING;

const Setting = ({navigation}) => {
  const apiClient = useApiClient();
  const [settingData, setSettingData] = useState({
    name: '',
    description: '',
    backgrounddir: '',
    logodarkdir: '',
    logowhitedir: '',
  });

  const [images, setImages] = useState({
    background: null,
    logo_dark: null,
    logo_white: null,
  });

  const [imageDimensions, setImageDimensions] = useState({
    background: {width: 0, height: 0},
    logo_dark: {width: 0, height: 0},
    logo_white: {width: 0, height: 0},
  });

  useEffect(() => {
    fetchSettingData(1);
  }, []);

  const fetchSettingData = async () => {
    try {
      const response = await apiClient.get('/setting');
      console.log('Response dari server:', response.data.data);
      setSettingData(response.data.data);
      console.log('Setting data:', settingData);

      // Get image dimensions for existing images
      getImageDimensions('background', response.data.data.backgrounddir);
      getImageDimensions('logo_dark', response.data.data.logodarkdir);
      getImageDimensions('logo_white', response.data.data.logowhitedir);
    } catch (error) {
      console.error('Error fetching settings:', error);
      Alert.alert('Error', 'Failed to load settings data');
    }
  };

  const getImageDimensions = (imageType, imageUrl) => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (width, height) => {
          const aspectRatio = width / height;
          const calculatedHeight = CONTAINER_WIDTH / aspectRatio;

          setImageDimensions(prev => ({
            ...prev,
            [imageType]: {
              width: CONTAINER_WIDTH,
              height: calculatedHeight,
            },
          }));
        },
        error => {
          console.error(`Error getting ${imageType} dimensions:`, error);
        },
      );
    }
  };

  const openImagePicker = async imageType => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        mediaType: 'photo',
        maxFiles: 1,
        compressImageMaxWidth: 1024, // Reasonable size for logos/background
        compressImageQuality: 0.8, // Good quality but smaller file size
      });

      // Check file size (5MB = 5120KB = 5242880 bytes)
      if (image.size > 5242880) {
        Alert.alert('Error', 'Image size must be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(image.mime)) {
        Alert.alert('Error', 'Please select a JPG or PNG image');
        return;
      }

      // Process image if it passes validation
      setImages(prev => ({
        ...prev,
        [imageType]: {
          uri:
            Platform.OS === 'ios'
              ? image.path.replace('file://', '')
              : image.path,
          type: image.mime,
          name: `${imageType}_${Date.now()}.${image.path.split('.').pop()}`,
        },
      }));

      // Update dimensions for display
      Image.getSize(image.path, (width, height) => {
        const aspectRatio = width / height;
        const calculatedHeight = CONTAINER_WIDTH / aspectRatio;

        setImageDimensions(prev => ({
          ...prev,
          [imageType]: {
            width: CONTAINER_WIDTH,
            height: calculatedHeight,
          },
        }));
      });
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        console.error('Image picker error:', error);
        Alert.alert('Error', 'Failed to select image');
      }
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', settingData.name);
    formData.append('description', settingData.description);

    // Append images if they exist
    if (images.background) {
      formData.append('background_file', {
        uri: images.background.uri,
        type: 'image/jpeg',
        name: 'background.jpg',
      });
    }

    if (images.logo_dark) {
      formData.append('logo_dark_file', {
        uri: images.logo_dark.uri,
        type: 'image/jpeg',
        name: 'logo_dark.jpg',
      });
    }

    if (images.logo_white) {
      formData.append('logo_white_file', {
        uri: images.logo_white.uri,
        type: 'image/jpeg',
        name: 'logo_white.jpg',
      });
    }

    console.log('Form data:', formData);

    apiClient
      .post('/setting/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Profile updated successfully:', response.data);
        // Show success message or navigate
        navigation.goBack(); // Optionally go back to the profile page
      })
      .catch(error => {
        console.log(
          'Error updating profile:',
          error.response?.data?.message || error.message,
        );
      });
  };

  const ImageSection = ({title, imageType, imageUrl}) => {
    const dimensions = imageDimensions[imageType];
    const imageStyle = dimensions
      ? {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: 10,
          marginVertical: 10,
        }
      : styles.defaultImage;

    return (
      <View style={styles.imageSection}>
        <Text style={styles.label}>{title}</Text>
        <TouchableOpacity onPress={() => openImagePicker(imageType)}>
          <Image
            source={
              images[imageType]
                ? {uri: images[imageType].uri}
                : imageUrl
                ? {uri: imageUrl}
                : require('../../../assets/images/logo.png')
            }
            style={imageStyle}
            resizeMode="contain"
          />
          <View style={styles.cameraIconContainer}>
            <Feather name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Website Settings</Text>
      </View>

      <ScrollView>
        <View style={styles.cardContainer}>
          <Text style={styles.label}>Website Name</Text>
          <TextInput
            style={styles.input}
            value={settingData.name}
            onChangeText={text =>
              setSettingData(prev => ({...prev, name: text}))
            }
            placeholder="Enter website name"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.multilineInput}
            value={settingData.description}
            onChangeText={text =>
              setSettingData(prev => ({...prev, description: text}))
            }
            placeholder="Enter description"
            multiline
            numberOfLines={3}
          />

          <ImageSection
            title="Background Image"
            imageType="background"
            imageUrl={settingData.backgrounddir}
          />

          <ImageSection
            title="Dark Logo"
            imageType="logo_dark"
            imageUrl={settingData.logodarkdir}
          />

          <ImageSection
            title="White Logo"
            imageType="logo_white"
            imageUrl={settingData.logowhitedir}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 24,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    marginVertical: 10,
  },
  defaultImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Setting;