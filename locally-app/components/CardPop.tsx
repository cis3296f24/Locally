import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, icons } from '@/constants'
import { CardPopProps, Event } from '@/types/type';
import { formatDate } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import { handleBookmark } from '@/utils/event';
import { useUserStore } from '@/store/user';

const CardPop = ({
  event,
  styling='max-w-[90%]',
  imageSize='w-[85px] h-[85px]',
  isBookmarkShown=true,
  isCardDisabled=false,
  onEventClick,
}: {
  event: Event;
  styling?: string;
  imageSize?: string;
  isBookmarkShown?: boolean;
  isCardDisabled?: boolean;
  onEventClick?: () => void;
}) => {
  const { userBookmarkedEvents } = useUserStore();
  const imageSource = event.coverImage
    ? { uri: event.coverImage }
    : images.noImage;

  const eventDate = formatDate(event.dateStart);
  const eventAddress = `${event.street}, ${event.city}`;

  // Check if bookmarked
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const isBookmarked = userBookmarkedEvents.some(bookmarkEvent => bookmarkEvent.id === event.id);
    setIsBookmarked(isBookmarked);
  }, [isBookmarked, event.id, userBookmarkedEvents]);

  const handleBookmarkClick = async () => {
    const bookmarked = await handleBookmark(event, isBookmarked);
    setIsBookmarked(bookmarked as boolean);
  }

  return (
    <TouchableOpacity 
      onPress={onEventClick}
      className={`${styling} flex-row rounded-2xl gap-4 p-3 bg-white self-center w-full`}
      disabled={isCardDisabled}
    >
      <>
        <Image
          source={imageSource}
          className={`rounded-xl ml-0.5 ${imageSize}`}
          resizeMode="cover"
        />

        <View className="items-start flex-1">
          <View className="bg-pink-100 rounded-lg px-2 py-1">
            <Text className="text-xs font-medium text-pink-600">
              {eventDate}
            </Text>
          </View>
          
          <View className='flex-1 mt-2'>
            <Text className="font-semibold text-gray-900 line-clamp-2">
              {event.title}
            </Text>
          </View>

          <View className='flex-row items-center'>
            <Image
              source={icons.marker}
              className="w-3.5 h-3.5 mr-1"
            />
            <Text className="text-gray-500 text-xs flex-1">
              {eventAddress}
            </Text>
          </View>
        </View>

        <View className="items-center justify-between w-[26px]">
          {isBookmarkShown && (
            <TouchableOpacity 
              onPress={handleBookmarkClick}
            >
              {isBookmarked ? (
                  <Ionicons name="bookmark" size={24} color="#003566" />
              ): (
                  <Ionicons name="bookmark-outline" size={24} color="#003566" />
              )}
            </TouchableOpacity>
          )}
          {event.price && (
              <Text className="text-white bg-yellow-400 rounded-full py-1 px-2">$</Text>
          )}
        </View>
      </>
    </TouchableOpacity>
  );
};

export default CardPop