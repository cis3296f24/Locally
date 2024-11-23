import 'react-native-get-random-values';
import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome6, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD60A',
        tabBarInactiveTintColor: '#A3CEF1',
        tabBarStyle: {
          backgroundColor: '#001D3D',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen 
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({color, focused}) => 
            focused ? (
              <MaterialCommunityIcons name="map" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons name="map-outline" size={24} color={color} />
            ), 
        }} 
      />

      <Tabs.Screen
        name="metadata"
        options={{
          title: 'Metadata',
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons name="event-available" size={24} color={color} />
            ) : (
              <MaterialIcons name="event" size={24} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({color, focused}) => 
            focused ? (
              <MaterialCommunityIcons name="chat" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons name="chat-outline" size={24} color={color} />
            ), 
        }} 
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <AntDesign name="rocket1" size={24} color={color} />
            ) : (
              <AntDesign name="user" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
