import { View, Text, Image } from 'react-native'
import React from 'react';
import { Tabs } from 'expo-router'
import { FontAwesome6, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';'@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context'

const TabsLayout = () => {
  return (
    <>
      <SafeAreaView className='flex-1'>
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
          name="nana"
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
          name="jaime"
          options={{
            title: 'Jaime',
            headerShown: false,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome6 name="meh" size={24} color={color} />
              ) : (
                <FontAwesome6 name="face-meh-blank" size={24} color={color} />
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
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <MaterialCommunityIcons name="home" size={24} color={color} />
              ) : (
                <MaterialCommunityIcons name="home-outline" size={24} color={color} />
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
      </SafeAreaView>
    </>
  )
}

export default TabsLayout
