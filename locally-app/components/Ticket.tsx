import {View, Text, Image, ImageBackground} from "react-native";
import { images } from "@/constants";
import InfoItem from "@/components/InfoItem";
import {Ticket} from "@/types/type";
import { formatEventDate } from "@/utils/util";
import QRCode from 'react-native-qrcode-svg';

const TicketCard = ({ticket}: {ticket: Ticket}) => {
    const imageSource = ticket.eventImage
        ? { uri: ticket.eventImage }
        : images.admitOne;

    return(
        <ImageBackground source={images.ticketShape} resizeMode="contain" className="flex-col gap-3 items-center h-[550]">
            {/* Event Image */}
            <Image
                source={imageSource}
                className="mt-6 rounded-xl w-[280px] h-[150px] overflow-hidden"/>

            {/* Title */}
            <View className="w-[60%]">
                <InfoItem 
                    label={ticket.eventName} 
                    value={ticket.eventAddress}
                    labelStyle="font-medium text-xl" 
                    valueStyle="text-gray-500"
                />
            </View>
            {/* Divider */}
            <View className="h-[2] w-[60%] bg-gray-400" />

            {/* Details */}
            <View className="flex-row w-[60%] justify-between mb-6">
                {/* Make the values variable */}
                <View className="flex-col w-[65%] gap-4 justify-between">
                    <InfoItem label="Name" value={ticket.userName} />
                    <InfoItem label="Date" value={formatEventDate(ticket.date)} />
                    <InfoItem label="Number of Tickets" value={`${ticket.numTickets}`} />
                </View>

                <View className="flex-col w-[65%] gap-4 justify-between">
                    <InfoItem label="Order Number" value={ticket.orderNumber} />
                    <InfoItem label="Time" value={ticket.time} />
                    <InfoItem label="Total" value={ticket.total} />
                </View>

            </View>
            <View className="flex items-center justify-center">
                <QRCode 
                    value={ticket.qrcode} 
                    size={60}
                />
            </View>

            <Text className="font-light text-sm">
                Scan your barcode at the entry gate.
            </Text>
        </ImageBackground>
    )}

export default TicketCard;