import { Event } from "@/types/type";
import { SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import useLocationStore from '@/store/locationStore';
import { useRef, useEffect } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { getUserCity } from "@/services/storage-service";

// map component
const Map = ({ 
  events,
  onMarkerSelect,
}: {
  events: Event[];
  onMarkerSelect: (event: Event) => void;
}) => {
  const mapRef = useRef<MapView>(null);
  const {
    userLatitude,
    userLongitude,
    userCity,
    destinationLatitude,
    destinationLongitude,
    setDestinationLocation,
  } = useLocationStore();

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

  const handleUserLocationPress = () => {
    setDestinationLocation(userLatitude, userLongitude, '', userCity || '');
    if (userLatitude && userLongitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.0922, // Default zoom
          longitudeDelta: 0.0421,
        },
        1000 // Animation duration
      );
      // setUserCity( userCity || '' )
    }
    console.log("User City:", userCity);
  };

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        mapType="standard"
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {events.map((event, index) => (
          <Marker 
            key={index}
            coordinate={{
              latitude: event.coordinate.latitude,
              longitude: event.coordinate.longitude
            }}
            title={event.title}
            onSelect={() => {
              mapRef.current?.animateToRegion(
                {
                  latitude: event.coordinate.latitude,
                  longitude: event.coordinate.longitude,
                  latitudeDelta: 0.03, 
                  longitudeDelta: 0.03,
                },
                1000 
              );
              onMarkerSelect(event)
            }}
          >
            <View className='bg-orange-400 rounded-full p-1'>
              <Text className="text-white text-xs font-medium">📍</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity 
        className="absolute bottom-[2%] right-[4%] p-4 bg-white rounded-full"
        onPress={handleUserLocationPress}
      >
        <View className="pr-1 py-0.5">
          <FontAwesome name="paper-plane" size={24} color="orange" />
        </View>
      </TouchableOpacity>
    </View>
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

