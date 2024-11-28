import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import { images, icons } from '@/constants'
import { CardPopProps } from '@/types/type';
import { formatDate } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';

const CardPop = ({
  event,
  styling='max-w-[90%]',
  imageSize='w-[85px] h-[85px]',
  onClick 
}: CardPopProps) => {

  const imageSource = event.coverImage
    ? { uri: event.coverImage }
    : images.noImage;

  const eventDate = formatDate(event.dateStart);
  const eventAddress = `${event.street}, ${event.city}`;

  const handleBookmarkClick = async () => {
    if (!event) return;

    // if (selectedEvent.isBookmarked) {
    //     await unbookmarkEvent(user.id, selectedEvent.id);
    // } else {
    //     await bookmarkEvent(user.id, selectedEvent.id);
    // }

    // setSelectedEvent({ ...selectedEvent, isBookmarked: !selectedEvent.isBookmarked });
    // const eventToUpdate = events.find((event) => event.id === selectedEvent.id);

    // if (eventToUpdate) {
    //     eventToUpdate.isBookmarked = !selectedEvent.isBookmarked; // Update the bookmark status
    // }

    // setEvents([...events]);
  }

  return (
    <TouchableOpacity 
      onPress={onClick}
      className={`${styling} flex-row rounded-2xl gap-4 p-3 bg-white self-center w-full`}
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
          
          <View className='justify-between flex-1 mt-2'>
            <Text className="font-semibold text-gray-900 line-clamp-2">
              {event.title}
            </Text>
            
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
        </View>

        <View className="items-center justify-between">
          <TouchableOpacity 
            onPress={handleBookmarkClick}
          >
            {event.isBookmarked ? (
                <Ionicons name="bookmark" size={24} color="#003566" />
            ): (
                <Ionicons name="bookmark-outline" size={24} color="#003566" />
            )}
          </TouchableOpacity>
          {event.price && (
            <View className="bg-yellow-400 rounded-full px-2 py-1">
              <Text className="text-white">$</Text>
            </View>
          )}
        </View>
      </>
    </TouchableOpacity>
  );
};

export default CardPop