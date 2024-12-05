export default {
  "expo": {
    "name": "locally",
    "slug": "locally-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Locally uses your location to show nearby events and activities."
      },
      "config": {
        "googleMapsApiKey": process.env.GOOGLE_API_KEY
      }
    },
    "android": {
      "package": "com.project_final.locally",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "permissions": ["ACCESS_FINE_LOCATION"],
        "backgroundColor": "#ffffff"
      },
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_API_KEY
        }
      }
    },
    "plugins": [
      ["expo-router"],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "GOOGLE_API_KEY": process.env.GOOGLE_API_KEY,
      "STRIPE_PUBLISHABLE_KEY": process.env.STRIPE_PUBLISHABLE_KEY,
      "STRIPE_SECRET_KEY": process.env.STRIPE_SECRET_KEY,
      "IOS_CLIENT_ID": process.env.IOS_CLIENT_ID,
      "ANDROID_CLIENT_ID": process.env.ANDROID_CLIENT_ID,
      "EXPO_CLIENT_ID": process.env.EXPO_CLIENT_ID,
      "eas": {
        "projectId": "6f919c70-376d-4652-bc52-8a1bf024fb32"
      }
    },
    "scheme": "locally"
  }
}
