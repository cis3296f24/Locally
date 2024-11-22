import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      GOOGLE_API_KEY: 'mock-api-key',
    },
  },
}));

jest.mock('@/services/storage-service', () => ({
  getUserCity: jest.fn().mockResolvedValue('Mock City'),
}));

// Mock the MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock GooglePlacesAutocomplete
jest.mock('react-native-google-places-autocomplete', () => {
  const MockGooglePlacesAutocomplete = ({ onPress, ...props }) => null;
  return {
    GooglePlacesAutocomplete: MockGooglePlacesAutocomplete,
  };
});

// Silence warnings
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});