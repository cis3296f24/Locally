import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert, FlatList} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { images } from '@/constants'
import FormInput from '@/components/FormInput';
import { Timestamp } from 'firebase/firestore'
import { DropDownInput } from '@/components/DropDownInput'
import { categories } from '@/utils/static-data'
import { DateTimePickerInput } from '@/components/DateTimePickerInput'
import PrimaryButton from '@/components/PrimaryButton'
import { createEvent } from '@/services/firebase-service'
import { useEventStore } from '@/store/event'
import { Event } from '@/types/type'
import PurchasePopup from '@/components/PurchasePopup'
import { useUserStore } from '@/store/user'
import useLocationStore from '@/store/locationStore'
import { LocationPickerInput } from '@/components/LocationPickerInput'

const CreateEvent = () => {
  const { events, selectedEvent, setEvents, setSelectedEvent, setShouldClearSelectedEvent } = useEventStore();
  const { destinationCity } = useLocationStore();
  const { userCreatedEvents, setUserCreatedEvents } = useUserStore();
  const [image, setImage] = useState<string | null>(null);
  const initialFormState = {
    category: '',
    city: '',
    dateCreated: Timestamp.now(),
    dateStart: Timestamp.now(),
    dateEnd: Timestamp.now(),
    description: '',
    locationName: '',
    price: 0,
    state: '',
    street: '',
    timeStart: '',
    timeEnd: '',
    title: '',
    zipCode: '',
    coordinate: {
      latitude: 0.0, 
      longitude: 0.0, 
    }  
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const onInputChange = (field: string, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleCreateEvent = async () => {
    try {
      const requiredFields: (keyof typeof form)[] = ['category', 'city', 'dateStart', 'dateEnd', 'description', 'locationName', 'state', 'street', 'timeStart', 'title', 'zipCode'];
      for (const field of requiredFields) {
        if (!form[field]?.toString().trim()) {
          alert(`The field "${field}" is required.`);
          return; 
        }
      }

      setLoading(true);

      const eventDateStart = form.dateStart;
      const eventDateEnd = form.dateEnd;

      let adjustedDateEnd = eventDateEnd;
      if (eventDateEnd && eventDateEnd.toMillis() < eventDateStart.toMillis()) {
        adjustedDateEnd = eventDateStart;
      }

      const event = {
        ...form,
        title: form.title.trim(),
        city: form.city.trim(),
        price: form.price > 0 ? form.price : null,
        dateEnd: adjustedDateEnd
      }

      const createdEvent = await createEvent(event, image as string);
      setSelectedEvent(createdEvent);
      
      if (createdEvent.city == destinationCity) {
        setEvents([createdEvent, ...events]);
      }

      setUserCreatedEvents([createdEvent, ...userCreatedEvents]);

      setLoading(false);
      setModalVisible(true);
    } catch (error) {
      setLoading(false);
      console.error('Error creating event', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSeeEvent = () => {
    setModalVisible(false);
    setForm(initialFormState);
    setShouldClearSelectedEvent(true);
    router.replace('/(root)/event-details');
  }

  const handleBackToProfile = () => {
    setModalVisible(false);
    setForm(initialFormState);
    router.replace('/(root)/(tabs)/profile');
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

        <PurchasePopup
          event={selectedEvent as Event}  
          isTicket={false}    
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSeeEventClick={handleSeeEvent}
          onBackToProfileClick={handleBackToProfile}
        />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className='flex-1'
          keyboardVerticalOffset={100}
        >
          <FlatList 
            data={["1"]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => null}
            className='px-8'
            keyboardShouldPersistTaps='handled'
            ListHeaderComponent={
              <View className="flex-col gap-6">
                <TouchableOpacity
                  onPress={handleImageClick}
                  className={`h-[240px] bg-white  rounded-xl mt-6 mb-4 items-center justify-center ${image ? 'border-0' : 'border-2 border-dashed border-secondary-sBlue'}`}
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

                <View className="h-[1px] bg-secondary-sBlue" />

                <Text className="text-primary-pBlue font-semibold text-2xl">Event Details</Text>

                <View className="gap-2">
                  <FormInput
                    title='Event Title'
                    placeholder="Enter event title"
                    value={form.title}
                    onChangeText={(title) => onInputChange('title', title)}
                  />

                  <FormInput
                    title='Description'
                    placeholder="Enter event description"
                    value={form.description}
                    isLongText={true}
                    onChangeText={(description) => onInputChange('description', description)}
                  />

                  <FormInput
                    title='Venue'
                    placeholder="Enter event venue"
                    value={form.locationName}
                    onChangeText={(locationName) => onInputChange('locationName', locationName)}
                  />

                  <LocationPickerInput
                    form={form} 
                    onInputChange={onInputChange}
                  />

                  <DropDownInput
                    title='Category'
                    placeholder='Select category'
                    data={categories} 
                    onSelect={(category) => onInputChange('category', category)}
                  /> 

                  <DateTimePickerInput 
                    title='Start Date' 
                    placeholder='Select start date' 
                    onSelectDate={(date) => {
                      const timestamp = Timestamp.fromDate(date);
                      onInputChange('dateStart', timestamp);
                    }}
                  />

                  <DateTimePickerInput 
                    title='End Date (Optional)' 
                    placeholder='Select end date' 
                    onSelectDate={(date) =>{
                      const timestamp = Timestamp.fromDate(date);
                      onInputChange('dateEnd', timestamp);
                    }}
                  />

                  <View className="flex-row gap-4 items-center">
                    <DateTimePickerInput 
                      title='From' 
                      placeholder='Select start time' 
                      isTimePicker={true}
                      onSelectTime={(time) => onInputChange('timeStart', time)}
                    />

                    <View className="h-[2px] w-[8px] bg-gray-400" />

                    <DateTimePickerInput 
                      title='To (Optional)' 
                      placeholder='Select end time' 
                      isTimePicker={true}
                      onSelectTime={(time) => onInputChange('timeEnd', time)}
                    />
                  </View>

                  <FormInput
                    title='Price (Optional)'
                    placeholder="Enter event price in $"
                    value={form.price}
                    isNumeric={true}
                    onChangeText={(price) => onInputChange('price', price)}
                  />

                  <PrimaryButton 
                    text="Create Event"
                    buttonStyle='mt-8'
                    onPress={handleCreateEvent}
                    loading={loading}
                  />
                </View>
              </View>
            }
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default CreateEvent



