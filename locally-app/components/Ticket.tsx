import {View, Text, Image, ImageBackground} from "react-native";
import { images } from "@/constants";
import InfoItem from "@/components/InfoItem";
import {Ticket} from "@/types/type";


const TicketCard = ({ticket}: {ticket: Ticket}) =>{
    // ticket background
    return(

        <ImageBackground source={images.ticketShape} resizeMode="contain" className="flex-col gap-3 items-center h-[550]">
            {/* Event Image */}
            <Image
                source={ticket.eventImage}
                className="mt-6 rounded-xl w-[280px] h-[150px] overflow-hidden"/>

            {/* Title */}
            <View className="w-[60%]">
                <InfoItem label={ticket.eventName} value={ticket.eventAddress}
                labelStyle="font-medium text-xl" valueStyle="text-gray-500"
                ></InfoItem>
            </View>
            {/* Divider */}
            <View className="h-[2] w-[60%] bg-gray-400" />

            {/* Details */}
            <View className="flex-row w-[60%] justify-between mb-6">
                {/* Make the values variable */}
                <View className="flex-col w-[65%] gap-4 justify-between">
                    <InfoItem label="Name" value={ticket.userName} />
                    <InfoItem label="Date" value={ticket.userName} />
                    <InfoItem label="Number of Tickets" value={String(ticket.numTickets)} />
                </View>

                <View className="flex-col w-[65%] gap-4 justify-between">
                    <InfoItem label="Order Number" value={ticket.orderNumber} />
                    <InfoItem label="Time" value={ticket.time} />
                    <InfoItem label="Total" value={String(ticket.total)} />
                </View>

            </View>
            <View className="pt-5 flex">
                <Image source={images.barcode} resizeMode="cover" className=" w-55 h-20 overflow-hidden"></Image>
            </View>

            <Text className="font-light text-sm">
                Scan your barcode at the entry gate.
            </Text>
        </ImageBackground>
    )}

export default TicketCard;