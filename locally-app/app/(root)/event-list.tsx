import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEventStore } from '@/store/event'
import CardPop from '@/components/CardPop'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Event } from '@/types/type'

const EventList = () => {

  const { filteredEvents, listTitle, setSelectedEvent, setShouldClearSelectedEvent } = useEventStore()

  const handleOnEventClick = async (event: Event) => {
    setSelectedEvent(event)
    setShouldClearSelectedEvent(true)
    router.navigate("/(root)/event-details")
  }

  return (
    <SafeAreaView className='h-full w-full' edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="flex-row gap-2 py-6 mt-4 items-center ml-6">
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            <Text className="text-2xl">
              {listTitle}
            </Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={filteredEvents.sort((a, b) => a.dateStart.toMillis() - b.dateStart.toMillis())}
          keyExtractor={(item) => item.id}
          className='px-6'
          renderItem={({ item }) => (
            <CardPop
              event={item}
              styling="mb-4 shadow-md shadow-slate-300"
              onEventClick={() => handleOnEventClick(item)}
              isBookmarkShown={true} 
            />
          )} 
        />
      </View>
    </SafeAreaView>
  );
}

export default EventList