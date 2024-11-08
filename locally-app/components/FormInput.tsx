import { View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

interface FormInputProps {
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    secureTextEntry?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
}

const FormInput = ({ 
    icon, 
    placeholder, 
    secureTextEntry = false,
    value,
    onChangeText 
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 mb-4">
            <Ionicons name={icon} size={20} color="#999" />
            <TextInput 
                placeholder={placeholder}
                className="flex-1 py-3 px-3"
                secureTextEntry={secureTextEntry && !showPassword}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
            />
            {secureTextEntry && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#999" 
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default FormInput