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
  const { events, setEvents, setSelectedEvent, selectedEvent, setFilter } = useEventStore();
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [eventsByCategory, setEventsByCategory] = useState<Event[]>()

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
      }
    })();
  }, []);

  const handleMarkerSelect = (event: Event) => {
    setCurrentSelectedEvent(event);
    setSelectedEvent(event);
  };

  useEffect(() => {
    const filterEvents = () => {
      setIsLoading(true); // Start loading before filtering
      const filtered = selectedCategory === 'All' 
        ? events 
        : events.filter(e => e.category === selectedCategory);
      setTimeout(() => { // Simulating async filtering
        setEventsByCategory(filtered);
        setIsLoading(false);
      }, 500);
    }
    filterEvents();
  }, [selectedCategory]);

  return (
    <View className="h-full w-full bg-transparent">
      <Map
        onMarkerSelect={handleMarkerSelect}
        onPress={() => setCurrentSelectedEvent(null)}
      />

      <View className="absolute top-[8%] left-5 right-5 z-10">
        <SearchBar 
          onPress={() => setCurrentSelectedEvent(null)}
        />
        <ScrollView
          className='mt-6 left-5'
          horizontal  // Enables horizontal scrolling
          showsHorizontalScrollIndicator={false}  // Hides the scroll bar (optional)
          keyboardShouldPersistTaps="handled"
        >
          <View className='gap-4 flex-row'>
            <CategoryCard 
              label="All" 
              iconName='home'
              focusColor=''
              isSelected={selectedCategory === 'All'}
              selecttedCategory={(value) => setFilter(value)} 
            />
            <CategoryCard 
              label="Community" 
              iconName='groups'
              focusColor='#7ED321'
              isSelected={selectedCategory === 'Community'}
              selecttedCategory={(value) => setFilter(value)} 
            />
            <CategoryCard 
              label="Social" 
              iconName='handshake' 
              focusColor='#39C3F2'
              isSelected={selectedCategory === 'Social'}
              selecttedCategory={(value) => setFilter(value)} 
            />
            <CategoryCard 
              label="Entertainment" 
              iconName='stars' 
              focusColor='#FFC300'
              isSelected={selectedCategory === 'Entertainment'}
              selecttedCategory={(value) => setFilter(value)} 
            />
            <CategoryCard 
              label="Celebration" 
              iconName='celebration' 
              focusColor='#F1573D'
              isSelected={selectedCategory === 'Celebration'}
              selecttedCategory={(value) => setFilter(value)} 
            />
            <CategoryCard 
              label="Exhibition" 
              iconName='museum' 
              focusColor='#5669FF'
              isSelected={selectedCategory === 'Exhibition'}
              selecttedCategory={(value) => setFilter(value)} 
            />
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