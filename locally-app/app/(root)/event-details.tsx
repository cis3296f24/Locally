import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '@/constants'

const EventDetailsScreen = () => {
    const [isExpanded, setIsExpanded] = useState(false);

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
                <Text style={{ fontSize: 16, fontWeight: '500' }} >{title}</Text>
                <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#003566', marginTop: 2 }}>{subtitle}</Text>
            </View>
            {rightElement}
        </View>
    );

    return (
        <ScrollView>
            <View style={{ flex: 1 }}>
                {/* Cover Image */}
                <Image
                    source={images.concert}
                    style={{ width: '100%', height: 250 }}
                />
                {/* Top Icons */}
                <View style={{ position: 'absolute', top: 0, left: 0, margin: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)', padding: 12, borderRadius: 40 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    <View>
                        <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Candlelight Fine Dining </Text>
                    </View>

                    <InfoRow icon="calendar"
                        title="01 November, 2024"
                        subtitle="Friday, 7:00 PM - 9:00 PM"
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
        </ScrollView >
    )
}

export default EventDetailsScreen;

