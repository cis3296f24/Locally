import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '@/constants'
import PrimaryButton from '@/components/PrimaryButton';
import { router } from 'expo-router';
import { useEventStore } from '@/store/event';
import { formatEventDate, formatEventDateAndTime } from '@/utils';

const EventDetailsScreen = () => {
    const { selectedEvent } = useEventStore();

    const imageSource = selectedEvent?.coverImage
        ? { uri: selectedEvent.coverImage }
        : images.noImage;
    const eventDate = formatEventDate(selectedEvent?.dateStart);
    const eventInterval = formatEventDateAndTime(selectedEvent?.dateStart, selectedEvent?.timeStart, selectedEvent?.timeEnd);

    const [isExpanded, setIsExpanded] = useState(false);

    const handlePurchase = () => {
        router.push('/(root)/purchase-screen');
    }

    const handleGoBack = () => {
        router.back(); 
    };
    

    const InfoRow = ({ icon, title, subtitle, rightElement }: any) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                {(icon.endsWith('.jpg') || icon.endsWith('.png')) ? (
                    <Image
                        source={images.organizer}
                        style={{ width: 40, height: 40, borderRadius: 15 }}
                    />
                ) : (
                    <Ionicons name={icon} size={30} color="#003566" />
                )}
            </View>
            <View style={{ flex: 1 }}>
                <Text className='text-lg font-semibold' >{title}</Text>
                <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#003566', marginTop: 2 }}>{subtitle}</Text>
            </View>
            {rightElement}
        </View>
    );

    return (
        <View>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    {/* Cover Image */}
                    <Image
                        source={imageSource}
                        style={{ width: '100%', height: 250 }}
                    />
                    {/* Top Icons */}
                    <View style={{ position: 'absolute', top: 0, left: 0, margin: 20, marginTop: 50 }}>
                        <View style={{ backgroundColor: 'rgba(200, 200, 200, 0.8)', padding: 12, borderRadius: 40 }}>
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                onPress={handleGoBack}
                            >
                                <Ionicons name="arrow-back" size={24} color="white" />
                                <Text style={{ marginLeft: 5, fontSize: 20, color: 'white' }}>Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: 0, right: 0, margin: 20,  marginTop: 50 }}>
                        <TouchableOpacity>
                            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', padding: 16, borderRadius: 6 }}>
                                <Ionicons name="bookmark" size={24} color="#003566" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Attendees and Invite Button */}
                    <View style={{ width: 250, height: 50, backgroundColor: 'white', position: 'relative', bottom: 15, marginLeft: 'auto', marginRight: 'auto', borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                        <Image
                            source={images.woman1}
                            style={{
                                width: 30, height: 30, borderRadius: 20, zIndex: 3
                            }}
                        />

                        <Image
                            source={images.woman2}
                            style={{
                                width: 30, height: 30, borderRadius: 20, marginLeft: -15, zIndex: 2
                            }}
                        />

                        <Image
                            source={images.woman3}
                            style={{
                                width: 30, height: 30, borderRadius: 20, marginLeft: -15, zIndex: 1
                            }}
                        />

                        <Text style={{ fontSize: 12, color: '#003566', fontWeight: 500 }}> +20 Going</Text>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#003566', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, marginLeft: 25 }}
                        >
                            <Text style={{ color: 'white', fontWeight: '500' }}>Invite</Text>
                        </TouchableOpacity>

                    </View>

                    {/* Body of Event Detail Page*/}

                    <View style={{ padding: 16 }}>
                        <View className='mb-4'>
                            <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{selectedEvent?.title}</Text>
                        </View>

                        <InfoRow icon="calendar"
                            title={eventDate}
                            subtitle={eventInterval}
                        />
                        <InfoRow icon="location"
                            title="New Bar in Town"
                            subtitle="1234 Chestnut St, Philadelphia, PA, USA"
                        />
                        <InfoRow icon="organizer.jpg"
                            title="Ashfak Sayem"
                            subtitle="Organizer"
                            rightElement={
                                <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: '#003566' }}>
                                    <Text style={{ fontSize: 14, color: 'white', marginTop: 2 }}>Follow</Text>
                                </TouchableOpacity>
                            }
                        />

                        {/* About Section*/}

                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>About Event</Text>
                            <Text style={{ fontSize: 14, lineHeight: 20 }} numberOfLines={isExpanded ? undefined : 3}                      >
                                Enjoy your favorite dishes and lovely your friends and family and have a great time. Food from local food trucks will be available for purchase. Contact the organizer for more information and be sure to tell your friends about this event.
                            </Text>
                            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                                <Text style={{ color: '#003566', marginTop: 4 }}>
                                    {isExpanded ? ' Read Less...' : ' Read More...'}
                                </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Location</Text>
                        </View>
                    </View>

                </View>
                
                {/* making blank space for simulating scrolling */}
                <View className='bg-red h-[500px]'/>
            </ScrollView >
            
            {/* Button for making purchase */}
            <View className='absolute justify-center px-8 left-5 top-[800px] right-5'>
                { selectedEvent?.price ? 
                    <PrimaryButton
                        text="ticket $120"
                        onPress={handlePurchase}
                        icon='currency-usd'
                        bgColor='bg-[#003566]'
                        iconBgColor='bg-[#FFC300]'
                    />  :   
                    <PrimaryButton
                        text="Join Now"
                        onPress={handlePurchase}
                    />
                }
            </View>
        </View>
    )
}

export default EventDetailsScreen;

