import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchBookmarkedEventsByUserId, fetchCreatedEventsByUserId, followUser, unfollowUser } from '@/services/firebase-service'
import { router } from 'expo-router'
import { useEventStore } from '@/store/event';
import { animations, images } from '@/constants';
import { formatEventDate } from '@/utils/util';
import SeeAll from '@/components/SeeAll';
import CardPop from '@/components/CardPop';
import UserProfileImage from '@/components/UserProfileImage';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '@/store/user';
import { Event } from '@/types/type';
import useNativeNotify from '@/services/native-notify';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("BIO");
  const { events, setSelectedEvent, setListTitle, setFilteredEvents, setShouldClearSelectedEvent } = useEventStore();
  const { user, selectedUser } = useUserStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isfollowing, setIsFollowing] = useState(selectedUser?.isFollowing);
  const [followers, setFollowers] = useState(selectedUser?.followersCount);

  const { registerFollower, unfollowMaster } = useNativeNotify();

  const title1 = `Hosted by ${selectedUser?.username}`;
  const title2 = `Bookmarked by ${selectedUser?.username}`;


  const handleSeeAllClick = (title: string) => {
    setFilteredEvents(bookmarkEvents);
    setListTitle(title)
    router.push('/(root)/event-list')
  }

  const handleCloseClick = () => {
    router.back();
  }

  const handleFollowClick = async () => {
    if (user?.id && selectedUser?.id && !isfollowing) {
      await followUser(user.id, selectedUser.id);
      registerFollower(selectedUser.id, user.id);
      setFollowers((followers ?? 0) + 1);
    } 

    if (user?.id && selectedUser?.id && isfollowing) {
      await unfollowUser(user.id, selectedUser.id);
      unfollowMaster(selectedUser.id, user.id);
      
      if (followers && followers > 0) {
        setFollowers(followers - 1);
      }
    }

    setIsFollowing(!isfollowing);
  }

  const isSubscribed = selectedUser?.isSubscribed;

  const [bookmarkEvents, setBookmarkEvents] = useState<Event[]>([]);
  const [userHostedEvents, setUserHostedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (selectedUser) {
      fetchBookmarkedEventsByUserId(selectedUser.id)
        .then((events) => setBookmarkEvents(events));

      fetchCreatedEventsByUserId(selectedUser.id)
      .then((events) => setUserHostedEvents(events));
    }
  }, [selectedUser]);

  const handleOnEventClick = async (event: Event) => {
    setSelectedEvent(event)
    setShouldClearSelectedEvent(true)
    router.navigate("/(root)/event-details")
  }

  const renderHistoryTab = () => {  
    return (
      <FlatList
        data={events.slice(0, 2)}
        keyExtractor={(item) => item.id.toString()}
        className='bg-white mt-8 gap-2' 
        renderItem={({ item }) => {
          const formattedDate = formatEventDate(item.dateStart, undefined, true); 
  
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
      {isSubscribed && userHostedEvents.length > 0 && (
        <View>
          <SeeAll
            title={title1}
            styling='m-2'
            seeAllColor='text-secondary-sBlue'
            arrowColor='#39C3F2'
            onSeeAllPress={(value) => handleSeeAllClick(value)} 
          />

          {userHostedEvents.slice(0, 2).map((event) => (
            <View 
              key={event.id} 
              className='bg-white rounded-2xl w-full items-center my-2'>
              <CardPop 
                event={event}
                onEventClick={() => handleOnEventClick(event)}
                styling='shadow-md shadow-slate-300 w-[90%] px-4'
                imageSize='w-[80px] h-[80px] -ml-0.5'
              />
            </View>
          ))}
        </View>
      )}

      {bookmarkEvents.length > 0 ? (
        <View>
          <SeeAll
            title={title2}
            styling='m-2'
            seeAllColor='text-secondary-sBlue'
            arrowColor='#39C3F2' 
            onSeeAllPress={(value) => handleSeeAllClick(value)} 
          />

          {bookmarkEvents.slice(0, isSubscribed ? 2 : 5).map((event) => (
            <View 
              key={event.id} 
              className='bg-white rounded-2xl w-full items-center my-2'
            >
                <CardPop 
                  event={event}
                  onEventClick={() => handleOnEventClick(event)}
                  styling='shadow-md shadow-slate-300 w-[90%] px-4'
                  imageSize='w-[80px] h-[80px]'
                />
              </View>
            ))}
        </View>
      ) : (
        <View className='my-16 justify-center items-center'>
          <Text className='items-center font-medium text-xl'>
            {`${selectedUser?.username} has no bookmarked events`}
          </Text>
          <Image 
            source={animations.loadingGif}
            className='w-80 h-80 mt-4'
          />
        </View>
      )}
    </View>
  );

  const displayedText = isExpanded || !selectedUser?.bio || selectedUser.bio.length <= 200 
    ? selectedUser?.bio 
    : `${selectedUser?.bio.slice(0, 200)}...`;

  const renderBioTab = () => (
    <View className='bg-white mt-8 gap-2 px-4'>
      <Text className='font-semibold text-xl'>
        About Me
      </Text>
      <Text className="text-gray-600">
        {displayedText || "Something about me..."}
        {selectedUser?.bio && selectedUser.bio.length > 200 && (
          <Text 
            className="text-secondary-sBlue font-semibold py-0"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "  Show Less" : " Read More"}
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
                  image={selectedUser?.profileImage}
                  name={selectedUser?.username}
                  isSubscribed={isSubscribed}
                  imageStyle="w-28 h-28"
                  dotStyle="bottom-1.5 right-1.5 w-5 h-5"
                  textStyle="text-2xl mt-2 font-bold text-primary-pBlue"
                  buttonStyle="items-center"
                  onPress={() => {}}
                />

                <View className="flex-1 items-end h-full">
                  <TouchableOpacity 
                    onPress={handleCloseClick} 
                  >
                    <Ionicons name="close" size={36} color="#003566" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row">
                <View className="items-center px-6">
                  <Text className="text-lg font-semibold text-primary-pBlue">
                    {selectedUser?.followingCount}
                  </Text>
                  <Text className="text-sm text-gray-500">Following</Text>
                </View>
                <View className="w-px h-10 bg-secondary-sBlue" />
                <View className="items-center px-6">
                  <Text className="text-lg font-semibold text-primary-pBlue">
                    {followers}
                  </Text>
                  <Text className="text-sm text-gray-500">Followers</Text>
                </View>
              </View>

              <View className="flex-row justify-center items-center gap-8 px-16">
                {/* New Button */}
                <View className='flex-1 justify-center items-end'>
                  <TouchableOpacity 
                    className={`${isfollowing 
                      ? "bg-white border-secondary-sBlue border" 
                      : "bg-secondary-sBlue" } gap-1 px-4 py-2 rounded-full flex-row items-center`
                    }
                    onPress={handleFollowClick}
                  >
                    {isfollowing ? (
                      <>
                        <MaterialCommunityIcons name="account-check-outline" size={20} color="#39C3F2" />
                        <Text className="text-secondary-sBlue font-medium text-md">Following</Text>
                      </>
                    ): (
                      <>
                        <AntDesign name="adduser" size={20} color="white" />
                        <Text className="text-white font-medium text-md">Follow</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Edit Button */}
                <View className='flex-1 justify-center items-center'>
                  <TouchableOpacity 
                    className="border border-secondary-sBlue gap-2 px-4 py-2 rounded-full flex-row items-center"
                    onPress={() => {}}
                  >
                    <Ionicons name="chatbubble-outline" size={20} color="#39C3F2" />
                    <Text className="text-secondary-sBlue font-medium text-md">Message</Text>
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

export default UserProfile