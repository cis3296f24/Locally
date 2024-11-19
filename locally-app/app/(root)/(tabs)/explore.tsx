import { View, Keyboard, TouchableWithoutFeedback, ScrollView, Pressable, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import { Event } from '@/types/type';
import CardPop from '@/components/CardPop';
import { router } from 'expo-router';
import useLocationStore from '@/store/locationStore';
import * as Location from 'expo-location';
import { useEventStore } from '@/store/event';
import { useEventsByCity } from '@/services/tanstack-service';
import { ref } from 'firebase/storage';
import { fetchEventsByCity } from '@/services/firebase-service';

const Explore = () => {
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState<Event | null>(null);
  const { setUserLocation } = useLocationStore();
  const [city, setCity] = useState("")
  const { events, setEvents, setSelectedEvent, selectedEvent } = useEventStore();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow the app to access your location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let addressArray = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressArray.length > 0) {
        const { name, city, region } = addressArray[0];
        const address = `${name}, ${region}`;
        setUserLocation(
          location.coords.latitude, 
          location.coords.longitude, 
          address,
          city || 'Philadelphia'
        );

        console.log("City:", city);
        setCity(city || 'Philadelphia');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      if (!city) return;

      try {
        const eventsFromRemote = await fetchEventsByCity(city);
        setEvents(eventsFromRemote);
        console.log("Fetched events:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [city]);

  const handleMarkerSelect = (event: Event) => {
    setCurrentSelectedEvent(event);
    setSelectedEvent(event);
  };

  return (
    <View className="h-full w-full bg-transparent">
      <View className="z-0">
        { isLoading ? (
          <View className="flex-1 justify-center items-center w-screen top-[350px]">
            <ActivityIndicator size={'large'} color="#003566" />
          </View>
        ): (
          <Map
            events={events}
            onMarkerSelect={handleMarkerSelect} 
          />
        )}
      </View>

      <View className="absolute top-[8%] left-5 right-5 z-10">
        <SearchBar 
          setSearchCity={(value) => setCity(value)}
        />
        <ScrollView
          className='mt-6 left-5'
          horizontal  // Enables horizontal scrolling
          showsHorizontalScrollIndicator={false}  // Hides the scroll bar (optional)
          keyboardShouldPersistTaps="handled"
        >
          <View className='gap-4 flex-row'>
            <CategoryCard label="Social" iconName='account-group' />
            <CategoryCard label="Music" iconName='music' />
            <CategoryCard label="Dining" iconName='food-fork-drink' />
            <CategoryCard label="Exhibition" iconName='palette' />
          </View>
        </ScrollView>
      </View>

      {currentSelectedEvent && (
        <TouchableOpacity 
          className="absolute bottom-8 left-0 right-0 z-1 items-center"
          onPress={() => {
            router.push('./../event-details');
          }}
        >
          <CardPop event={currentSelectedEvent} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Explore;