import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { signInWithGoogle, signUpUser, fetchAllUsers, fetchUserProfileById } from '@/services/firebase-service';
import { useUserStore } from '@/store/user';
import GoogleButton from '../../components/GoogleButton';
import FormInput from '../../components/FormInput';
import PrimaryButton from '@/components/PrimaryButton';
import { images } from '@/constants';
import { makeRedirectUri } from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: Constants.expoConfig?.extra?.IOS_CLIENT_ID,
        androidClientId: Constants.expoConfig?.extra?.ANDROID_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.idToken && authentication?.accessToken) {
                handleGoogleSignIn(authentication.idToken, authentication.accessToken);
            }
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken: string, accessToken: string) => {
        setLoading(true);
        try {
            const { user } = await signInWithGoogle(idToken, accessToken);
            if (user) {
                const [
                    currentuser,
                    users,
                ] = await Promise.all([
                    fetchUserProfileById(user.id),
                    fetchAllUsers(),
                ]);

                useUserStore.getState().setUser(currentuser);
                useUserStore.getState().setUserList(users);

                setLoading(false);
                router.replace('/(root)/(tabs)/explore');
            }
        } catch (error: any) {
            console.log('Error signing in with Google', error.message);
            Alert.alert('Error', error.message);
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);

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

                setLoading(false);
                router.replace('/(root)/(tabs)/explore');
            }
        } catch (error: any) {
            console.log('Error signing up with Google', error.message);
            Alert.alert('Error', error.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        promptAsync();
    };

    return (
        <View className="flex-1 bg-white p-6">
            {/* Logo and Title */}
            <View className="items-center mt-24 gap-4">
                <Image
                    source={images.logo}
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