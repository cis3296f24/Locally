import { Event, MapProps } from "@/types/type";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import useLocationStore from '@/store/locationStore';
import { useRef, useEffect } from 'react';

// map component
const Map = ({ onMarkerSelect }: MapProps) => {
  const mapRef = useRef<MapView>(null);
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  console.log('Map component received locations:', {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  const events: Event[] = [
    {
      id: "1",
      title: "Candlelight Fine Dining",
      coordinate: {
        latitude: 39.965519,
        longitude: -75.181053,
      },
      city: "Philadelphia",
      emote: "🍽️",
      category: "dining",
    },
    {
      id: "2",
      title: "Art Exhibition",
      coordinate: {
        latitude: 39.9526,
        longitude: -75.1652,
      },
      city: "Philadelphia",
      emote: "🎨",
      category: "exhibition",
    },
  ];

  // Calculate the region based on the destination or user location
  const region = destinationLatitude && destinationLongitude
    ? { //Destination
      latitude: destinationLatitude,
      longitude: destinationLongitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    : userLatitude && userLongitude
      ? { //User location
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      : { //Fallback region
        latitude: 39.9526,
        longitude: -75.1652,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  // Animate to new region when destination changes
  useEffect(() => {
    if (destinationLatitude && destinationLongitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: destinationLatitude,
        longitude: destinationLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000); // 1000ms animation duration
    }
  }, [destinationLatitude, destinationLongitude]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      mapType="standard"
      initialRegion={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {events.map((event) => (
        <Marker
          key={event.id}
          coordinate={event.coordinate}
          title={event.title}
          onPress={() => onMarkerSelect(event)}
        >
          <View style={styles.marker}>
            <Text style={styles.markerText}>{event.emote}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Map;

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