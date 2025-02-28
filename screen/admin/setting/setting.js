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
import GlobalStyle from '../../../src/utils/GlobalStyle';
import Feather from 'react-native-vector-icons/Feather';
import useApiClient from '../../../src/api/apiClient';
import Header from '../components/Header';
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

  const [focusState, setFocusState] = useState({});

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

  const handleFocus = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: true}));
  };

  const handleBlur = inputName => {
    setFocusState(prevState => ({...prevState, [inputName]: false}));
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
        <Text style={[GlobalStyle.SemiBold, styles.label]}>{title}</Text>
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
      <Header title="Setting" />
      <ScrollView>
        <View style={styles.cardContainer}>
          <Text style={[GlobalStyle.SemiBold, styles.label]}>Nama Website</Text>
          <TextInput
            style={[
              GlobalStyle.Regular,
              styles.input,
              focusState.name && styles.inputFocused,
              settingData.name && styles.inputFilled,
            ]}
            value={settingData.name}
            onChangeText={text =>
              setSettingData(prev => ({...prev, name: text}))
            }
            placeholder="Enter website name"
            placeholderTextColor="#B0B0B0"
            onFocus={() => handleFocus('name')}
            onBlur={() => handleBlur('name')}
          />

          <Text style={[GlobalStyle.SemiBold, styles.label]}>Deskripsi</Text>
          <TextInput
            style={[
              GlobalStyle.Regular,
              styles.multilineInput,
              focusState.description && styles.inputFocused,
              settingData.description && styles.inputFilled,
            ]}
            value={settingData.description}
            onChangeText={text =>
              setSettingData(prev => ({...prev, description: text}))
            }
            placeholder="Enter description"
            placeholderTextColor="#B0B0B0"
            multiline
            numberOfLines={3}
            onFocus={() => handleFocus('description')}
            onBlur={() => handleBlur('description')}
          />

          <ImageSection
            title="Background Login"
            imageType="background"
            imageUrl={settingData.backgrounddir}
          />
          <Text style={[GlobalStyle.Regular, styles.allowed]}>
            Allowed file types: png, jpg, jpeg.
          </Text>

          <ImageSection
            title="Logo Dalam"
            imageType="logo_dark"
            imageUrl={settingData.logodarkdir}
          />
          <Text style={[GlobalStyle.Regular, styles.allowed]}>
            Allowed file types: png, jpg, jpeg.
          </Text>

          <ImageSection
            title="Logo Luar"
            imageType="logo_white"
            imageUrl={settingData.logowhitedir}
          />
          <Text style={[GlobalStyle.Regular, styles.allowed]}>
            Allowed file types: png, jpg, jpeg.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={[GlobalStyle.SemiBold, styles.buttonText]}>
                Simpan
              </Text>
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
    backgroundColor: '#FFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    ...GlobalStyle.SemiBold,
  },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginBottom: 20,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
  },
  multilineInput: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5, // Default border radius
    marginBottom: 20,
    backgroundColor: '#F0ECEC', // Default background color
    borderWidth: 1,
    borderColor: 'transparent', // Default border color (tidak terlihat)
    color: '#313131',
  },
  inputFocused: {
    borderRadius: 5, // Border radius saat fokus
    borderColor: '#75BAFF',
    borderWidth: 1.5,
  },
  inputFilled: {
    backgroundColor: '#F2F8FF', // Background lebih gelap saat terisi
    borderRadius: 5, // Hilangkan border radius
    padding: 10,
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
    textAlign: 'center',
    ...GlobalStyle.SemiBold,
  },
  allowed: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: -15,
  },
});

export default Setting;
