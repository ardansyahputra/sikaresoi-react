const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'], // Menambahkan ekstensi file gambar
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx', 'mjs'], // Ekstensi yang akan diproses
  },
};

module.exports = getDefaultConfig(__dirname);
