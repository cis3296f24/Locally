import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ticket } from '@/types/type'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTicketStore } from '@/store/ticket'
import { images } from '@/constants'

const TicketList = () => {
  const { ticketList } = useTicketStore()

  return (
    <View>
      <SafeAreaView className='h-full w-full' edges={['top', 'left', 'right']}>
        <View className="flex-1">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="flex-row gap-2 py-6 mt-4 items-center ml-6">
              <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
              <Text className="text-2xl">
                Your Tickets
              </Text>
            </View>
          </TouchableOpacity>

          <FlatList
            data={ticketList.sort((a, b) => a.date.toMillis() - b.date.toMillis())}
            keyExtractor={(item) => item.ticketId}
            className='px-6 py-3'
            renderItem={({ item }) => (
              <TicketCard 
                ticket={item}
                onClick={() => {}}
              />
            )} 
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default TicketList

const TicketCard = ({
  ticket,
  onClick
}: {
  ticket: Ticket
  onClick: () => void
}) => {
  return (
    <View
      className="flex-row p-4 bg-white rounded-2xl shadow-md shadow-slate-300 mb-4 items-center"
    >
      <View className="mr-4">
        <Image
          source={images.man2} // Replace with your image URL
          className="w-16 h-16 rounded-md"
        />
      </View>

      {/* Ticket Details */}
      <View className="flex-1">
        <Text className="text-sm text-gray-500 font-medium">
          {"Mon"} • {"12:00 PM"}
        </Text>
        <Text className="text-lg text-blue-600 font-bold mt-1">
          {ticket.eventName}
        </Text>
        <Text className="text-sm text-gray-400 mt-1">{"45GBH89"}</Text>
      </View>

      {/* Right Section */}
      <View className="items-end">
        <Text className="text-sm text-gray-400 mb-2">
          ~ {"8"} days left
        </Text>
        {!ticket.total ? (
          <TouchableOpacity
            className="px-4 py-2 bg-blue-600 rounded-full"
          >
            <Text className="text-white font-bold text-sm">RSVP</Text>
          </TouchableOpacity>
        ) : (
          <Text
            className="px-4 py-2 bg-yellow-400 rounded-full text-white font-bold text-sm"
          >
            ${ticket.total}
          </Text>
        )}
      </View>
    </View>
  )
}