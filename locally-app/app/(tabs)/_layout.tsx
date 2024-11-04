import { View, Text, Image } from 'react-native'
import React from 'react';
import { Tabs } from 'expo-router'
import { FontAwesome6, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'


const TabsLayout = () => {
  return (
    <>
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
          name="luis"
          options={{
            title: 'Luis',
            headerShown: false,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome6 name="l" size={24} color={color} />
              ) : (
                <FontAwesome6 name="user" size={24} color={color} />
              ),
          }}
        />

        <Tabs.Screen
          name="maxwell"
          options={{
            title: 'Max',
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
    </>
  )
}

export default TabsLayout
