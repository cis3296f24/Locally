import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { images, icons } from '@/constants'
import { CardPopProps } from '@/types/type';

const CardPop = ({
  event,
  styling,
}: CardPopProps) => {
  return (
    <View className={`bg-white p-3 rounded-2xl shadow-none w-[340px] flex-row items-center ${styling}`}>
      <View className='relative w-[100px] h-[100px]'>
        <Image
          source={ images.dog }
          className='w-full h-full rounded-xl'
          resizeMode='cover'
        />
      </View>

      <View className='flex-1 pl-3'>
        <View className="flex-row items-center">
          <View className="bg-pink-100 rounded-lg px-2 py-1">
            <Text className="text-xs font-medium text-pink-600">Fri, Nov 01</Text>
          </View>
          <TouchableOpacity className="ml-auto">
            <Image 
              source={icons.bookmarkFilled}
              className="w-5 h-5"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-base font-semibold text-gray-900 mt-2">{event.title}</Text>
        
        <View className="flex-row items-center mt-2">
          <Image 
            source={ icons.marker }
            className="w-3.5 h-3.5 mr-1"
          />
          <Text className="text-gray-500 text-xs flex-1">
            2334 Chestnut St, Philadelphia
          </Text>
          <View className='bg-yellow-400 rounded-full px-1.5 py-0.5 ml-2'>
            <Text className='text-white text-xs'>{event.emote}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardPop