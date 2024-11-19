import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { fetchEventsByCity } from '@/services/firebase-service';
import { setUserCity } from '@/services/storage-service';

const Explore = () => {
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState<Event | null>(null);
  const { setUserLocation, destinationCity, setDestinationLocation } = useLocationStore();
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
        const userCity = city || ''
        await setUserCity(userCity);

        setUserLocation(
          location.coords.latitude, 
          location.coords.longitude, 
          address,
          userCity
        );

        if (!destinationCity) {
          setDestinationLocation(
            location.coords.latitude, 
            location.coords.longitude, 
            address,
            userCity
          );
        }

        console.log("City:", userCity);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      if (!destinationCity) {
        setIsLoading(false);
        return;
      }

      try {
        const eventsFromRemote = await fetchEventsByCity(destinationCity);
        setEvents(eventsFromRemote);
        console.log("Fetched events for....:", destinationCity);
      } catch (error) {
        console.log("Error fetching events:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [destinationCity]);

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
        ): events && (
          <Map
            events={events}
            onMarkerSelect={handleMarkerSelect}
          />
        )}
      </View>

      <View className="absolute top-[8%] left-5 right-5 z-10">
        <SearchBar />
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