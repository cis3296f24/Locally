
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'

const UserProfileImage = ({
  image,
  name,
  isOnline = false,
  isSubscribed = false,
  isDisabled = false,
  imageStyle = "w-20 h-20",
  dotStyle = "bottom-0 right-0 w-4 h-4",
  textStyle = "text-sm mt-1 font-bold",
  buttonStyle = "items-center",
  onPress
} : {
  image?: string,
  name?: string,
  isOnline?: boolean,
  isSubscribed?: boolean,
  isDisabled?: boolean,
  imageStyle?: string,
  dotStyle?: string,
  textStyle?: string,
  buttonStyle?: string,
  onPress?: () => void
}) => {
  const imageSource = image 
    ? { uri: image } 
    : images.noProfileImage

  return (
    <TouchableOpacity
      onPress={onPress}
      className={buttonStyle}
      disabled={isDisabled}
    >
      <View className="relative items-center justify-center">
        <Image
          source={imageSource}
          className={`${imageStyle} rounded-full`}
        />
        {isOnline && (
          <View className={`absolute ${dotStyle} bg-green-300 rounded-full border-2 border-white`} />
        )}
        {isSubscribed && (
          <View className={`absolute ${dotStyle} bg-secondary-sBlue rounded-full border-2 border-white`} />
        )}
      </View>
      
      { name &&  
        <View className='justify-center, items-center'>
          <Text className={`${textStyle}`}>
            {name}
          </Text>
        </View>
      }

    </TouchableOpacity>
  );
}

export default UserProfileImage