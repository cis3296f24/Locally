import 'expo-constants';

declare module 'expo-constants' {
  export interface ExpoConfigExtra {
    GOOGLE_API_KEY: string;
  }

  export interface Constants {
    expoConfig: {
      extra: ExpoConfigExtra;
    };
  }
}