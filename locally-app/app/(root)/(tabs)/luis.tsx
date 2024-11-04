import { View, Text } from 'react-native'
import React from 'react'
import {Link} from 'expo-router';

const Luis = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="bg-[#003566] p-4 rounded-md">
        <Text className="text-white text-lg font-bold">Luis</Text>
        <Link href="/event-details"><Text>Concert Event Example</Text></Link>
      </View>
    </View>
  )
}

export default Luis