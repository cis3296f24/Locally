import React from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import useLocationStore from '@/store/locationStore';

const SearchBar = () => {
  const { setDestinationLocation } = useLocationStore();
  const GOOGLE_API_KEY = Constants.expoConfig.extra.GOOGLE_API_KEY;

//  console.log('API Key:', GOOGLE_API_KEY);

  return (
    <View className="w-[90%] mx-6">
      <GooglePlacesAutocomplete
        placeholder="Search location"
        minLength={2}
        fetchDetails={true}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
          components: 'country:us', // Restrict to US results
        }}
        onPress={(data, details = null) => {
 //         console.log('Selected:', data);
 //         console.log('Details:', details);
          if (details) {
            setDestinationLocation(
              details.geometry.location.lat,
              details.geometry.location.lng,
              data.description
            );
          }
        }}
        onFail={error => console.error('Error:', error)}
        onNotFound={() => console.log('No results found')}
        enablePoweredByContainer={false}
        styles={{
          container: {
            flex: 0,
            zIndex: 999,
          },
          textInput: {
            height: 50,
            fontSize: 18,
            backgroundColor: 'white',
            borderRadius: 25,
            paddingLeft: 45,
            paddingRight: 10,
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: 10,
            marginTop: 5,
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            zIndex: 1000,
          },
          row: {
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
        }}
        renderLeftButton={() => (
          <View style={{ position: 'absolute', left: 15, top: 12, zIndex: 1 }}>
            <MaterialCommunityIcons name="magnify" size={30} color="gray" />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: 'gray',
          returnKeyType: "search",
        }}
      />
    </View>
  );
};

export default SearchBar;