import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

interface GoogleButtonProps {
    onPress: () => void;
}

const GoogleButton = ({ onPress }: GoogleButtonProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-4"
        >
            <Image 
                source={require('../assets/images/google.png')} 
                className="w-5 h-5" 
            />
            <Text className="ml-2 text-gray-700">Login with Google</Text>
        </TouchableOpacity>
    )
}

export default GoogleButton
