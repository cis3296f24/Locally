import { router } from "expo-router";
import { View, Text, Image, Modal } from "react-native";
import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { images } from "@/constants";
import { Event } from "@/types/type";

// this is the component for the modal 
const PurchasePopup = ({
  event,
  isTicket = true,
  seeTicketClick,
  onkeepExploringClick,
  onSeeEventClick,
  onBackToProfileClick,
  visible,
  onClose,
}: {
  event: Event;
  isTicket?: boolean;
  seeTicketClick?: () => void;
  onkeepExploringClick?: () => void;
  onSeeEventClick?: () => void;
  onBackToProfileClick?: () => void;
  visible: boolean;
  onClose?: () => void;
}) => {
    const handleSeeButton = () => {
      if (isTicket && seeTicketClick) {
        seeTicketClick();
      } else if (onSeeEventClick) {
        onSeeEventClick();
      }
    }

    const handleBackClick = () => {
      if (isTicket && onkeepExploringClick) {
        onkeepExploringClick();
      } else if (onBackToProfileClick) {
        onBackToProfileClick();
      }
    }

    return(
      <>
        <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
        >
        {/* Background */}
        <View className="flex-1 justify-center items-center bg-[rgba(199,239,252,0.7)]">
          {/* Popup Window */}
          <View className="flex-col gap-6 items-center bg-white p-10 rounded-2xl w-[75%] h-[450px]">
            {/* check mark image */}
            <View className="shadow-md">
              <Image source={ images.check } className='w-20 h-20 mt-2' resizeMode="contain"></Image>              
            </View>

          {/* Text */}
            <Text className="text-2xl font-bold mt-2">Congratulations!</Text>
            {isTicket ? (
              <Text className="text-xl text-center">You have successfully placed an order for  
                <Text className="font-semibold text-[#39C3F2]"> {event?.title}! </Text> 
                Enjoy!
              </Text>
            ): (
              <Text className="text-xl text-center">
                Your event 
                <Text className="font-semibold text-[#39C3F2]"> {event?.title} </Text> 
                has been created successfully!
              </Text>
            )}

            {/* Button 1, See Ticket */}
            <View className="w-[90%]">
              <PrimaryButton 
                text={isTicket ? "see ticket" : "see event"} 
                bgColor="bg-[#003566]" 
                iconBgColor="bg-[#39C3F2]" 
                icon={isTicket ? "ticket-confirmation-outline" : "calendar-text"}
                onPress={handleSeeButton}>
              </PrimaryButton>
            </View>
          {/* Button 2, See Ticket */}
            <View className="shadow-md">
              <PrimaryButton
                text={isTicket ? "keep Exploring" : "back to profile"} 
                bgColor="bg-white" 
                textStyle="text-black" 
                iconVisible={false} 
                onPress={handleBackClick}
              >
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default PurchasePopup