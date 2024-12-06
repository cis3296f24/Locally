import {View, Text, Image, TouchableOpacity, ScrollView, Modal, ImageBackground} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { router } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import TicketCard from "@/components/Ticket";
import { useTicketStore } from "@/store/ticket";

const TicketScreen = () => {

    const { selectedTicket, showHeaderTitle } = useTicketStore();

    const handleGoBack = () => {
        router.back(); // Goes back to the previous page
    };

    const handleKeepExploring = () => {
        router.replace("/(root)/(tabs)/explore");
    };

    return (
        // View ticket Back button
        <View className="flex-1 bg-[#c7effc]">
            <View className="flex-1 flex-col mt-16 top-[20px] bg-[#c7effc]">
                { showHeaderTitle && (
                    <TouchableOpacity onPress={handleGoBack}>
                        <View className="flex-row gap-2 mt-6 pl-3 items-center ml-5">
                            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                            <Text className="text-2xl">Ticket Details</Text>
                        </View>
                    </TouchableOpacity>    
                )}
                
                {/* Ticket Component */}
                { selectedTicket ? (
                    <View className={`${showHeaderTitle ? "mt-12" : "mt-24"}`}>
                        <TicketCard ticket = {selectedTicket}/>
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
