import PrimaryButton from '@/components/PrimaryButton';
import UserProfileImage from '@/components/UserProfileImage';
import { signOutUser, updateUserProfile, uploadImage } from '@/services/firebase-service';
import useLocationStore from '@/store/locationStore';
import { useUserStore } from '@/store/user';
import { AntDesign, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User } from '@/types/type';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import Payment from '@/components/Payment';

export default function EditProfile() {

  const user = useUserStore((state) => state.user);
  const userLocation = useLocationStore((state) => state.userCity);

  const [image, setImage] = useState(user?.profileImage);
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [isEditing, setIsEditing] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const handleOpenSheet = () => setIsVisible(true);
  const handleCloseSheet = () => setIsVisible(false);

  const handleSubscribe = async () => {
    if (user) {
      let updatedUser: User = { ...user };
      updatedUser.isSubscribed = true;
      useUserStore.setState({ user: updatedUser });
      await updateUserProfile(updatedUser);
    }

    setIsVisible(false);
  }
  const handleUnsubscribe = () => {}

  const handleImageClick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handleEdittingClick = async () => {
    if (isEditing && user) {
      try {
        let updatedUser: User = { ...user };

        if (image && image !== user.profileImage) {
          const imageUrl = await uploadImage(image, user.id, 'profile_images');
          updatedUser.profileImage = imageUrl;
          setImage(imageUrl); 
        }

        if (username && username !== user.username) {
          updatedUser.username = username;
          setUsername(username); 
        }

        if (bio && bio !== user.bio) {
          updatedUser.bio = bio;
          setBio(bio); 
        }

        if (updatedUser.username !== user.username 
          || updatedUser.profileImage !== user.profileImage
          || updatedUser.bio !== user.bio
        ) {
          useUserStore.setState({ user: updatedUser });
          await updateUserProfile(updatedUser);
          
          Alert.alert("Profile Updated", "Your profile has been updated successfully");
        } else {
          console.log("No changes detected, profile not updated");
        }
      } catch (error) {
        console.log("Error while updating profile:", error);
        Alert.alert("Error", "An error occurred while updating your profile");
      }
    }
    
    setIsEditing(!isEditing);
  }

  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleSignOut = async () => {
    const isSignedOut = await signOutUser()
    if (isSignedOut) {
      console.log('User signed out successfully')
      router.replace('/(auth)/login')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="py-8 px-0 flex-grow flex-shrink basis-0">
        <View className='flex-row justify-between items-center'>
          <TouchableOpacity onPress={() => router.back()}>
            <View className="flex-row gap-2 pl-3 my-4 items-center ml-5">
              <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
              <Text className="text-2xl">Settings</Text>
            </View>
          </TouchableOpacity>

          {user?.isSubscribed ? (
            <TouchableOpacity
              onPress={handleUnsubscribe}
              className="bg-white border border-[#FFC300] h-10 px-2 py-1 rounded-full items-center justify-center mr-5"
            >
              <Text className="text-[#FFC300] font-semibold text-md">Unsubscribe</Text>
            </TouchableOpacity>
          ): (
            <TouchableOpacity
              onPress={handleOpenSheet}
              className="bg-[#FFC300] h-10 px-2 py-1 rounded-full items-center justify-center mr-5"
            >
              <Text className="text-white font-semibold text-md">Become a Host</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView>
          {/* Profile Section */}
          <View className="py-6 items-center bg-white border-t border-b border-gray-300">
            <UserProfileImage 
              image={image}
              name={isEditing ? "" : user?.username}
              imageStyle='w-[100px] h-[100px]'
              textStyle='text-2xl font-semibold text-gray-900 mt-3'
              isDisabled={!isEditing}
              onPress={handleImageClick}
            />

            {isEditing && (
              <View className='-mt-6 -mr-16 bg-white rounded-full p-1'>
                <View>
                  <AntDesign name="camera" size={12} color="black" />
                </View>
              </View>
            )}

            { isEditing && (
              <TextInput 
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="gray"
                className="items-center justify-center my-2 text-2xl font-semibold text-gray-500 border-b border-gray-300"
                maxLength={16}
              />
            )}

            <Text className="my-1 text-lg text-gray-500">
              {user?.email}
            </Text>

            { isEditing && (
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Enter bio"
                placeholderTextColor="gray"
                className="w-[90%] items-start justify-start my-4 p-4 rounded-xl text-md text-gray-500 border border-gray-300 h-[150px]"
                multiline
                maxLength={500}
              />
            )}


            <TouchableOpacity onPress={handleEdittingClick}>
              <View className="mt-3 py-2 px-4 flex-row items-center justify-center bg-secondary-sBlue rounded-lg">
                {isEditing ? (
                  <Text className="text-sm font-semibold text-white">Save</Text>
                ): (
                  <Text className="text-sm font-semibold text-white">Edit Profile</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Preferences Section */}
          <View className="pt-3">
            <Text className="mx-6 my-2 text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Preferences
            </Text>

            <SettingRow 
              icon={
                <Ionicons name="globe-outline" size={24} color="white" />
              }
              title="Language"
              rightElement={
                <View className='flex-row gap-2 justify-center items-center'>
                  <Text className="text-xl font-medium text-gray-400">English</Text>
                  <FontAwesome6 name="angle-right" size={20} color="#C6C6C6" />
                </View>
              }
              onPress={() => {}}
            />

            <SettingRow 
              icon={
                <Ionicons name="moon-outline" size={24} color="white" />
              }
              title="Dark Mode"
              isDisabled={true}
              rightElement={
                <Switch
                  onValueChange={(darkMode) => setForm({ ...form, darkMode })}
                  value={form.darkMode}
                  trackColor={{ false: "#767577", true: "#39C3F2" }}
                />
              }
            />

            <SettingRow 
              icon={
                <MaterialCommunityIcons name="navigation-variant-outline" size={24} color="white" />
              }
              title="Location"
              isLast={true}
              rightElement={
                <View className='flex-row gap-2 justify-center items-center'>
                  <Text className="text-xl font-medium text-gray-400">{userLocation}</Text>
                  <FontAwesome6 name="angle-right" size={20} color="#C6C6C6" />
                </View>
              }
            />

            <Text className="mx-6 mt-5 mb-2 text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Notifications
            </Text>

             <SettingRow 
              icon={
                <FontAwesome6 name="bell" size={24} color="white" />
              }
              title="Push Notifications"
              isDisabled={true}
              isLast={true}
              rightElement={
                <Switch 
                  onValueChange={(pushNotifications) =>setForm({ ...form, pushNotifications })}
                  value={form.pushNotifications}
                  trackColor={{ false: "#767577", true: "#39C3F2" }}
                />
              }
            />
          </View>

          <PrimaryButton 
            text="Sign Out"
            onPress={handleSignOut}
            icon={"home-export-outline"}
            buttonStyle="mt-16 mx-24"
          /> 
        </ScrollView>

        <View className='absolute bottom-1 items-center justify-center w-screen'>
          <Text className="text-sm font-medium text-gray-400 text-center">
            Made with ❤️ from Philadelphia
          </Text>
        </View>
        
        <BecomeHostSheet 
          isVisible={isVisible}
          onClose={handleCloseSheet}
          onSuccess={handleSubscribe}
        />
      </View>
    </SafeAreaView>
  );
}

const SettingRow = ({ 
  icon, 
  title,
  rightElement,
  isDisabled = false,
  isLast = false, 
  onPress 
}: {
  icon: any;
  title: string;
  rightElement: any;
  isDisabled?: boolean;
  isLast?: boolean;
  onPress?: () => void;
}) => {
  return (
    <View className={`pl-6 pr-2 py-3 bg-white border-t border-gray-300 ${isLast && "border-b"}`}>
      <TouchableOpacity 
        onPress={onPress} 
        className="flex-row items-center justify-start pr-4 h-12.5"
        disabled={isDisabled}
      >
        <View className={`h-10 w-10 rounded-md items-center justify-center bg-secondary-sBlue mr-3`}>
          {icon}
        </View>
        <Text className="text-xl font-medium text-primary-pBlue">{title}</Text>
        <View className="flex-grow" />
        {rightElement}
      </TouchableOpacity>
    </View>
  );
}

const BecomeHostSheet = ({
  isVisible,
  onClose,
  onSuccess
}: {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {

  const user = useUserStore((state) => state.user);

  return (
    <StripeProvider
      publishableKey={Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.locally.app"
      urlScheme="myapp"
    >
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50">
          <View className="bg-white mt-auto rounded-t-3xl py-6 px-4">

            <View className='flex-row justify-end'>
              <View>
                <TouchableOpacity 
                  onPress={onClose} 
                  className="p-2"
                >
                  <Ionicons name="close" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          

            <Text className="text-2xl font-semibold text-center text-gray-900">
              Become a Host
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Host events around your area and enjoy unlimited support!
            </Text>
          
            <View className="gap-4 px-6 my-12">
              <BenefitItem 
                icon={<MaterialIcons name="event-available" size={30} color="white" />}
                title="Host Events Locally"
                description="Create and promote events in your community."
              />

              <BenefitItem 
                icon={<MaterialIcons name="support-agent" size={30} color="white" />}
                title="Unlimited Support"
                description="Get assistance any time to manage your events smoothly."
              />

              <BenefitItem 
                icon={<MaterialCommunityIcons name="account-group-outline" size={30} color="white" />}
                title="Grow Your Community"
                description="Expand your reach and connect with more people."
              />
            </View>   

            <View className="gap-4 px-6">
              <Payment
                title="Subscribe for $15/month"
                name={user?.fullName}
                email={user?.email}
                amount="15"
                textStyle='text-xl capitalize text-white'
                onPaymentStatus={(status) => {
                  if (status === 'success') {
                    onSuccess();
                  }
                }}
              />
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="my-8 py-2"
            >
              <Text className="text-center text-xl text-gray-500 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </StripeProvider>
  );
};

const BenefitItem = ({
  icon,
  title,
  description
}: {
  icon: any;
  title: string;
  description: string;
}) => {
  return (
    <View className="flex-row items-center">
      <View className="bg-primary-pBlue p-2 rounded-full">
        {icon}
      </View>
      <View className="ml-4">
        <Text className="text-gray-900 font-medium">{title}</Text>
        <Text className="text-gray-600 text-sm">{description}</Text>
      </View>
    </View>
  );
}