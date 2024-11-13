export default {
  "expo": {
    "name": "locally",
    "slug": "locally-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
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
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "GOOGLE_API_KEY": process.env.GOOGLE_API_KEY
    }
  }
};