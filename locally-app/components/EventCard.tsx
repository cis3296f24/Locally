import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import { images, icons } from '@/constants'

const EventCard = () => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-none w-[275px] mx-auto my-4 items-center">
      <View className='relative'>
        <Image
          source={ images.dog }
          className='w-[250px] h-[180px] rounded-lg'
          resizeMode='cover'
        />

        <View className="absolute top-2 left-2 bg-white/80 rounded-lg px-2 py-1 h-[50px] flex justify-center items-center">
          <Text className="text-xs font-bold text-orange-600">01</Text>
          <Text className="text-[10px] font-semibold text-gray-500">NOV</Text>
        </View>

        <TouchableOpacity className="absolute top-2 right-2 bg-white/80 p-2 rounded-lg">
          <Image 
            source={icons.bookmarkFilled}
            className="w-5 h-5"
          />
        </TouchableOpacity>
      </View>

      <View className='w-full'>
        <Text className="text-2xl font-semibold text-gray-900 my-6">Candlelight Fine Dining</Text>
        <View className="flex-row items-center ml-1.5">
          <Image 
            source={ icons.bookmarkFilled } // Replace with actual image URLs
            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
          />
          <Image 
            source={ icons.bookmarkFilled } 
            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
          />
          <Image 
            source={ icons.bookmarkFilled } 
            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
          />
          <Text className="ml-1 text-primary-pBlue font-medium">+20 Going</Text>
        </View>

        <View className="flex-row items-center mt-6 justify-between">
          <View className='flex-row'>
            <Image 
              source={ icons.marker }
              className="w-4 h-4 mr-1"
            />
            <Text className="text-gray-500 text-sm">
              1234 Chestnut St, Philadelphia
            </Text>
          </View>
          <View className='bg-yellow-400 rounded-full px-2 py-1'>
            <Text className='text-white'>$</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventCard