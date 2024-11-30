import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import GoogleButton from '../../components/GoogleButton'
import FormInput from '../../components/FormInput'

import { images } from '@/constants'
import PrimaryButton from '@/components/PrimaryButton'
import { fetchAllUsers, fetchUserProfileById, signUpUser } from '@/services/firebase-service'
import { useUserStore } from '@/store/user'

const SignUpScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)

        try {
            const user = await signUpUser({fullName, email, password })
            
            if (user) {
                const [
                    currentuser,
                    users,
                ] = await Promise.all([
                    fetchUserProfileById(useUserStore.getState().user?.id as string),
                    fetchAllUsers(),
                ]);

                useUserStore.getState().setUser(currentuser);
                useUserStore.getState().setUserList(users);

                setLoading(false)
                router.replace('/(root)/(tabs)/explore')
            }
        } catch (error: any) {
            console.log('Error signing up', error.message)
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
                <Text className="text-3xl font-bold text-center text-primary-pBlue">
                    Locally
                </Text>
            </View>

            {/* Sign Up Form */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-primary-pBlue text-start my-8">
                    Sign Up
                </Text>

                <View className='flex-row'>
                    <FormInput
                        icon="person-outline"
                        placeholder="Full name"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View className='flex-row'>
                    <FormInput
                        icon="mail-outline"
                        placeholder="abc@email.com"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View className='flex-row'>
                    <FormInput
                        icon="lock-closed-outline"
                        placeholder="Your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <PrimaryButton
                    text="Register"
                    icon="pencil-remove-outline"
                    onPress={handleSignUp}
                    loading={loading}
                    buttonStyle='mt-4'
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
                <Link href="./login" className="text-secondary-sBlue font-semibold">Log In</Link>
            </View>
        </View>
    )
}

export default SignUpScreen