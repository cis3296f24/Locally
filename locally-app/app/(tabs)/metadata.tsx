import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '@/constants'

const Metadata = () => {
  return (
    <SafeAreaView className='h-full'>
      <ScrollView className="p-4 space-y-6">
        <Header/>
        
        <CategoryFilter />

      </ScrollView>
    </SafeAreaView>
  )
}

export default Metadata

// Category Filter component
const CategoryFilter = () => {
  return (
    <View className="flex-row justify-around items-center space-x-4">
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

// Header component
const Header = () => {
  return (
    <View className="justify-between items-start flex-row mb-6 px-2">
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

const ItemIcon = ({
  icon, 
  title
}: {
  icon: any,
  title: string
}) => {
  return (
    <TouchableOpacity className="items-center w-24">
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