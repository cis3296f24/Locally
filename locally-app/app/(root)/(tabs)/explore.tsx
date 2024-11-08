import { View, Keyboard, TouchableWithoutFeedback, ScrollView, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Map from '@/components/Map'
import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'
import { Event } from '@/types/type'
import CardPop from '@/components/CardPop'
import { router } from 'expo-router'

const Explore = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleMarkerSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <View className="h-full w-full bg-transparent">
      <View className="z-0">
        <Map 
          onMarkerSelect={handleMarkerSelect}
        />
      </View>
      
      <View className="absolute top-[8%] left-5 right-5 z-1 items-center justify-center">
        <SearchBar />

        <ScrollView
          className='mt-6 left-5'
          horizontal  // Enables horizontal scrolling
          showsHorizontalScrollIndicator={false}  // Hides the scroll bar (optional)
          keyboardShouldPersistTaps="handled"
        >
          <View className='gap-4 flex-row'>
            <CategoryCard label="Social" iconName='account-group'></CategoryCard>
            <CategoryCard label="Music" iconName='music'></CategoryCard>
            <CategoryCard label="Dining" iconName='food-fork-drink'></CategoryCard>
            <CategoryCard label="Exhibtion" iconName='palette'></CategoryCard>
          </View>
        </ScrollView>
      </View>

      {selectedEvent && (
        <TouchableOpacity 
          className="absolute bottom-8 left-0 right-0 z-1 items-center"
          onPress={() => {
            router.push('./../event-details')
          }}
        >
          <CardPop event={selectedEvent} />
        </TouchableOpacity>
      )}

    </View>
  )
}

export default Explore