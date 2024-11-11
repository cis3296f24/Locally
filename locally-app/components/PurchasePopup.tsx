import { router } from "expo-router";
import { View, Text, Image, Modal } from "react-native";
import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { images } from "@/constants";
import { Href } from "expo-router";

// this is the component for the modal 
const PurchasePopup = ({nextPage, eventName}: {nextPage:Href<string | object>; eventName:string}) => {
    const [modalVisible, setModal] = useState(true);
    const handleSeeTicket = () => {
        router.push(nextPage)
        setModal(false)
      }
    
      const handleKeepExploring = () => {
        setModal(false)
        router.push(".././(tabs)/explore");
      };
    return(
        <>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModal(false)}>
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
              <Text className="text-xl text-center">You have successfully placed an order for  
                <Text className="font-semibold text-[#39C3F2]"> {eventName}! </Text> 
                Enjoy!
              </Text>

              {/* Button 1, See Ticket */}
              <View className="w-[90%]">
                <PrimaryButton text="see ticket" bgColor="bg-[#003566]" iconBgColor="bg-[#39C3F2]" icon="ticket-confirmation-outline"
                  onPress={handleSeeTicket}>
                </PrimaryButton>
              </View>
            {/* Button 2, See Ticket */}
              <View className="shadow-md">
                <PrimaryButton
                  text="keep Exploring" bgColor="bg-white" textcolor="text-black" iconVisible={false} onPress={handleKeepExploring}
                >
                </PrimaryButton>
              </View>
            </View>
          </View>
        </Modal>
        </>
)}

export default PurchasePopup