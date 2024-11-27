import React from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { getUserCity } from '@/services/storage-service';
import Ionicons from '@expo/vector-icons/Ionicons';

interface LocationPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onLocationSelect: (
        lat: number,
        lng: number,
        address: string,
        city: string,
        state: string,
        zipCode: string
    ) => void;
}

const LocationPickerModal = ({ visible, onClose, onLocationSelect }: LocationPickerModalProps) => {
    const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-4 py-2 flex-row items-center justify-between border-b border-gray-200">
                    <Text className="text-lg font-bold text-[#001D3D]">Select Location</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#001D3D" />
                    </TouchableOpacity>
                </View>

                <View className="p-4 flex-1">
                    <GooglePlacesAutocomplete
                        placeholder="Search for a location"
                        minLength={2}
                        fetchDetails
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                            components: 'country:us',
                        }}
                        onPress={async (data, details = null) => {
                            if (details) {
                                const userCity = await getUserCity();

                                // Extract address components
                                const addressComponents = details.address_components;
                                const city = addressComponents.find(c =>
                                    c.types.includes('locality')
                                )?.long_name || userCity;

                                const state = addressComponents.find(c =>
                                    c.types.includes('administrative_area_level_1')
                                )?.short_name || '';

                                const zipCode = addressComponents.find(c =>
                                    c.types.includes('postal_code')
                                )?.long_name || '';

                                onLocationSelect(
                                    details.geometry.location.lat,
                                    details.geometry.location.lng,
                                    data.description,
                                    city,
                                    state,
                                    zipCode
                                );
                                onClose();
                            }
                        }}
                        styles={{
                            textInput: {
                                height: 48,
                                fontSize: 16,
                                backgroundColor: 'white',
                                borderColor: '#E5E9F0',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                color: 'black',
                            },
                            listView: {
                                backgroundColor: 'white',
                            },
                            separator: {
                                height: 1,
                                backgroundColor: '#E5E9F0',
                            },
                        }}
                        enablePoweredByContainer={false}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default LocationPickerModal;