import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React, { useEffect, useState } from 'react'

import { images, icons } from '@/constants'
import { Event } from '@/types/type';
import { formatAddress } from '@/utils/util';
import { useUserStore } from '@/store/user';
import { handleBookmark } from '@/utils/event';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({
  event,
  styling
}: {
  event: Event;
  styling?: string;
}) => {
  const imageSource = event.coverImage
    ? { uri: event.coverImage }
    : images.noImage;
  const startDate = event.dateStart.toDate();
  const formattedDate = `${startDate.getDate()}`;
  const formattedMonth = startDate.toLocaleString('default', { month: 'short' });

  // Check if bookmarked
  const { userBookmarkedEvents } = useUserStore();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const isBookmarked = userBookmarkedEvents.some(bookmarkEvent => bookmarkEvent.id === event.id);
    setIsBookmarked(isBookmarked);
    console.log('isBookmarked', isBookmarked);
  }, [isBookmarked, event.id, userBookmarkedEvents]);

  const handleBookmarkClick = async () => {
    const bookmarked = await handleBookmark(event, isBookmarked);
    setIsBookmarked(bookmarked as boolean);
  }

  return (
    <View className={`bg-white p-4 rounded-lg shadow-none w-[275px] items-center ${styling}`}>
      <View className='relative'>
        <Image
          source={imageSource}
          className='w-[250px] h-[180px] rounded-lg'
          resizeMode='cover'
        />

        <View className="absolute top-2 left-2 bg-white/90 rounded-lg px-2 py-1 h-[50px] flex justify-center items-center">
          <Text className="text-xs font-bold text-orange-600">{formattedDate}</Text>
          <Text className="text-[10px] uppercase font-semibold text-gray-500">{formattedMonth}</Text>
        </View>

        <TouchableOpacity 
          className="absolute top-2 right-2 bg-white/80 py-3 px-1 rounded-lg"
          onPress={handleBookmarkClick}
        >
          {isBookmarked ? (
            <Ionicons name="bookmark" size={28} color="#003566" />
          ): (
            <Ionicons name="bookmark-outline" size={28} color="#003566" />
          )}
        </TouchableOpacity>
      </View>

      <View className='w-full'>
        <Text className="text-xl font-semibold text-gray-900 mt-3 mb-6 line-clamp-2">
          {event.title}
        </Text>
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

        <View className="flex-row items-center mt-2 justify-between pr-12">
          <View className='flex-row items-center'>
            <Image 
              source={ icons.marker }
              className="w-4 h-4 mr-1"
            />
            <View className='flex-1'>
              <Text className="text-gray-500 text-sm line-clamp-1">
                {event.locationName}
              </Text>
            </View>
          </View>
          
          { event.price && (
            <View className='bg-yellow-400 rounded-full mx-6 px-2 py-1'>
              <Text className='text-white'>$</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventCard