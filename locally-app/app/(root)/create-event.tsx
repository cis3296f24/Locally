import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import FormInput from '@/components/FormInput';
import PrimaryButton from '@/components/PrimaryButton';
import { createEvent, fetchEventsByCity } from '@/services/firebase-service';
import { useUserStore } from '@/store/user';
import useLocationStore from '@/store/locationStore';
import { useEventStore } from '@/store/event';
import CategoryPickerModal from '@/components/CategoryPickerModal';
import LocationPickerModal from '@/components/LocationPickerModal';
import { collection, getDocs } from 'firebase/firestore';
import { Firebase_Firestore } from '@/configs/firebase';

const CreateEvent = () => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [price, setPrice] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);
  const [pickerType, setPickerType] = useState<'startDate' | 'endDate' | 'startTime' | 'endTime' | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const user = useUserStore(state => state.user);
  const {
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
    destinationCity,
    setDestinationLocation,
  } = useLocationStore();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const eventsSnapshot = await getDocs(collection(Firebase_Firestore, 'events'));
        const uniqueCategories = new Set<string>();

        eventsSnapshot.forEach(doc => {
          const event = doc.data();
          if (event.category) {
            uniqueCategories.add(event.category);
          }
        });

        setCategories(Array.from(uniqueCategories).sort());
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async (categoryName: string) => {
    try {
      setCategories(prev => [...prev, categoryName].sort());
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const handleLocationSelect = (
    lat: number,
    lng: number,
    address: string,
    city: string,
    stateValue: string,
    zipCodeValue: string
  ) => {
    setDestinationLocation(lat, lng, address, city);
    setState(stateValue);
    setZipCode(zipCodeValue);
  };

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
    }
  }, []);

  const showPicker = useCallback((mode: 'date' | 'time', type: 'startDate' | 'endDate' | 'startTime' | 'endTime') => {
    setPickerMode(mode);
    setPickerType(type);
    setPickerVisible(true);
  }, []);

  const handlePickerChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'set' && selectedDate && pickerType) {
        switch (pickerType) {
          case 'startDate':
            setStartDate(selectedDate);
            break;
          case 'endDate':
            setEndDate(selectedDate);
            break;
          case 'startTime':
            setStartTime(selectedDate);
            break;
          case 'endTime':
            setEndTime(selectedDate);
            break;
        }
      }
      setPickerVisible(false);
    },
    [pickerType]
  );

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePublish = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    if (!destinationLatitude || !destinationLongitude || !destinationAddress || !destinationCity) {
      Alert.alert("Error", "Please select a location.");
      return;
    }

    if (!title || !description || !category || !state || !zipCode) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!startDate || !startTime) {
      Alert.alert("Error", "Start date and time are required.");
      return;
    }

    const formData = {
      image,
      title,
      description,
      category,
      startDate,
      endDate,
      startTime,
      endTime,
      price,
      locationName: destinationAddress,
      street: destinationAddress,
      coordinate: {
        lat: destinationLatitude,
        lng: destinationLongitude,
      },
      city: destinationCity,
      state,
      zipCode,
    };

    try {
      const eventId = await createEvent(formData, user.id);
      // Refresh events list
      const updatedEvents = await fetchEventsByCity(destinationCity);
      useEventStore.getState().setEvents(updatedEvents);
      setTimeout(() => {
        Alert.alert("Success", "Event created successfully!");
        router.back();
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Create New Event",
          headerShadowVisible: false,
          headerBackTitle: "",
        }}
      />

      <ScrollView className="flex-1 bg-gray-50 px-6">
        <TouchableOpacity
          onPress={pickImage}
          className="h-48 bg-white border-2 border-dashed border-gray-300 rounded-xl mt-6 mb-4 items-center justify-center"
          activeOpacity={0.7}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="add" size={24} color="#001D3D" />
              <Text className="text-black font-bold mt-2">Add Cover Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="h-[1px] bg-gray-200 mb-6" />

        <Text className="text-[#001D3D] font-semibold mb-6 text-lg">Event Details</Text>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Title</Text>
          <FormInput
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Description</Text>
          <View className="bg-white border border-[#E5E9F0] rounded-xl px-4">
            <TextInput
              placeholder="Enter details..."
              multiline
              numberOfLines={6}
              className="py-4 h-32 text-black"
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Location</Text>
          <TouchableOpacity
            onPress={() => setLocationModalVisible(true)}
            className="bg-white border border-[#E5E9F0] rounded-xl p-4"
          >
            <Text className="text-black">
              {destinationAddress || "Select a location"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">State</Text>
          <FormInput
            placeholder="State"
            value={state}
            editable={false}
          />
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Zip Code</Text>
          <FormInput
            placeholder="Zip code"
            value={zipCode}
            editable={false}
          />
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Category</Text>
          <TouchableOpacity
            onPress={() => setCategoryModalVisible(true)}
            className="bg-white border border-[#E5E9F0] rounded-xl p-4"
          >
            <Text className="text-black">
              {category || "Select a category"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Start Date</Text>
          <TouchableOpacity
            className="w-full h-12"
            onPress={() => showPicker('date', 'startDate')}
            activeOpacity={0.7}
          >
            <FormInput
              icon="calendar-outline"
              placeholder="Select Date"
              value={formatDate(startDate)}
              editable={false}
              iconPosition="right"
            />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">End Date (Optional)</Text>
          <TouchableOpacity
            className="w-full h-12"
            onPress={() => showPicker('date', 'endDate')}
            activeOpacity={0.7}
          >
            <FormInput
              icon="calendar-outline"
              placeholder="Select Date"
              value={formatDate(endDate)}
              editable={false}
              iconPosition="right"
            />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">From</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="flex-1 h-12"
              onPress={() => showPicker('time', 'startTime')}
              activeOpacity={0.7}
            >
              <FormInput
                placeholder="Start Time"
                value={formatTime(startTime)}
                editable={false}
                iconPosition="left"
              />
            </TouchableOpacity>
            <Text className="mx-4 text-[#001D3D] font-bold text-lg">—</Text>
            <TouchableOpacity
              className="flex-1 h-12"
              onPress={() => showPicker('time', 'endTime')}
              activeOpacity={0.7}
            >
              <FormInput
                placeholder="End Time"
                value={formatTime(endTime)}
                editable={false}
                iconPosition="left"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-[#001D3D] font-bold mb-2">Price (Optional)</Text>
          <FormInput
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View className="my-6 px-4">
          <PrimaryButton
            text="Publish Now"
            onPress={handlePublish}
            bgColor="bg-[#003566]"
            iconVisible={false}
          />
        </View>

        {pickerVisible && pickerMode && pickerType && (
          <DateTimePicker
            value={
              pickerType === 'startDate'
                ? startDate
                : pickerType === 'endDate'
                  ? endDate || new Date()
                  : pickerType === 'startTime'
                    ? startTime
                    : endTime || new Date()
            }
            mode={pickerMode}
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePickerChange}
          />
        )}
      </ScrollView>

      <CategoryPickerModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSelectCategory={setCategory}
        existingCategories={categories}
        onCreateNewCategory={handleCreateCategory}
        isLoading={isLoadingCategories}
      />

      <LocationPickerModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
    </KeyboardAvoidingView>
  );
};

export default CreateEvent;