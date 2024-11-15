import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEventStore } from '@/store/event'
import CardPop from '@/components/CardPop'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

const EventList = () => {

  const { events, setSelectedEvent } = useEventStore()

  return (
    <SafeAreaView className='h-full w-full'>
      <View className="flex-1 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="flex-row gap-2 py-8 items-center ml-4">
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            <Text className="text-2xl">
              Upcoming Events
            </Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardPop
              event={item}
              additionalStyling="w-full mb-4"
              style="bg-white p-3 rounded-2xl shadow-none w-[340px] flex-row items-center" 
            />
          )} 
        />
      </View>
    </SafeAreaView>
  );
}

export default EventList