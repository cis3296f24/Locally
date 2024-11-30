import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

interface FormInputProps {
    title?: string;
    icon?: any;
    placeholder: string;
    secureTextEntry?: boolean;
    value?: any;
    maxLength?: number;
    isLongText?: boolean;
    isNumeric?: boolean;
    onChangeText?: (text: string) => void;
}

const FormInput = ({
    title, 
    icon, 
    placeholder, 
    secureTextEntry = false,
    value,
    maxLength,
    isLongText = false,
    isNumeric = false,
    onChangeText 
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
        { title && <Text className="text-lg text-primary-pBlue font-semibold">{title}</Text> }
        <View className="flex-row flex-1 items-center bg-white border border-secondary-sBlue rounded-xl px-4 mb-4">
            {icon && <Ionicons name={icon} size={20} color={"#999"} />}
            <TextInput 
                placeholder={placeholder}
                className={`flex-1 py-4 ${value ? 'text-primary-pBlue font-medium' : 'text-gray-400'} ${icon ? 'pl-2' : 'pl-0'} ${isLongText ? 'h-32' : ''}`}
                secureTextEntry={secureTextEntry && !showPassword}
                placeholderTextColor="#999"
                value={value}
                maxLength={maxLength}
                multiline={isLongText}
                textAlignVertical={isLongText ? 'top' : 'center'}
                keyboardType={isNumeric ? 'numeric' : 'default'}
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
        </View></>
    )
}

export default FormInput


