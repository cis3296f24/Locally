import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ticket } from '@/types/type'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTicketStore } from '@/store/ticket'
import { icons, images } from '@/constants'
import { formatDetailsEventDateAndTime, formatTimeLeft } from '@/utils/util'
import QRCode from 'react-native-qrcode-svg'
import PrimaryButton from '@/components/PrimaryButton'

const TicketList = () => {
  const { ticketList, setSelectedTicket, setShowHeaderTitle } = useTicketStore()

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowHeaderTitle(true)
    router.push('/(root)/ticket-screen')
  }

  const activeTickets = ticketList
    .filter(ticket => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      return ticket.date && ticket.date.toDate() >= currentDate;
    })
    .sort((a, b) => a.date.toMillis() - b.date.toMillis())

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

          { ticketList.length === 0 ? (
            <NoTickets />
          ): (
            <FlatList
              data={activeTickets}
              keyExtractor={(item) => item.ticketId}
              className='px-6 py-3'
              renderItem={({ item }) => (
                <TicketItem 
                  ticket={item}
                  onClick={() => handleTicketClick(item)}
                />
              )} 
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

export default TicketList


const NoTickets = () => {
  return (
    <View className="flex-1 justify-center items-center gap-24 mb-24">
      <View className='items-center'>
        <Image
          source={images.noTickets}
          className="w-100 h-100 mb-8" 
        />
        <Text className="text-3xl font-semibold mb-2">
          No tickets yet
        </Text>
        <Text className="text-xl">
          Let's get you some tickets!
        </Text>
      </View>

      <View className="shadow-md">
        <PrimaryButton
          text="Keep Exploring" 
          bgColor="bg-white" 
          textStyle="text-black" 
          iconVisible={false} 
          onPress={() => router.replace('/(root)/(tabs)/explore')}
        />
      </View>
    </View>
  )
}


const TicketItem = ({
  ticket,
  onClick
}: {
  ticket: Ticket
  onClick: () => void
}) => {
  const imageSource = ticket.eventImage
    ? { uri: ticket.eventImage }
    : images.admitOne;

  const formattedTime = formatDetailsEventDateAndTime(ticket.date, ticket.time);
  const timeLeft = formatTimeLeft(ticket.date);

  return (
    <TouchableOpacity
      className="flex-row gap-4 p-3 bg-white rounded-2xl shadow-md shadow-slate-300 mx-1 mb-6 items-center"
      onPress={onClick}
    >
      <>
        <Image
          source={imageSource} // Replace with your image URL
          className="w-[85px] h-[85px] rounded-md"
          resizeMode="cover"
        />

        <View className="flex-1 gap-1">
          <View className='flex-row justify-between items-center'>
            <Text className="text-sm text-primary-pBlue font-medium">
              {formattedTime}
            </Text>

            <Text className="text-xs text-gray-400 mb-2">
              {timeLeft}
            </Text>
          </View>
        
          <View className='flex-row'>
            <View className='justify-between flex-1'>
              <Text className="font-semibold text-secondary-sBlue line-clamp-1">
                {ticket.eventName}
              </Text>
              <View className='flex-row items-center'>
                <Image
                  source={icons.marker}
                  className="w-3.5 h-3.5 mr-1"
                />
                <Text className="text-gray-500 text-xs flex-1">
                  {ticket.eventAddress}
                </Text>
              </View>
            </View>

            <QRCode 
              value={ticket.qrcode} 
              size={52}
            />
          </View>
        </View>
      </>
    </TouchableOpacity>
  )
}