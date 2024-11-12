import {View, Text, Image, TouchableOpacity, ScrollView, Modal, ImageBackground} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import { images } from "@/constants";
import InfoItem from "@/components/InfoItem";
import {Ticket} from "@/types/type"
import TicketCard from "@/components/Ticket";
import { useTicketStore } from "@/store/ticket";

const TicketScreen = () => {

    const { ticket, showHeader } = useTicketStore();

    const handleGoBack = () => {
        router.back(); // Goes back to the previous page
    };

    const handleKeepExploring = () => {
        router.push(".././(tabs)/explore");
    };

    return (
        // View ticket Back button
        <View className="flex-1 bg-[#c7effc]">
            <View className="flex-1 flex-col mt-16 top-[20px] bg-[#c7effc]">
                { showHeader && (
                    <TouchableOpacity onPress={handleGoBack}>
                        <View className="flex-row gap-2 pl-3 pb-16 items-center ml-5">
                            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                            <Text className="text-2xl">View Ticket</Text>
                        </View>
                    </TouchableOpacity>    
                )}
                
                {/* Ticket Component */}
                { ticket ? (
                    <View className="mt-16">
                        <TicketCard ticket = {ticket}/>
                    </View>
                ) : (
                    <Text>No ticket available</Text>
                )}

                {/* Button */}
                <View className="absolute justify-center px-16 left-5 top-[700px] right-5 bg-[#c7effc]">
                    <PrimaryButton
                        text="keep exploring"
                        onPress={handleKeepExploring}
                        bgColor="bg-[#003566]"
                        iconBgColor="bg-[#39C3F2]"
                        iconVisible={false}
                    />
                </View>
            </View>
        </View>
    );
};

export default TicketScreen;
