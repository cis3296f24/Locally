import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import GoogleButton from '../components/GoogleButton'
import FormInput from '../components/FormInput'

const PrimaryButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-[#40BFFF] rounded-xl py-4"
    >
        <View className="flex-row items-center justify-center">
            <Text className="text-white font-semibold">
                {text}
            </Text>
            <View className="bg-[#003566] rounded-full p-1.5 ml-3">
                <Ionicons name="arrow-forward" size={16} color="white" />
            </View>
        </View>
    </TouchableOpacity>
)

const SignUpScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        //router.push('/(tabs)/metadata')
    }

    const handleGoogleLogin = () => {
    }

    return (
        <View className="flex-1 bg-white p-6">
            {/* Logo and Title */}
            <View className="items-center mb-8">
                <Image
                    source={require('../assets/images/splash.png')}
                    className="w-64 h-64"
                />
                <Text className="text-2xl font-bold text-center">Sign Up</Text>
            </View>

            {/* Sign Up Form */}
            <View className="mb-6">
                <FormInput
                    icon="person-outline"
                    placeholder="Full name"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <FormInput
                    icon="mail-outline"
                    placeholder="abc@email.com"
                    value={email}
                    onChangeText={setEmail}
                />
                <FormInput
                    icon="lock-closed-outline"
                    placeholder="Your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <PrimaryButton
                    text="REGISTER"
                    onPress={handleSignUp}
                />
            </View>

            <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-4 text-gray-500">OR</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <GoogleButton onPress={handleGoogleLogin} />

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text className="text-[#40BFFF]">Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignUpScreen