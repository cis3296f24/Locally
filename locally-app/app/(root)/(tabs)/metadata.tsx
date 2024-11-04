import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import EventCard from '@/components/EventCard'
import SeeAll from '@/components/SeeAll'
import { router } from 'expo-router'

const Metadata = () => {
  return (
    <SafeAreaView className='h-full'>
      <ScrollView className="py-4">
        <Header/>
        
        <CategoryFilter />

        <SeeAll 
          title="Upcoming Events"
          seeAllColor='text-secondary-sBlue'
          arrowColor='#39C3F2'
          styling='mt-6 mb-3'
          onSeeAllPress={() => {}}
        />

        <EventHorizontalList />

        <SeeAll 
          title="Recently Viewed"
          seeAllColor='text-secondary-sBlue'
          arrowColor='#39C3F2'
          styling='mt-6'
          onSeeAllPress={() => {}}
        />

      </ScrollView>
    </SafeAreaView>
  )
}

export default Metadata

// Header component
const Header = () => {
  return (
    <View className="justify-between items-start flex-row mb-6 pl-6 pr-4">
      <View>
        <Text className="text-md text-gray-400">
          Go Exploring,
        </Text>
        <Text className="text-2xl font-semibold text-primary-pBlue">
          Jaime
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className='items-end px-2'>
          <Text className="text-md font-medium text-secondary-sBlue">
            Current Location
          </Text>
          <Text className="text-lg font-medium text-primary-pBlue">
            New York, US
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
const EventHorizontalList = () => {
  return (
    <FlatList
      data={[1, 2, 3, 4]}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          className="flex-row mr-12"
          delayPressIn={10}
          onPress={() => {
            router.push('./../event-details')
          }}
        >
          <EventCard 
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

