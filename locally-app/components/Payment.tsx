import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import PrimaryButton from './PrimaryButton';
import { fetchAPI } from '@/lib/fetch';

const Payment = ({
  name,
  email,
  amount,
  onPaymentStatus
}: {
  name?: string,
  email?: string,
  amount?: string,
  onPaymentStatus: (status: 'success' | 'failure') => void;
}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      intentConfiguration: {
        mode: {
          amount: parseFloat(amount || '0') * 100,
          currencyCode: 'USD',
        },
        confirmHandler: confirmHandler
      },
      returnURL: 'myapp://event-details',
    });
    if (error) {
      console.error('Error initializing payment sheet:', error);
      onPaymentStatus('failure');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const confirmHandler = async (
    paymentMethod: any, 
    _: any, 
    intentCreationCallback: any
  ) => {
    try {
      const { paymentIntent, customer } = await fetchAPI(
        "/(api)/(stripe)/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            amount: amount,
            paymentMethodId: paymentMethod.id,
          }),
        },
      );

      if (paymentIntent.client_secret) {
        const { result } = await fetchAPI("/(api)/(stripe)/pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method_id: paymentMethod.id,
            payment_intent_id: paymentIntent.id,
            customer_id: customer,
            client_secret: paymentIntent.client_secret,
          }),
        });

        if (result.client_secret) {
          console.log("Payment successful");

          intentCreationCallback({
            clientSecret: result.client_secret,
          });
        }
      }
    } catch (error: any) {
      intentCreationCallback({error});
      Alert.alert('Payment Error', 'An unexpected error occurred. Please use a different payment method.');
    }
  }

  const didTapCheckoutButton = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === 'Canceled') {
        onPaymentStatus('failure');
        Alert.alert('Payment Canceled', 'You have dismissed the payment process.');
      } else {
        onPaymentStatus('failure');
        Alert.alert('Payment Error', 'An unexpected error occurred.');
      }
    } else {
      onPaymentStatus('success');
    }
  }

  return (
    <View>
      <PrimaryButton
        text="pay now"
        onPress={didTapCheckoutButton}
        bgColor="bg-[#003566]"
        iconBgColor="bg-[#39C3F2]"
      />
    </View>
  );
}

export default Payment