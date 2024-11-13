import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import { images, icons } from '@/constants'
import { CardPopProps } from '@/types/type';
import { formatDate } from '@/utils/util';

const CardPop = ({
  event,
  additionalStyling,
  style, 
}: CardPopProps) => {

  const basicStyling = "bg-white p-3 rounded-2xl shadow-none w-[340px] flex-row items-center"
  const styling = style ? style: basicStyling
  const imageSource = event.coverImage
    ? { uri: event.coverImage }
    : images.noImage;

  const eventDate = formatDate(event.dateStart);
  const eventAddress = `${event.street}, ${event.city}`;

  return (
    <View className={`${styling} ${additionalStyling}`}>
      <View className='relative w-[100px] h-[100px]'>
        <Image
          source={ imageSource }
          className='w-full h-full rounded-xl'
          resizeMode='cover'
        />
      </View>

      <View className='flex-1 pl-3'>
        <View className="flex-row items-center">
          <View className="bg-pink-100 rounded-lg px-2 py-1">
            <Text className="text-xs font-medium text-pink-600">
              {eventDate}
            </Text>
          </View>
          <TouchableOpacity className="ml-auto">
            <Image 
              source={icons.bookmarkFilled}
              className="w-5 h-6 mx-1"
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
            {eventAddress}
          </Text>
          
          { event.price && (
            <View className='bg-yellow-400 rounded-full ml-6 px-2 py-1'>
              <Text className='text-white'>$</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CardPop