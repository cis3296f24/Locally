import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
import { getUserCity, setUserCity } from '@/services/storage-service';

const Explore = () => {
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState<Event | null>(null);
  const { setUserLocation, userCity, destinationCity, setDestinationLocation } = useLocationStore();
  const { events, setEvents, setSelectedEvent, selectedEvent, setCategory, category } = useEventStore();

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

  const handleSearchBarPress = () => {
    setCurrentSelectedEvent(null);
    setCategory('All');
  }

  const handleMapPress = () => {
    setCurrentSelectedEvent(null);
    if (userCity !== destinationCity) {
      setCategory('All');
    }
  }

  return (
    <View className="h-full w-full bg-transparent">
      <Map
        onMarkerSelect={handleMarkerSelect}
        onPress={handleMapPress}
      />

      <View className="absolute top-[8%] left-5 right-5 z-10">
        <SearchBar 
          onPress={handleSearchBarPress}
        />

        { events.length > 0 && <CategoryScrollView /> }
        
      </View>

      {currentSelectedEvent && (
        <View className="absolute bottom-8 left-0 right-0 z-1 items-center">
          <CardPop 
            event={currentSelectedEvent}
            onClick={() => {
              router.push('./../event-details');
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Explore;

const CategoryScrollView = () => {
  const { events, setEvents, setSelectedEvent, selectedEvent, setCategory, category } = useEventStore();
  const handleCategorySelect = (category: string) => {
    setCategory(category);
  }
  return (
    <ScrollView
      className='mt-6 left-5'
      horizontal  // Enables horizontal scrolling
      showsHorizontalScrollIndicator={false}  // Hides the scroll bar (optional)
      keyboardShouldPersistTaps="handled"
    >
      <View className='gap-4 flex-row'>
        {category !== 'All' && (
          <CategoryCard
            label="All"
            iconName="home"
            focusColor=""
            isSelected={category === 'All'}
            selecttedCategory={(value) => handleCategorySelect(value)}
          />
        )}

        {category !== 'All' && (
          (() => {
            const categoryEmojis = {
              Celebration: { color: '#F1573D', emoji: 'celebration' },
              Exhibition: { color: '#5669FF', emoji: 'museum' },
              Entertainment: { color: '#FFC300', emoji: 'stars' },
              Social: { color: '#39C3F2', emoji: 'handshake' },
              Community: { color: '#7ED321', emoji: 'groups' },
            };

            // Get the selected category
            const categoryName = category as keyof typeof categoryEmojis;
            const { color, emoji } = categoryEmojis[categoryName];

            return (
              <CategoryCard
                label={category}
                iconName={emoji}
                focusColor={color}
                isSelected={category === category}
                selecttedCategory={(value) => handleCategorySelect(value)}
              />
            );
          })()
        )}

        {/* Show all categories except "All" if "All" is not selected */}
        {category === 'All' && (
          <>
            <CategoryCard
              label="Community"
              iconName="groups"
              focusColor="#7ED321"
              isSelected={category === 'Community' as string}
              selecttedCategory={(value) => handleCategorySelect(value)}
            />
            <CategoryCard
              label="Social"
              iconName="handshake"
              focusColor="#39C3F2"
              isSelected={category === 'Social' as string}
              selecttedCategory={(value) => handleCategorySelect(value)}
            />
            <CategoryCard
              label="Entertainment"
              iconName="stars"
              focusColor="#FFC300"
              isSelected={category === 'Entertainment' as string}
              selecttedCategory={(value) => handleCategorySelect(value)}
            />
            <CategoryCard
              label="Celebration"
              iconName="celebration"
              focusColor="#F1573D"
              isSelected={category === 'Celebration' as string}
              selecttedCategory={(value) => handleCategorySelect(value)}
            />
            <CategoryCard
              label="Exhibition"
              iconName="museum"
              focusColor="#5669FF"
              isSelected={category === 'Exhibition' as string}
              selecttedCategory={(value) => handleCategorySelect(value)}
            />
          </>
        )}
      </View>
    </ScrollView>
  )
}