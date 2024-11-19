import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import EventCard from '@/components/EventCard'
import SeeAll from '@/components/SeeAll'
import { router } from 'expo-router'
import { useUserStore } from '@/store/user'
import { Timestamp } from 'firebase/firestore'
import { Event } from '@/types/type'
import { useEventStore } from '@/store/event'
import useLocationStore from '@/store/locationStore'
import { images } from '@/constants'

const Metadata = () => {
  const user = useUserStore((state) => state.user);
  const { events, setEvents } = useEventStore();
  const { destinationCity } = useLocationStore();

  return (
    <SafeAreaView className='h-full w-full'>
      <ScrollView className="py-4">
        <Header 
          username={user?.username ?? "username"}
          destinationCity={destinationCity ?? "User City"}
        />
        
        <CategoryFilter />

        { events.length > 0 ? (
          <>
            <SeeAll 
              title="Upcoming Events"
              seeAllColor='text-secondary-sBlue'
              arrowColor='#39C3F2'
              styling='mt-6 mb-3'
              onSeeAllPress={() => router.push('./../event-list')}
            />

            <EventHorizontalList events={events || []} />

            <SeeAll 
              title="Recently Viewed"
              seeAllColor='text-secondary-sBlue'
              arrowColor='#39C3F2'
              styling='mt-6'
              onSeeAllPress={() => {}}
            />
          </>
        ):(
          <View className="flex justify-center items-center w-full h-full">
            <Image 
              source={images.comingSoon}
              className="w-80 h-80 mt-20"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Metadata

// Header component
const Header = ({ 
  username,
  destinationCity, 
}: { 
  username: string
  destinationCity: string 
}) => {
  return (
    <View className="justify-between items-start flex-row mb-6 pl-6 pr-4">
      <View>
        <Text className="text-md text-gray-400">
          Go Exploring,
        </Text>
        <Text className="text-2xl font-semibold text-primary-pBlue">
          {username}
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className='items-end px-2'>
          <Text className="text-md font-medium text-secondary-sBlue">
            Current Location
          </Text>
          <Text className="text-lg font-medium text-primary-pBlue">
            {destinationCity}
          </Text>
        </View>

        <View className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center">
          <Image 
            source={icons.marker}  
            className="w-7 h-7" 
          />
        </View>
      </View>
    </View>   
  )
}

// Category Filter component
const CategoryFilter = () => {
  return (
    <View className="flex-row justify-around items-center px-4">
      <ItemIcon 
        icon={icons.sparkles}
        title="Today"
      />
      <ItemIcon 
        icon={icons.calendar}
        title="This Week"
      />
      <ItemIcon 
        icon={icons.megaphone}
        title="New"
      />
      <ItemIcon 
        icon={icons.heart}
        title="Most Favorite"
      />
      <ItemIcon 
        icon={icons.flame}
        title="Hot Pick"
      /> 
    </View>
  )
}

// Item Icon component
const ItemIcon = ({
  icon, 
  title,
}: {
  icon: any,
  title: string,
}) => {
  return (
    <TouchableOpacity 
      className="items-center w-24"
      onPress={(title) => {
       
      }}
    >
      <Image 
        source={icon}  
        className="w-7 h-7 mb-2 color-secondary-sBlue" 
      />
      <Text className="text-sm text-primary-pBlue">
        {title}
      </Text>
    </TouchableOpacity>
  )
}

// Horizontal List component
const EventHorizontalList = ({ events }: { events: Event[] }) => {
  const isEmpty = events.length === 0;
  const today = Timestamp.now();

  const upcomingEvents = events
    // .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .sort((a, b) => a.dateStart.toMillis() - b.dateStart.toMillis());

  const { setSelectedEvent } = useEventStore();

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    router.push('./../event-details')
  }

  return (
    <FlatList
      data={upcomingEvents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          className="flex-row mr-12"
          delayPressIn={10}
          onPress={() => handleEventPress(item)}
        >
          <EventCard
            event={item} 
            styling='left-6'
          />
        </TouchableOpacity>
      )}
      horizontal
      viewabilityConfig={{
        itemVisiblePercentThreshold: 20
      }}
      className='ml-1'
    />
  )
}

