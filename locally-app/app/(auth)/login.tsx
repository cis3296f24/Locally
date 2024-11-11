import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import GoogleButton from '../../components/GoogleButton'
import FormInput from '../../components/FormInput'

import { images } from '@/constants'
import PrimaryButton, { LoadingIndicator } from '@/components/PrimaryButton'
import { signInUser } from '@/services/firebase-service'

//Login logic goes here
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)

        try {
            const user = await signInUser({email, password })
            
            if (user) {
                console.log('User signed in successfully', user)
                setLoading(false)
                router.navigate('/(tabs)/explore')
            }
        } catch (error: any) {
            console.log('Error signing in', error.message)
            Alert.alert('Error', error.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
    }

    return (
        <View className="flex-1 bg-white p-6">
            {/* Logo and Title */}
            <View className="items-center mt-24 gap-4">
                <Image
                    source={ images.logo }
                    className="w-32 h-32"
                />
                <Text className="text-3xl font-bold text-center">Locally</Text>
            </View>

            {/* Login Form */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-start my-8">Log In</Text>

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

                <TouchableOpacity className="self-end mb-4">
                    <Text className="text-orange-500">Forgot Password?</Text>
                </TouchableOpacity>

                { loading ? 
                    <LoadingIndicator /> : 
                    <PrimaryButton
                        text="LOG IN"
                        onPress={handleLogin}
                    />
                }
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-4 text-gray-500">OR</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <GoogleButton onPress={handleGoogleLogin} />


            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                {/* <TouchableOpacity onPress={() => router.push('./signup')}>
                    <Text className="text-blue-500">Sign up</Text>
                </TouchableOpacity> */}
                <Link href="./signup" className="text-blue-500 font-semibold">Sign up</Link>
            </View>
        </View>
    )
}

export default LoginScreen