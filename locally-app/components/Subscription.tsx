import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import PrimaryButton from './PrimaryButton';
import { fetchAPI } from '@/lib/fetch';
import Constants from 'expo-constants';

const Subscription = ({
  email,
  amount,
  onPaymentStatus
}: {
  email?: string,
  amount?: string,
  onPaymentStatus: (status: 'success' | 'failure') => void;
}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    
      const response = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize subscription.');
      }

      console.log('Response from /api/stripe/subscribe:', await response.json());

      const { latest_invoice } = await response.json();
      const clientSecret = latest_invoice.payment_intent.client_secret;

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: "clientSecret",
        returnURL: 'myapp://edit-profile',
        allowsDelayedPaymentMethods: true,
        merchantDisplayName: ''
      });

      console.log('initPaymentSheet result:', error);

      if (error) {
        throw new Error(error.message);
      }
  };

  const handleCheckout = async () => {
    try {
      await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === 'Canceled') {
          Alert.alert('Payment Canceled', 'You have dismissed the payment process.');
        } else {
          Alert.alert('Payment Error', 'An unexpected error occurred.');
        }
        onPaymentStatus('failure');
      } else {
        Alert.alert('Success', 'Your subscription was successful!');
        onPaymentStatus('success');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      Alert.alert('Payment Error', 'An unexpected error occurred.');
      onPaymentStatus('failure');
    }
  };

  return (
    <View>
      <PrimaryButton
        text={`Subscribe for $${amount}/month`}
        onPress={handleCheckout}
        iconVisible={false}
        bgColor='bg-primary-pBlue'
        textStyle='text-xl capitalize text-white'
      />
    </View>
  );
}

export default Subscription