# Locally

## Description

Locally is a mobile app that connects users to nearby experiences, offering personalized recommendations for events, restaurants, landmarks, and activities. It provides real-time updates, community insights, and interactive features that help users explore local options, discover new places, and share experiences. Local businesses can also promote their offerings and showcase local culture, connecting with both residents and visitors to boost visibility and engagement. Whether you're exploring a new city or looking for something fun nearby, Locally makes it easy to find tailored experiences and connect with the community.

[ProjectBoard](https://trello.com/b/ByZkiFVe/locally)

# How to install and run

## Prerequisites

**Node.js**: Official [website](https://nodejs.org/en).

**npm**: Node Package Manager comes bundled with Node.js. Verify your installation by running

```
npm -v
```

## Node.js Installation Instructions

**Windows Users**

1. Download the installer from official [website](https://nodejs.org/en) and run it.
2. Once it is installed, verify the installation by running

```
node -v
npm -v
```

**macOS Users**

1. Run the commands:

```
brew update
brew install node
```

2. Once they are installed, verify the installation by running

```
node -v
npm -v
```

**Linux Users (Ubuntu or Debian)**

1. From the terminal run the commands

```
sudo apt update
sudo apt install nodejs npm
```

2. Once they are installed, verify the installation by running

```
node -v
npm -v
```

## Installation Instructions

1. Run the command

```
npm install -g expo-cli
```

2. Clone the Github repository
3. From the root directory, run the commands

```
cd .\locally-app\
npm install
```

In order to install the project's dependancies.

### Start the Development Server

Run the following command to start the Expo development server:

```bash
npx expo start -c
```

This will compile and serve the app, displaying a QR code in the terminal.

### Run the App on Your Device

### Option 1: Use Expo Go on Mobile

1. Install **Expo Go** on your mobile device.
2. Open Expo Go, and scan the QR code generated in the terminal to load the app on your device.

### Option 2: Use an Emulator or Simulator

- **Android Emulator**:
  - Open Android Studio and launch an emulator.
  - In the terminal, press `a` to open the app on Android.
- **iOS Simulator (macOS only)**:
  - Open Xcode and launch an iOS simulator.
  - In the terminal, press `i` to open the app on iOS.

# Google Maps Setup
Get API Key:
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create/select a project
- Enable: Maps SDK (Android & iOS) and Places API
- Create API key in Credentials
### Configure Environment Variables
- In the root of the locally-app directory, create a .env file
- Add your API key:
``` 
GOOGLE_API_KEY=your_api_key_here
```