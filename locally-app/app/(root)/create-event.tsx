import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { images } from '@/constants'
import FormInput from '@/components/FormInput';
import { Timestamp } from 'firebase/firestore'

const CreateEvent = () => {
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: '',
    city: '',
    coordinate: { latitude: 0, longitude: 0 },
    dateCreated: Timestamp,
    dateStart: Timestamp,
    dateEnd: Timestamp,
    description: '',
    locationName: '',
    ownerId: '',
    price: 0,
    state: '',
    street: '',
    timeStart: '',
    timeEnd: '',
    title: '',
    zipCode: '',
    imageCover: '',
  });

  const handleImageClick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to proceed.');
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-8 px-0 flex-grow flex-shrink basis-0">
        <View>
          <TouchableOpacity 
            onPress={() => 
            router.back()}
            className="flex-row gap-2 pl-3 my-4 items-center ml-5"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            <Text className="text-2xl">Create New Event</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className='flex-1'
        >
          <ScrollView className="flex-1 px-8">
            <TouchableOpacity
              onPress={handleImageClick}
              className={`h-[240px] bg-white  rounded-xl mt-6 mb-4 items-center justify-center ${image ? 'border-0' : 'border-2 border-dashed border-gray-300'}`}
              activeOpacity={0.7}
            >
              {image ? (
                <Image
                  source={image ? { uri: image } : images.noImage}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="add" size={24} color="#001D3D" />
                  <Text className="text-black font-semibold mt-2">Add Cover Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <View className="h-[1px] bg-gray-200 mb-6" />

            <Text className="text-[#001D3D] font-semibold mb-6 text-lg">Event Details</Text>

            <View className="mb-4">
              <Text className="text-[#001D3D] font-bold mb-2">Title</Text>
              <FormInput
                placeholder="Enter event title"
                value={form.title}
                onChangeText={(title) => setForm((prevForm) => ({ ...prevForm, title }))}
              />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default CreateEvent