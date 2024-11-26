//  get state from event and purchase
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from "react-native";
import React, { useState } from "react";

import PrimaryButton from "@/components/PrimaryButton";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CardPop from "@/components/CardPop";
import { Event, Ticket, User } from "@/types/type";
import PurchasePopup from "@/components/PurchasePopup";
import CounterButton from "@/components/CounterButton";
import { useTicketStore } from "@/store/ticket";
import { images } from "@/constants";
import Payment from "@/components/Payment";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useEventStore } from "@/store/event";
import { useUserStore } from "@/store/user";
import { createTicket } from "@/services/firebase-service";
import Constants from 'expo-constants';

const PurchaseScreen = () => {
  const { setSelectedTicket, setShowHeaderTitle } = useTicketStore();
  const { selectedEvent } = useEventStore();
  const { user } = useUserStore();

  const [quantity, setQuantity] = useState(1)
  const [subTotal, setSubTotal] = useState(selectedEvent?.price || 0);

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const confirmTicket = async () => {
    setPaymentConfirmed(true); 

    const ticket = await createTicket(
      selectedEvent as Event,   
      user as User,           
      quantity,           
      (subTotal * 1.07).toFixed(2)
    )

    setSelectedTicket(ticket);
  }

  const handleSeeTicket = () => {
    setPaymentConfirmed(false);
    setShowHeaderTitle(false);
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
      publishableKey={Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY}
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
              imageSize="h-[100px] w-[100px]"
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
              setQuantity={(value) => { setQuantity(value) }} 
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
                  confirmTicket();
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
