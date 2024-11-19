import { Event } from "@/types/type";
import { SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import useLocationStore from '@/store/locationStore';
import { useRef, useEffect } from 'react';
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { getUserCity } from "@/services/storage-service";

// map component
const Map = ({ 
  events,
  // category,
  onMarkerSelect,
  onPress
}: {
  events: Event[];
  // category: string;
  onMarkerSelect: (event: Event) => void;
  onPress: () => void;
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
    onPress();
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
        {events?.map((event, index) => {
          const categoryEmojis = {
            Celebration: { color: '#F1573D', emoji: 'celebration' },
            Exhibition: { color: '#5669FF', emoji: 'museum' },
            Entertainment: { color: '#FFC300', emoji: 'stars' },
            Social: { color: '#39C3F2', emoji: 'handshake' },
            Community: { color: '#7ED321', emoji: 'groups' },
          };

          const category = event.category as keyof typeof categoryEmojis;
          const { color, emoji } = categoryEmojis[category];

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: event.coordinate.latitude,
                longitude: event.coordinate.longitude,
              }}
              // title={event.title}
              onSelect={() => {
                mapRef.current?.animateToRegion(
                  {
                    latitude: event.coordinate.latitude,
                    longitude: event.coordinate.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                  },
                  1000 // animation duration
                );
                onMarkerSelect(event);
              }}
            >
              <View className="rounded-full p-1 bg-white">
                <MaterialIcons name={emoji as any} size={20} color={color} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity 
        className="absolute bottom-[40%] right-[4%] p-3 bg-white rounded-full"
        onPress={handleUserLocationPress}
      >
        <View className="pr-1 py-0.5">
          <FontAwesome name="paper-plane" size={20} color="#39C3F2" />
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

