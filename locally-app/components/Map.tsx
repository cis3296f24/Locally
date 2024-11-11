import { Event, MapProps } from "@/types/type"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { Image } from "react-native"
import { images } from "@/constants"

// map component
const Map = ({ onMarkerSelect }: MapProps) => {

  const events: Event[] = [
    {
      id: 1,
      title: "Candlelight Fine Dining",
      coordinate: {
        latitude: 39.965519,
        longitude: -75.181053,
      },
      emote: "🍽️",
      category: "dining"
    },
    {
      id: 2,
      title: "Art Exhibition",
      coordinate: {
        latitude: 39.9526,
        longitude: -75.1652,
      },
      emote: "🎨",
      category: "exhibition",
      image: images.painting
    },
  ]

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      mapType="mutedStandard"
      initialRegion={{
        latitude: 39.9526,       // Latitude for Philadelphia
        longitude: -75.1652,     // Longitude for Philadelphia
        latitudeDelta: 0.06,     // Adjust these values for zoom level
        longitudeDelta: 0.06,    // Adjust these values for zoom level
      }}
    >
      {events.map((event) => (
        <Marker
          key={event.id}
          coordinate={event.coordinate}
          onPress={() => onMarkerSelect(event)}
        >
          <View className="bg-blue-500 rounded-2xl px-3 py-1.5">
            <Text className="text-white text-xs font-medium">{event.emote}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  )
}

export default Map

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

// export default Map

// // if google map were to work, this would be the custom theme of the map to match the mockup

// const mapJson = [
//     {
//       "stylers": [
//         {
//           "color": "#f5ecff"
//         }
//       ]
//     },
//     {
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#dedede"
//         }
//       ]
//     },
//     {
//       "elementType": "labels.icon",
//       "stylers": [
//         {
//           "visibility": "off"
//         }
//       ]
//     },
//     {
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#616161"
//         }
//       ]
//     },
//     {
//       "elementType": "labels.text.stroke",
//       "stylers": [
//         {
//           "color": "#f5f5f5"
//         }
//       ]
//     },
//     {
//       "featureType": "administrative.land_parcel",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#bdbdbd"
//         }
//       ]
//     },
//     {
//       "featureType": "landscape",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#ebebeb"
//         }
//       ]
//     },
//     {
//       "featureType": "poi",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#e6e6e6"
//         }
//       ]
//     },
//     {
//       "featureType": "poi",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#757575"
//         }
//       ]
//     },
//     {
//       "featureType": "poi.park",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#ebebeb"
//         }
//       ]
//     },
//     {
//       "featureType": "poi.park",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#9e9e9e"
//         }
//       ]
//     },
//     {
//       "featureType": "road",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#ffffff"
//         }
//       ]
//     },
//     {
//       "featureType": "road.arterial",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#757575"
//         }
//       ]
//     },
//     {
//       "featureType": "road.highway",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#dadada"
//         }
//       ]
//     },
//     {
//       "featureType": "road.highway",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#616161"
//         }
//       ]
//     },
//     {
//       "featureType": "road.local",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#9e9e9e"
//         }
//       ]
//     },
//     {
//       "featureType": "transit.line",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#e5e5e5"
//         }
//       ]
//     },
//     {
//       "featureType": "transit.station",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#eeeeee"
//         }
//       ]
//     },
//     {
//       "featureType": "water",
//       "stylers": [
//         {
//           "color": "#ffffff"
//         }
//       ]
//     },
//     {
//       "featureType": "water",
//       "elementType": "geometry",
//       "stylers": [
//         {
//           "color": "#f6f6f6"
//         }
//       ]
//     },
//     {
//       "featureType": "water",
//       "elementType": "labels.text.fill",
//       "stylers": [
//         {
//           "color": "#9e9e9e"
//         }
//       ]
//     }
//   ]