import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import GoogleButton from '../../components/GoogleButton'
import FormInput from '../../components/FormInput'

import { images } from '@/constants'
import PrimaryButton from '@/components/PrimaryButton'
import { fetchAllUsers, fetchBookmarkedEventsByUserId, fetchTicketsByUser, fetchCreatedEventsByUserId, fetchUserProfileById, signInUser } from '@/services/firebase-service'
import { useTicketStore } from '@/store/ticket'
import { useUserStore } from '@/store/user'
import useNativeNotify from '@/services/native-notify'

//Login logic goes here
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { registerDevice, registerFollowMaster } = useNativeNotify();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)

        try {
            const { user } = await signInUser({email, password })
            
            if (user) {
                const [
                    currentuser,
                    users,
                    bookmarkEvents,
                    createdEvents,
                    ticketList
                ] = await Promise.all([
                    fetchUserProfileById(user.id),
                    fetchAllUsers(),
                    fetchBookmarkedEventsByUserId(user.id),
                    fetchCreatedEventsByUserId(user.id),
                    fetchTicketsByUser(user.id),
                ]);

                useUserStore.getState().setUser(currentuser);
                useUserStore.getState().setUserList(users);
                useUserStore.getState().setUserBookmarkedEvents(bookmarkEvents);
                useUserStore.getState().setUserCreatedEvents(createdEvents);
                useTicketStore.getState().setTicketList(ticketList);
                registerDevice(user.id);
                registerFollowMaster(user.id);

                // const ticketList = await fetchTicketsByUser(user.id);
                // useTicketStore.getState().setTicketList(ticketList);

                // const users = await fetchAllUsers();
                // useUserStore.getState().setUserList(users);

                setLoading(false)
                router.replace('/(root)/(tabs)/explore')
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
                <Text className="text-3xl font-bold text-primary-pBlue text-center">
                    Locally
                </Text>
            </View>

            {/* Login Form */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-start text-primary-pBlue my-8">
                    Log In
                </Text>

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

                <TouchableOpacity className="self-end mb-4">
                    <Text className="text-orange-500">Forgot Password?</Text>
                </TouchableOpacity>

                <PrimaryButton
                    text="Log In"
                    icon="door-open"
                    onPress={handleLogin}
                    loading={loading}
                />
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
                <Link href="./signup" className="text-secondary-sBlue font-semibold">Sign up</Link>
            </View>
        </View>
    )
}

export default LoginScreen