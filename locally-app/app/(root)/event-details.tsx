import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '@/constants'
import PrimaryButton from '@/components/PrimaryButton';
import { router } from 'expo-router';
import { useEventStore } from '@/store/event';
import { formatAddress, formatDate, formatEventDate, formatEventDateAndTime } from '@/utils/util';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import ChatButton from '@/components/ChatButton';
import Chat from '@/components/Chat';
import { useUserStore } from '@/store/user';
import UserProfileImage from '@/components/UserProfileImage';
import { createTicket, followUser, unfollowUser } from '@/services/firebase-service';
import { Event, Ticket, User } from '@/types/type';
import PurchasePopup from '@/components/PurchasePopup';
import { useTicketStore } from '@/store/ticket';
import { handleBookmark, updateSelectedEvent } from '@/utils/event';
import { animations } from '@/constants';

const EventDetailsScreen = () => {
    const { selectedEvent, eventStack, setEventStack } = useEventStore();
    const { user, userBookmarkedEvents } = useUserStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const displayedText = isExpanded || (selectedEvent?.description && selectedEvent.description.length <= 200)
      ? selectedEvent?.description
      : `${selectedEvent?.description.slice(0, 200)}...`;

    const imageSource = selectedEvent?.coverImage
        ? { uri: selectedEvent.coverImage }
        : images.noImage;
    const eventDate = formatEventDate(selectedEvent?.dateStart, selectedEvent?.dateEnd);
    const eventInterval = formatEventDateAndTime(
        selectedEvent?.dateStart,
        selectedEvent?.dateEnd, 
        selectedEvent?.timeStart, 
        selectedEvent?.timeEnd
    );
    const eventLocation = selectedEvent?.locationName;
    const eventAddress = formatAddress(selectedEvent?.street, selectedEvent?.city, selectedEvent?.state, selectedEvent?.zipCode);

    const [isChatVisible, setIsChatVisible] = useState(false);

    const [confirmJoin, setConfirmJoin] = useState(false);
    const { ticketList, setTicketList, setSelectedTicket, setShowHeaderTitle } = useTicketStore();
    const hasTicket = ticketList.some(ticket => ticket.eventId === selectedEvent?.id);

    const threeAttendees = selectedEvent?.attendees || [];
    const attendeeIds = selectedEvent?.attendeeIds || [];
    const eventOwner = selectedEvent?.owner;

    const handlePurchase = () => {
        router.push('/(root)/purchase-screen');
    }

    const handleJoinEvent = async () => {
        const ticket = await createTicket(
            selectedEvent as Event,   
            user as User,           
            1,           
            "Free"
        )

        setTicketList([...ticketList, ticket]);
        setShowHeaderTitle(false);
        setSelectedTicket(ticket);
        setConfirmJoin(true);
    }

    const handleSeeTicket = () => {
        const ticket = ticketList.find(ticket => ticket.eventId === selectedEvent?.id);
        setSelectedTicket(ticket as Ticket);
        setShowHeaderTitle(true);
        console.log('See ticket');
        router.push("/(root)/ticket-screen");
    }

    console.log("event stack length", eventStack.length);
    const handleGoBack = () => {
        if (eventStack.length === 0) {
            router.back();
        }

        eventStack.pop();
        const lastEvent = eventStack.length > 0 ? eventStack[eventStack.length - 1] : null;

        if (lastEvent) {
            setEventStack(eventStack);
            useEventStore.getState().setSelectedEvent(lastEvent);
        }
        router.back(); 
    };

    const handleOrganizerImageClick = async () => {
        if (eventOwner?.id !== user?.id) {
            useUserStore.getState().setSelectedUser(eventOwner as User);

            router.push("/(root)/user-profile");
        } else {
            useEventStore.getState().setEventStack([])
            useUserStore.getState().setUserStack([])
            router.navigate("/(root)/(tabs)/profile");
        }
    }

    const isFollowing = useUserStore.getState().followingList.includes(eventOwner?.id as string);

    const  handleFollowClick = async () => {
        if (user?.id && eventOwner?.id && !isFollowing) {
            await followUser(user.id, eventOwner.id);
        } 
      
        if (user?.id && eventOwner?.id && isFollowing) {
            await unfollowUser(user.id, eventOwner.id);
        }
    }

    // Check if bookmarked
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (selectedEvent) {
            const isBookmarked = userBookmarkedEvents.some(event => event.id === selectedEvent.id);
            setIsBookmarked(isBookmarked);
        }
    }, [isBookmarked])

    const handleBookmarkClick = async () => {
        const bookmarked = await handleBookmark(selectedEvent, isBookmarked);
        setIsBookmarked(bookmarked as boolean);
    }

    // To fetch three representative attendees
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUsers = async () => {
            await updateSelectedEvent(selectedEvent as Event);
            setLoading(false);
        }

        fetchUsers();
    }, [])

    if (loading) {
        return (
            <View className='flex-1 bg-white items-center justify-center'>
                {/* <Image  
                    source={animations.loadingGif}
                    className='w-36 h-36'
                /> */}
                <ActivityIndicator size="large" color="#39C3F2" />
            </View>
        )
    }

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-1'>

                    <View className="allign-center">
                        {confirmJoin && (
                            <PurchasePopup 
                                event={selectedEvent as Event} 
                                visible={confirmJoin} 
                                seeTicketClick={() => router.replace( "/(root)/ticket-screen")} 
                                onkeepExploringClick={() => router.replace("/(root)/(tabs)/explore")}
                            /> 
                        )}
                    </View>

                    {/* Cover Image */}
                    <Image
                        source={imageSource}
                        className='w-full h-[280px]'
                    />

                    {/* Top Icons */}
                    <View className='absolute top-20 left-10 right-0 flex-row justify-between'>
                        <TouchableOpacity 
                            className='flex-row items-center p-3 gap-2 rounded-full bg-white/60'
                            onPress={handleGoBack}
                        >
                            <Ionicons name="arrow-back" size={24} color="#003566" />
                            <Text className='text-primary-pBlue text-2xl'>Details</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='absolute top-20 right-10'> 
                        <TouchableOpacity 
                            className='p-3 rounded-xl bg-white/60'
                            onPress={handleBookmarkClick}
                        >
                            {isBookmarked ? (
                                <Ionicons name="bookmark" size={30} color="#003566" />
                            ): (
                                <Ionicons name="bookmark-outline" size={30} color="#003566" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Attendees and Invite Button */}
                    <View className="h-[50px] bg-white relative gap-2 -top-6 mx-auto rounded-full flex-row items-center px-3 py-2">
                        
                        {attendeeIds?.length > 2 ? (
                            <>
                                <View className='flex-row-reverse'>
                                    <Image
                                        source={{uri: threeAttendees[2].profileImage}}
                                        className='w-10 h-10 rounded-full p-0.5 bg-white'
                                    />

                                    <Image
                                        source={{uri: threeAttendees[1].profileImage || images.noImage}}
                                        className='w-10 h-10 rounded-full -mr-4 p-0.5 bg-white'
                                    />

                                    <Image
                                        source={{uri: threeAttendees[0].profileImage || images.noImage}}
                                        className='w-10 h-10 rounded-full -mr-4 p-0.5 bg-white'
                                    />  
                                </View>

                                <View className='items-center justify-center'>
                                    <Text className='text-primary-pBlue font-semibold text-sm'>
                                        {`+${selectedEvent?.attendeeIds && selectedEvent.attendeeIds.length}`}
                                    </Text>
                                    <Text className='text-primary-pBlue font-semibold text-xs'>Going</Text>
                                </View>  
                            </>  
                        ): (
                            <Text className='text-xl font-semibold capitalize'>Join us</Text>
                        ) }

                        <TouchableOpacity
                            className='bg-primary-pBlue rounded-3xl px-2.5 py-2'
                            onPress={() => {}}
                        >
                            <Text className='text-white text-md font-semibold'>Invite</Text>
                        </TouchableOpacity>

                    </View>

                    {/* Body of Event Detail Page*/}

                    <View className='px-6 py-3 gap-4'>
                        <Text className='text-[32px] font-bold mb-2 line-clamp-2'>
                            {selectedEvent?.title}
                        </Text>

                        <InfoRow icon="calendar"
                            title={eventDate}
                            subtitle={eventInterval}
                        />

                        <InfoRow icon="location"
                            title={eventLocation || 'Location Name'}
                            subtitle={eventAddress}
                        />
                        <InfoRow
                            image={eventOwner?.profileImage}
                            isImage={true}
                            title={eventOwner?.fullName || 'Organizer Name'}
                            subtitle="Organizer"
                            rightElement={
                                eventOwner?.id !== user?.id && (
                                    <TouchableOpacity
                                        onPress={handleFollowClick}
                                        className={`px-4 py-1.5 rounded-full ${
                                            isFollowing
                                            ? 'bg-white border-0.5 border-gray-300'
                                            : 'bg-primary-pBlue'
                                        }`}
                                    >
                                        <Text
                                            className={`${
                                            isFollowing ? 'text-primary-pBlue' : 'text-white'
                                            } text-sm font-semibold`}
                                        >
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                            onImagePress={handleOrganizerImageClick}
                        />

                        {/* About Section*/}

                        <View className='gap-2 mt-2'>
                            <Text className='text-xl font-bold'>About Event</Text>
                            <Text className="text-gray-600">
                                {displayedText}
                                {selectedEvent?.description && selectedEvent.description.length > 200 && (
                                    <Text 
                                        className="text-blue-500 font-medium"
                                        onPress={() => setIsExpanded(!isExpanded)}
                                    >
                                        {isExpanded ? " Show Less" : " Read More"}
                                    </Text>
                                )}
                            </Text>
                        </View>


                        { selectedEvent?.coordinate && (
                            <View className='mb-6 gap-2'>
                                <Text className='text-xl font-bold'>
                                    Location
                                </Text>

                                <View className="w-[100%] h-[250px] rounded-xl overflow-hidden self-center">
                                    <MapView
                                        provider={PROVIDER_DEFAULT}
                                        style={{ flex: 1 }} // Full size of container
                                        mapType="standard"
                                        initialRegion={{
                                            latitude: selectedEvent.coordinate.latitude,
                                            longitude: selectedEvent?.coordinate.longitude,
                                            latitudeDelta: 0.03,
                                            longitudeDelta: 0.03
                                        }}
                                        scrollEnabled={false}     
                                        zoomEnabled={false}       
                                        pitchEnabled={false}       
                                        rotateEnabled={false}      
                                    >
                                        <Marker coordinate={{
                                            latitude: selectedEvent.coordinate.latitude,
                                            longitude: selectedEvent.coordinate.longitude
                                        }}>
                                            <View className='bg-orange-400 rounded-full p-1'>
                                                <Text className="text-white text-xs font-medium">📍</Text>
                                            </View>
                                        </Marker>
                                    </MapView>
                                </View>
                            </View>
                        )}
                    </View>

                </View>
                
                {/* making blank space for simulating scrolling */}
                <View className='h-[100px]'/>
            </ScrollView >
            
            {/* Button for making purchase */}
            <View className='absolute justify-center bottom-[50px] w-screen px-8 bg'>
                <View className='flex-1 justify-center pr-28'>
                    { selectedEvent?.price ? (
                        <PrimaryButton
                            text={`Ticket $${selectedEvent.price}`}
                            onPress={handlePurchase}
                            icon='currency-usd'
                            // bgColor='bg-[#003566]'
                            iconBgColor='bg-[#FFC300]'
                        /> 
                    ): (
                        <PrimaryButton
                            text={hasTicket ? "See Ticket" : "Join Now"}
                            onPress={hasTicket ? handleSeeTicket : handleJoinEvent}
                        />
                    )}
                </View>   

                <View className='absolute right-[30%] bottom-[50px]'>
                    <ChatButton onPress={() => setIsChatVisible(true)} />
                </View> 
            </View>

            <Chat
                isVisible={isChatVisible}
                onClose={() => setIsChatVisible(false)}
                title={selectedEvent?.title || 'something'}
                date={formatDate(selectedEvent?.dateStart)}
                image={selectedEvent?.coverImage}
                curretUserId={user?.id || ''}
                eventId={selectedEvent?.id || ''}   
            />   
        </View>
    )
}

export default EventDetailsScreen;


const InfoRow = ({ 
    icon, 
    title, 
    subtitle, 
    rightElement, 
    image, 
    isImage = false,
    onImagePress
}: {
    icon?: any,
    title: string,
    subtitle: string,
    rightElement?: any,
    image?: string,
    isImage?: boolean,
    onImagePress?: () => void
} ) => {
    return (
        <View className='flex-row items-center justify-center'>
            <View className='items-center justify-center mr-3 w-[40px] h-[40px]'>
                {isImage && (
                    <UserProfileImage 
                        image={image} 
                        imageStyle="w-10 h-10 items-center justify-center"
                        onPress={onImagePress}
                    />
                )}
                {icon && (
                    <Ionicons name={icon} size={30} color="#003566" />
                )}
            </View>
            <View className='flex-1'>
                <Text className='text-lg font-semibold' >
                    {title}
                </Text>
                <Text className='text-sm italic text-[#003566]'>
                    {subtitle}
                </Text>
            </View>
            {rightElement}
        </View>
    )
}