import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants'
import EventCard from '@/components/EventCard'
import SeeAll from '@/components/SeeAll'
import { router } from 'expo-router'
import { useUserStore } from '@/store/user'
import { Event, User } from '@/types/type'
import { useEventStore } from '@/store/event'
import useLocationStore from '@/store/locationStore'
import { images } from '@/constants'

const Metadata = () => {
  const user = useUserStore((state) => state.user);
  const { getEventsByType, handleFiltering } = useEventFiltering();
  const { destinationCity } = useLocationStore();

  const upcomingEvents = getEventsByType(EventType.Upcoming);
  const endingSoonEvents = getEventsByType(EventType.EndingSoon);

  return (
    <SafeAreaView className='h-full w-full'>
      <ScrollView className="py-4">
        <Header 
          username={user?.username ?? "username"}
          destinationCity={destinationCity ?? "User City"}
        />
        
        <CategoryFilter 
          onSelect={(type) => handleFiltering(type)}
        />

        { upcomingEvents.length > 0 ? (
          <>
            <SeeAll 
              title={EventType.Upcoming}
              seeAllColor='text-secondary-sBlue'
              arrowColor='#39C3F2'
              styling='mt-6 mb-3 ml-8 mr-4'
              onSeeAllPress={() => handleFiltering(EventType.Upcoming)}
            />

            <EventHorizontalList events={upcomingEvents} />

            { endingSoonEvents.length > 0 && (
              <>
                <SeeAll 
                  title={EventType.EndingSoon}
                  seeAllColor='text-secondary-sBlue'
                  arrowColor='#39C3F2'
                  styling='mt-6 mb-3 ml-8 mr-4'
                  onSeeAllPress={() => handleFiltering(EventType.EndingSoon)}
                />

                <EventHorizontalList events={endingSoonEvents} />
              </>
            )}
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
    <View className="justify-between items-start flex-row mb-6 pl-8 pr-4">
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
const CategoryFilter = ({
  onSelect
}: {
  onSelect: (type: EventType) => void
}) => {
  return (
    <View className="flex-row justify-around items-center px-4">
      <ItemIcon 
        icon={icons.sparkles}
        title={EventType.Today}
        onPress={() => onSelect(EventType.Today)}
      />
      <ItemIcon 
        icon={icons.calendar}
        title={EventType.ThisWeek}
        onPress={() => onSelect(EventType.ThisWeek)}
      />
      <ItemIcon 
        icon={icons.heart}
        title={EventType.MostFavorite}
        onPress={() => onSelect(EventType.MostFavorite)}
      />
      <ItemIcon 
        icon={icons.flame}
        title={EventType.Popular}
        onPress={() => onSelect(EventType.Popular)}
      /> 
      <ItemIcon 
        icon={icons.megaphone}
        title={EventType.New}
        onPress={() => onSelect(EventType.New)}
      />
    </View>
  )
}

// Item Icon component
const ItemIcon = ({
  icon, 
  title,
  onPress
}: {
  icon: any,
  title: string,
  onPress?: () => void
}) => {
  return (
    <TouchableOpacity 
      className="items-center"
      onPress={onPress}
    >
      <Image 
        source={icon}  
        className="w-6 h-6 mb-2 color-secondary-sBlue" 
      />
      <Text className="text-sm text-primary-pBlue">
        {title}
      </Text>
    </TouchableOpacity>
  )
}

// Horizontal List component
const EventHorizontalList = ({ events }: { events: Event[] }) => {
  const { setSelectedEvent } = useEventStore();

  const handleEventPress = async (event: Event) => {
    setSelectedEvent(event);
    router.navigate('/(root)/event-details')
  }

  return (
    <FlatList
      data={events.slice(0, 4).sort((a, b) => a.dateStart.toMillis() - b.dateStart.toMillis())}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
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


enum EventType {
  Upcoming = 'Upcoming Events',
  EndingSoon = 'Ending Soon',
  Today = 'Today',
  ThisWeek = 'This Week',
  New = 'New',
  MostFavorite = 'Most Favorite',
  Popular = 'Popular',
}

export const useEventFiltering = () => {
  const { events, setListTitle, setFilteredEvents } = useEventStore();

  const now = new Date();

  // Filter events in the future
  const upcomingEvents = events.filter(
    (event) => event.dateStart.toDate() > now
  );

  // Filter events ending in the next 3 days
  const endingSoonEvents = events.filter((event) => {
    const endDate = event.dateEnd.toDate();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    return endDate >= now && endDate <= threeDaysFromNow;
  });

  // Filter events that are currently happening
  const currentEvents = events.filter((event) => {
    const startDate = event.dateStart.toDate();
    const endDate = event.dateEnd.toDate();
    return startDate <= now && endDate >= now;
  });

  // Filter events happening this week
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const thisWeekEvents = events.filter((event) => {
    const eventDate = event.dateStart.toDate();
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });

  const mostFavoriteEvents = events
    .filter((event) => event.bookmarksCount)
    .sort((a, b) => (b.bookmarksCount || 0) - (a.bookmarksCount || 0))
    .slice(0, 10);

  // Filter events with more than 2 attendees and ending in the future
  const popularEvents = events.filter(event => {
    const currentDate = new Date();
    return (
      event.attendeeIds && 
      event.attendeeIds.length > 2 && 
      event.dateEnd.toDate() > currentDate 
    );
  });

  // Filter events created in the last week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newEvents = events.filter((event) => {
    const createdDate = event.dateCreated.toDate();
    return createdDate >= oneWeekAgo;
  });

  const getEventsByType = (type: EventType): Event[] => {
    switch (type) {
      case EventType.Upcoming:
        return upcomingEvents;
      case EventType.EndingSoon:
        return endingSoonEvents;
      case EventType.Today:
        return currentEvents;
      case EventType.ThisWeek:
        return thisWeekEvents;
      case EventType.MostFavorite:
        return mostFavoriteEvents;
      case EventType.Popular:
        return popularEvents;
      case EventType.New:
        return newEvents;
      default:
        return [];
    }
  };

  // Handler for setting filtered events and updating state
  const handleFiltering = (title: EventType) => {
    setListTitle(title);
    setFilteredEvents(getEventsByType(title));
    router.push('/(root)/event-list');
  };

  return { getEventsByType, handleFiltering };
};
