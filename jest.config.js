module.exports = {
    preset: 'jest-expo', // Use Expo preset for Jest
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use Babel for transformation
    },
    setupFilesAfterEnv: [
      '@testing-library/react-native/cleanup-after-each', // Clean up after each test
    ],
    testPathIgnorePatterns: ['/node_modules/', '/.expo/'], // Ignore unnecessary paths
    transformIgnorePatterns: [
      'node_modules/(?!(@react-native|react-native|react-navigation|expo|@expo|react-native-vector-icons|.*)/)', // Transform necessary node modules
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // File extensions Jest recognizes
  };
  