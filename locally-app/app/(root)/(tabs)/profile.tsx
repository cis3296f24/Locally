import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import { signOutUser } from '@/services/firebase-service'
import { router } from 'expo-router'
import { useEventStore } from '@/store/event';
import { images } from '@/constants';
import { formatEventDate } from '@/utils/util';
import SeeAll from '@/components/SeeAll';
import CardPop from '@/components/CardPop';
import UserProfileImage from '@/components/UserProfileImage';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/user';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("BIO");
  const { events, setEvents, setListTitle } = useEventStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUserStore();

  const handleSeeAllClick = (title: string) => {
    setListTitle(title)
    router.push('/(root)/event-list')
  }

  const handleHambugerClick = async () => {
    const isSignedOut = await signOutUser()
    if (isSignedOut) {
      console.log('User signed out successfully')
      router.replace('/(auth)/login')
    }
  }

  const userAlt = {
    name: "David Rose",
    following: 350,
    followers: 346,
    bio: "Traveling to new places and connecting with people from diverse backgrounds broadens my perspective and enriches my life. I enjoy immersing myself in the cultures, traditions, and cuisines of the destinations I visit. Whether it’s exploring bustling cities, trekking through serene landscapes, or simply engaging in heartfelt conversations, every journey offers a unique opportunity to grow.",
    events: [
      {
        id: 1,
        title: "Ticket to Wonderland",
        dateStart: "2024-10-22T00:00:00",
        street: "123 Wonder Ave",
        city: "Wonderland City",
        description: "I had such a fun time here. Would definitely join again.",
        coverImage: images.dog,
        price: true,
      },
      {
        id: 2,
        title: "Democracy Rules",
        dateStart: "2024-10-22T00:00:00",
        street: "456 Democracy St",
        city: "Liberty City",
        description: "I had such a fun time here. Would definitely join again.",
        coverImage: images.dog,
        price: false,
      }
    ]
  };

  const renderHistoryTab = () => {  
    return (
      <FlatList
        data={events.slice(0, 2)}
        keyExtractor={(item) => item.id.toString()}
        className='bg-white mt-8 gap-2' 
        renderItem={({ item }) => {
          const formattedDate = formatEventDate(item.dateStart, true); 
  
          return (
            <TouchableOpacity>
              <View 
                className="flex-row rounded-2xl mb-4 bg-white shadow-md shadow-slate-300">
                <Image 
                  source={images.man2} 
                  className='w-[85px] h-[85px] rounded-xl m-3'
                />
                <View className='flex-1 py-3 justify-between pr-2'>
                  <View className='gap-1'>
                    <Text className='font-semibold text-primary-pBlue'>
                      {item.title}
                    </Text>
                    <Text className='text-sm text-gray-600 text-ellipsis line-clamp-2'>
                      {item.description}
                    </Text>
                  </View>
                  
                  <Text className='text-secondary-sBlue text-[12px]'>
                    {formattedDate}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const renderFavoriteTab = () => (
    <View className='bg-white gap-4 mt-4'>
      <View>
        <SeeAll
          title='My Events'
          styling='m-2'
          seeAllColor='text-secondary-sBlue'
          arrowColor='#39C3F2'
          onSeeAllPress={(value) => handleSeeAllClick(value)} 
        />

        {events.slice(0, 2).map((event) => (
          <View 
            key={event.id} 
            className='bg-white rounded-2xl w-full items-center my-2'>
            <CardPop 
              event={event}
              onClick={() => {}}
              styling='shadow-md shadow-slate-300 w-[90%] px-4'
              imageSize='w-[80px] h-[80px] -ml-0.5'
            />
          </View>
        ))}
      </View>

      <View>
        <SeeAll
          title='Bookmark'
          styling='m-2'
          seeAllColor='text-secondary-sBlue'
          arrowColor='#39C3F2' 
          onSeeAllPress={(value) => handleSeeAllClick(value)} 
        />

        {events.slice(0, 2).map((event) => (
          <View 
            key={event.id} 
            className='bg-white rounded-2xl w-full items-center my-2'>
            <CardPop 
              event={event}
              onClick={() => {}}
              styling='shadow-md shadow-slate-300 w-[90%] px-4'
              imageSize='w-[80px] h-[80px]'
            />
          </View>
        ))}
      </View>
    </View>
  );

  const displayedText = isExpanded || userAlt.bio.length <= 200 
      ? userAlt.bio 
      : `${userAlt.bio.slice(0, 200)}...`;

  const renderBioTab = () => (
    <View className='bg-white mt-8 gap-2 px-4'>
      <Text className='font-semibold text-xl'>
        About Me
      </Text>
      <Text className="text-gray-600">
        {displayedText}
        {userAlt.bio.length > 200 && (
          <Text 
            className="text-blue-500 font-medium py-0"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? " Show Less" : " Read More"}
          </Text>
        )}
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "HISTORY":
        return renderHistoryTab();
      case "FAVORITE":
        return renderFavoriteTab();
      case "BIO":
        return renderBioTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <FlatList
        data={["1"]}
        keyExtractor={(item) => item}
        className='px-8'
        renderItem={() => renderTabContent()}
        ListHeaderComponent={
          <>
            <View className='items-center mt-4 gap-4'>
              <View className="flex-row items-center justify-between mt-4 gap-4">
                <View className="items-center flex-1"></View>

                <UserProfileImage 
                  image={user?.profileImage}
                  name={user?.fullName}
                  isSubscribed={true}
                  imageStyle="w-28 h-28"
                  dotStyle="bottom-1.5 right-1.5 w-5 h-5"
                  textStyle="text-2xl mt-2 font-bold text-primary-pBlue"
                  buttonStyle="items-center"
                  onPress={() => signOutUser()}
                />

                <View className="flex-1 items-end h-full">
                  <TouchableOpacity 
                    onPress={handleHambugerClick} 
                  >
                    <Ionicons name="reorder-three-outline" size={36} color="#003566" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row">
                <View className="items-center px-6">
                  <Text className="text-lg font-semibold text-primary-pBlue">
                    {user?.followingIds?.length}
                  </Text>
                  <Text className="text-sm text-gray-500">Following</Text>
                </View>
                <View className="w-px h-10 bg-secondary-sBlue" />
                <View className="items-center px-6">
                  <Text className="text-lg font-semibold text-primary-pBlue">
                    {user?.followersIds?.length}
                  </Text>
                  <Text className="text-sm text-gray-500">Followers</Text>
                </View>
              </View>

              <View className="flex-row justify-center items-center gap-8 px-20">
                {/* New Button */}
                <View className='flex-1 justify-center items-end'>
                  <TouchableOpacity 
                    className="bg-secondary-sBlue gap-1 px-6 py-2 rounded-full flex-row items-center"
                    onPress={() => {}}
                  >
                    <Ionicons name="add" size={24} color="white" />
                    <Text className="text-white font-medium text-lg">New</Text>
                  </TouchableOpacity>
                </View>

                {/* Edit Button */}
                <View className='flex-1 justify-center items-center'>
                  <TouchableOpacity 
                    className="border border-secondary-sBlue gap-1 px-6 py-2 rounded-full flex-row items-center"
                    onPress={() => {}}
                  >
                    <Ionicons name="ticket-outline" size={20} color="#39C3F2" />
                    <Text className="text-secondary-sBlue font-medium text-lg">Ticket</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

            <View className="flex-row border-b border-white mt-4">
              {["HISTORY", "FAVORITE", "BIO"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-4 items-center ${activeTab === tab ? "border-b-2 border-secondary-sBlue" : ""}`}
                >
                  <Text 
                    className={`text-md ${activeTab === tab ? "text-secondary-sBlue font-semibold" : "text-gray-500"}`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }  
      />
    </SafeAreaView>
  );
};

export default Profile;