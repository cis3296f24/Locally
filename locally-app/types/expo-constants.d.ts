import 'expo-constants';

declare module 'expo-constants' {
  export interface ExpoConfigExtra {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
    ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
    EXPO_CLIENT_ID : process.env.EXPO_CLIENT_ID,
  }

  export interface Constants {
    expoConfig: {
      extra: ExpoConfigExtra;
    };
  }
}