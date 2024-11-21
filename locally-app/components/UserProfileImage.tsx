
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'

const UserProfileImage = ({
  image,
  name,
  isOnline = false,
  imageStyle = "w-20 h-20",
  textStyle = "text-sm mt-1 font-bold",
  buttonStyle = "items-center mr-4",
  onPress
} : {
  image?: string,
  name?: string,
  isOnline?: boolean,
  imageStyle?: string,
  textStyle?: string,
  buttonStyle?: string,
  onPress: () => void
}) => {
  const imageSource = image 
    ? { uri: image } 
    : images.noProfileImage

  return (
    <TouchableOpacity
      onPress={onPress}
      className={buttonStyle}
    >
      <View className="relative">
        <Image
          source={imageSource}
          className={`${imageStyle} rounded-full`}
        />
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-300 rounded-full border-2 border-white" />
        )}
      </View>
      
      { name && <Text className={textStyle}>{name}</Text> }

    </TouchableOpacity>
  );
}

export default UserProfileImage