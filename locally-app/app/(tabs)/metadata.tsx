import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Metadata = () => {
  return (
    <SafeAreaView className='h-full'>
      <ScrollView className="p-4 space-y-6">
        <Header/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Metadata

// Header component
const Header = () => {
  return (
    <View className="justify-between items-start flex-row mb-6">
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
          <Text className="text-md font-medium text-gray-900">
            Current location
          </Text>
          <Text className="text-lg font-medium text-primary-pBlue">
            New York, US
          </Text>
        </View>

        <View className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center">
          <MaterialCommunityIcons name="map-marker-outline" size={30} color="#003566" />
        </View>
      </View>
    </View>   
  )
}