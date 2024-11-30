import { useState } from "react";
import Constants from 'expo-constants';
import { Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FormInput from "./FormInput";
import { DropDownInput } from "./DropDownInput";
import { states } from "@/utils/static-data";

export const LocationPickerInput = ({ 
  form, 
  onInputChange 
}: { 
  form: any; 
  onInputChange: (field: string, value: any) => void 
}) => {
  const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
  const [searching, setSearching] = useState(false);

  const handleSelect = (data: any, details: any) => {
    const addressComponents = details.address_components;

    // Parse address components
    const streetNumber = addressComponents.find((c: { types: string[] }) => c.types.includes('street_number'))?.long_name || '';
    const streetName = addressComponents.find((c: { types: string[] }) => c.types.includes('route'))?.long_name || '';
    const city = addressComponents.find((c: { types: string[] }) => c.types.includes('locality'))?.long_name || '';
    const state = addressComponents.find((c: { types: string[] }) => c.types.includes('administrative_area_level_1'))?.short_name || '';
    const zipCode = addressComponents.find((c: { types: string[] }) => c.types.includes('postal_code'))?.long_name || '';

    const street = `${streetNumber} ${streetName}`;
    const latitude = details.geometry.location.lat;
    const longitude = details.geometry.location.lng;

    // Update form fields
    if (onInputChange) {
      onInputChange('street', street);
      onInputChange('city', city);
      onInputChange('state', state);
      onInputChange('zipCode', zipCode);
      onInputChange('coordinate', { latitude: latitude, longitude: longitude });

      setSearching(false);
    }
  };

  return (
    <View className='gap-1'>
      <Text className="text-lg text-primary-pBlue font-semibold mb-1">Address</Text>
      { searching ? (
        <View 
          className='flex-row flex-1 items-center bg-white border border-secondary-sBlue rounded-xl px-2 mb-4 pt-1'
        >
          <GooglePlacesAutocomplete
            placeholder="Search for a location"
            fetchDetails={true}
            minLength={2}
            onPress={handleSelect}
            textInputProps={{
              autoFocus: true, 
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
          />
        </View>
      ): (
        <FormInput
          placeholder="Street"
          value={form.street}
          onChangeText={(street) => onInputChange('street', street)}
          onFocused={() => setSearching(true)} 
        />
      )}

      {/* Form Input - City */}
      <FormInput
        placeholder="City"
        value={form.city}
        onChangeText={(city) => onInputChange('city', city)}
      />

      <View className="flex-row gap-4">
        {/* DropDown for State */}
        <DropDownInput
          placeholder="State"
          data={states} 
          onSelect={(state) => onInputChange('state', state)}
        />

        {/* Form Input - Zip Code */}
        <FormInput
          placeholder="Zip Code"
          value={form.zipCode}
          isNumeric={true}
          maxLength={5}
          onChangeText={(zipCode) => onInputChange('zipCode', zipCode)}
        />
      </View>
    </View>
  );
};