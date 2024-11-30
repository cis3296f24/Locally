import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, FlatList, RefreshControl, Modal, LayoutChangeEvent, findNodeHandle, UIManager } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fetchBookmarkedEventsByUserId, fetchUserProfileById, signOutUser } from '@/services/firebase-service'
import { router } from 'expo-router'
import { useEventStore } from '@/store/event';
import { images } from '@/constants';
import { formatEventDate } from '@/utils/util';
import SeeAll from '@/components/SeeAll';
import CardPop from '@/components/CardPop';
import UserProfileImage from '@/components/UserProfileImage';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/user';
import { useTicketStore } from '@/store/ticket';
import { Event } from '@/types/type';
import PrimaryButton from '@/components/PrimaryButton';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("BIO");
  const { events, setSelectedEvent, setListTitle, setEventOwner, setFilteredEvents, setShouldClearSelectedEvent } = useEventStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, userBookmarkedEvents, userCreatedEvents } = useUserStore();
  const { ticketList } = useTicketStore();

  // const [refreshing, setRefreshing] = useState(false);

  // const handleRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   refetch();
  //   setRefreshing(false);
  // }, []);

  const title1 = "My Events";
  const title2 = "Bookmark";

  const handleSeeAllClick = (title: string) => {
    if (title === title1) {
      setFilteredEvents(userCreatedEvents);
    } else if (title === title2) {
      setFilteredEvents(userBookmarkedEvents);
    }

    setListTitle(title)
    router.push('/(root)/event-list')
  }

  const handleHambugerClick = async () => {
    router.push('/(root)/edit-profile')
  }

  const handleSeeTicketsClick = async () => {
    router.push('/(root)/ticket-list')
  }

  const handleOnEventClick = async (event: Event) => {
    setSelectedEvent(event)
    setShouldClearSelectedEvent(true)
    router.navigate("/(root)/event-details")
  }

  const [visible, setVisible] = useState(false);

  const handleCreateEvent = () => {
    router.push('/(root)/create-event')
    setVisible(false)
  }

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
      {user?.isSubscribed && userCreatedEvents.length > 0 && (
        <View>
          <SeeAll
            title={title1}
            styling='m-2'
            seeAllColor='text-secondary-sBlue'
            arrowColor='#39C3F2'
            onSeeAllPress={(value) => handleSeeAllClick(value)} 
          />

          {userCreatedEvents.slice(0, 2).map((event) => (
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

      { userBookmarkedEvents.length > 0 ? (
        <View>
          <SeeAll
            title={title2}
            styling='m-2'
            seeAllColor='text-secondary-sBlue'
            arrowColor='#39C3F2' 
            onSeeAllPress={(value) => handleSeeAllClick(value)} 
          />

          {userBookmarkedEvents
            // .sort(() => Math.random() - 0.5)
            .slice(0, 2).map((event) => (
            <View 
              key={event.id} 
              className='bg-white rounded-2xl w-full items-center my-2'>
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
        <View className='justify-center gap-8 items-center my-32'>
          <Text className='text-lg font-semibold text-primary-pBlue'>
            Let's explore something exciting around you!
          </Text>

          <PrimaryButton
            text={"back to home"} 
            bgColor="bg-[#003566]" 
            iconVisible={false} 
            onPress={() => router.replace('/(root)/(tabs)/explore')}
          />
        </View>
      )}
    </View>
  );

  const displayedText = isExpanded || !user?.bio || user.bio.length <= 200 
    ? user?.bio   
    : `${user?.bio.slice(0, 200)}...`;

  const renderBioTab = () => (
    <View className='bg-white mt-8 gap-2 px-4'>
      <Text className='font-semibold text-xl'>
        About Me
      </Text>
      <Text className="text-gray-600">
        {displayedText || "Something about me..."}
        {user?.bio && user.bio.length > 200 && (
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
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={handleRefresh}
        //     colors={['#00C5DC']} // Optional: Android colors
        //     tintColor="#00C5DC" // Optional: iOS color
        //   />
        // }
        ListHeaderComponent={
          <>
            <View className='items-center mt-4 gap-4'>
              <View className="flex-row items-center justify-between mt-4 gap-4">
                <View className="items-center flex-1"></View>

                <UserProfileImage 
                  image={user?.profileImage}
                  name={user?.username}
                  isSubscribed={user?.isSubscribed}
                  imageStyle="w-28 h-28"
                  dotStyle="bottom-1.5 right-1.5 w-5 h-5"
                  textStyle="text-2xl mt-2 font-bold text-primary-pBlue"
                  buttonStyle="items-center"
                  onPress={() => {}}
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
                    {user?.followingCount}
                  </Text>
                  <Text className="text-sm text-gray-500">Following</Text>
                </View>
                <View className="w-px h-10 bg-secondary-sBlue" />
                <View className="items-center px-6">
                  <Text className="text-lg font-semibold text-primary-pBlue">
                    {user?.followersCount}
                  </Text>
                  <Text className="text-sm text-gray-500">Followers</Text>
                </View>
              </View>

              <View className="flex-row justify-center items-center gap-8 px-20">
                {/* New Button */}
                <View className='flex-1 justify-center items-end'>
                  {user?.isSubscribed ? (
                    <DropDownMenu 
                      isVisible={visible}
                      onPress={() => setVisible(true)}
                      onCreateEvent={handleCreateEvent}
                      onclose={() => setVisible(false)}
                    />
                  ):(
                    <TouchableOpacity
                      className="bg-secondary-sBlue gap-1 px-6 py-2 rounded-full flex-row items-center"
                      onPress={() => console.log("Create new post")}
                    >
                      <Ionicons name="add" size={24} color="white" />
                      <Text className="text-white font-medium text-lg">New</Text>
                    </TouchableOpacity>
                  )}
                  
                </View>

                {/* Edit Button */}
                <View className='flex-1 justify-center items-center'>
                  <View className="relative">
                    <TouchableOpacity 
                      className="border border-secondary-sBlue gap-1 px-6 py-2 rounded-full flex-row items-center"
                      onPress={handleSeeTicketsClick}
                    >
                      <Ionicons name="ticket-outline" size={20} color="#39C3F2" />
                      <Text className="text-secondary-sBlue font-medium text-lg">Ticket</Text>
                    </TouchableOpacity>
                    {ticketList.length > 0 ? (
                      <View 
                        className="absolute -top-2 -right-2 bg-primary-pBlue w-6 h-6 rounded-full justify-center items-center"
                      >
                        <Text className="text-white text-sm font-bold">{ticketList.length}</Text>
                      </View>
                    ): null}
                  </View>
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


const DropDownMenu = ({
  isVisible,
  onPress,
  onCreateEvent,
  onCreatePost,
  onclose
}: {
  isVisible: boolean;
  onPress: () => void;
  onCreateEvent?: () => void;
  onCreatePost?: () => void;
  onclose?: () => void;
}) => {
  const [buttonCoords, setButtonCoords] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleOpenMenu = () => {
    onPress();
    const node = findNodeHandle(buttonRef.current);
    if (node) {
      UIManager.measure(
        node,
        (x, y, width, height, pageX, pageY) => {
          setButtonCoords({ x: pageX, y: pageY + height }); // Set position below the button
        }
      );
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        ref={buttonRef} 
        className="bg-secondary-sBlue gap-1 px-6 py-2 rounded-full flex-row items-center"
        onPress={handleOpenMenu}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text className="text-white font-medium text-lg">New</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={onclose}
      >
        <TouchableOpacity
          className="flex-1 bg-black/30"
          onPress={onclose}
        >
          <View
            className="absolute w-48 bg-white rounded-lg shadow-lg"
            style={{
              top: buttonCoords.y,
              left: buttonCoords.x,
            }}
          >
            <TouchableOpacity
              onPress={onCreateEvent}
              className="px-4 py-3 border-b border-gray-200"
            >
              <Text className="text-base">Create Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCreatePost}
              className="px-4 py-3"
            >
              <Text className="text-base">Create Post</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};