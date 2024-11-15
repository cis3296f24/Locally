import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOutUser } from '@/services/firebase-service'
import { router } from 'expo-router'

const Maxwell = () => {

  const handleSignOut = async () => {
    const isSignedOut = await signOutUser()
    if (isSignedOut) {
      console.log('User signed out successfully')
      router.replace('/(auth)/login')
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <TouchableOpacity 
        className="bg-[#003566] p-4 rounded-md"
        onPress={handleSignOut}
      >
        <Text className="text-white text-lg font-bold">Maxwell</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Maxwell