//  get state from event and purchase
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from "react-native";
import React, { useState } from "react";

import PrimaryButton from "@/components/PrimaryButton";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CardPop from "@/components/CardPop";
import { Event, Ticket } from "@/types/type";
import PurchasePopup from "@/components/PurchasePopup";
import CounterButton from "@/components/CounterButton";
import { useTicketStore } from "@/store/ticket";
import { images } from "@/constants";
import Payment from "@/components/Payment";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useEventStore } from "@/store/event";
import { useUserStore } from "@/store/user";

const PurchaseScreen = () => {
  const { setTicket, setShowHeader } = useTicketStore();
  const selectedEvent = useEventStore((state) => state.selectedEvent);
  const user = useUserStore((state) => state.user);

  const [subTotal, setSubTotal] = useState(selectedEvent?.price || 0);

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleSeeTicket = () => {
    setPaymentConfirmed(false);

    const ticket: Ticket = {
      eventName: event.title,
      eventAddress: `${event.city}, ${event.category}`, // Placeholder for address formatting
      userName: "Jamie Nguyen", // Placeholder: You'll want to fetch the actual username from context or data
      orderNumber: `123`, // Example order number based on event ID
      date: "Nov 01 2024", // Placeholder: You'll need an actual date for this
      time: "7:00 PM", // Placeholder: Similarly, you'd get the time dynamically
      numTickets: 2, // Placeholder: Replace with actual ticket count
      total: 249.6, // Placeholder: Replace with actual total calculation
      eventImage: images.concert, // Placehold
    }
    setShowHeader(false);
    setTicket(ticket);
    router.replace({
      pathname: "/(root)/ticket-screen", 
      params: { showHeader: "true" }      
    });
  }

  const handleKeepExploring = () => {
    setPaymentConfirmed(false);
    router.replace("/(root)/(tabs)/explore");
  }

  const event = selectedEvent as Event;

  return (
    <StripeProvider
      publishableKey={'pk_test_51Q78Qt2LxvcbX1SF730tdyEI9eKKL5RIip7jYtxSqJBrEA8e63X0jJmGwGkqrkXsHE2xp4HhpsFACOE5OpgzZrcq00aWwaF4QO'}
      merchantIdentifier="merchant.locally.app"
      urlScheme="myapp"
    >
      <View className="flex-1 mt-16 top-[20px] bg-green ">
      
      {/* Purchase Popup Screen */}
        <View className="allign-center">
          {paymentConfirmed && (
            <PurchasePopup 
              event={event} 
              visible={paymentConfirmed} 
              onClose={() => setPaymentConfirmed(false)} 
              seeTicketClick={handleSeeTicket} 
              onkeepExploringClick={handleKeepExploring}
            /> 
          )}
        </View>

        <View className="flex-col p-1">
          <TouchableOpacity onPress={handleGoBack}>
            <View className="flex-row gap-2 pl-3 pb-20 items-center ml-5">
              <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
              <Text className="text-2xl">Order Details</Text>
            </View>
          </TouchableOpacity>

          {/* Event Card */}
          <View className="pb-5 items-center">
            <CardPop
              event={event}
              style="bg-white p-2 rounded-2xl shadow-md w-[375px] flex-row items-center"
            />
          </View>

          {/* Purchase details */}
          <View className="flex-col mx-3 pt-5 gap-6">
            <View className="flex-row px-5">
              <Text className="text-xl font-bold">Order Summary</Text>
            </View>

            <View className="flex-row px-6 mr-3 justify-between">
              <Text>Ticket Price</Text>
              <Text className="text-[#39C3F2] font-semibold">
                {`$${event.price?.toFixed(2)}`}
              </Text>
            </View>

            <View className="flex-row px-6 mr-3 justify-between">
              <Text>Amount</Text>
              <CounterButton 
                setPrice={(value) => { setSubTotal(value) }}
                unitPrice={event.price || 0}
              />            
            </View>

            <View className="flex-row px-6 mr-3 justify-between">
              <Text>Subtotal</Text>
              <Text className="text-[#39C3F2] font-semibold">
                {`$${subTotal.toFixed(2)}`}
              </Text>
            </View>

            <View className="flex-row px-6 mr-3 justify-between">
              <Text>Fees & Tax (7%)</Text>
              <Text className="text-[#39C3F2] font-semibold">
                {`$${(subTotal * 0.07).toFixed(2)}`}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-[2] mx-5 mt-4 pr-5 bg-gray-400" />

            <View className="flex-row px-4 mr-3 justify-between">
              <Text className="text-2xl font-semibold">Total</Text>
              <Text className="text-2xl font-semibold">
                {`$${(subTotal * 1.07).toFixed(2)}`}
              </Text>
            </View>
          </View>

          {/* Pay Now button */}
          <View className="absolute justify-center px-16 left-5 top-[650px] right-5">
            <Payment
              name={user?.fullName}
              email={user?.email}
              amount={`${(subTotal * 1.07)}`}
              onPaymentStatus={(status) => {
                if (status === "success") {
                  setPaymentConfirmed(true);;
                }
              }}
            />
          </View>
        </View>
      </View>
    </StripeProvider>
    
  );
};

export default PurchaseScreen;
