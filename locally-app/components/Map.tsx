import { Event } from "@/types/type";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import useLocationStore from '@/store/locationStore';
import { useRef, useEffect, useState } from 'react';
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useEventStore } from "@/store/event";
import { useFetch } from "@/lib/fetch";
import { fetchEventsByCity } from "@/services/firebase-service";

const Map = ({
  onMarkerSelect, 
  onPress
}: {
  onMarkerSelect: (event: Event) => void;
  onPress: () => void;
}) => {
  const mapRef = useRef<MapView>(null);
  const {
    userLatitude,
    userLongitude,
    userCity,
    destinationCity,
    destinationLatitude,
    destinationLongitude,
    setDestinationLocation,
  } = useLocationStore();

  const {
    events,
    setEvents,
    category
  } = useEventStore();

  const { data: fetchedEvents, refetch } = useFetch(
    () => fetchEventsByCity(destinationCity || userCity || ''), 
    [destinationCity],
  );
  const [eventList, setEventList] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

  useEffect(() => {
    if (fetchedEvents) {
      setEventList(fetchedEvents);
      setEvents(fetchedEvents);
    } 
  }, [fetchedEvents]);

  useEffect(() => {
    const filterEvents = async () => {
      setIsLoading(true);
      try {
        if (events) {
          const filteredEvents = await new Promise<Event[]>((resolve) => {
            setTimeout(() => {
              resolve(events.filter(
                (event) => category === "All" || event.category === category
              ));
            }, 0);
          });
          setEventList(filteredEvents);
        }
      } catch (error) {
        console.error("Error filtering events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    filterEvents();
  }, [category]);

  // Calculate the region based on the destination or user location
  const initialRegion =
    currentRegion || (destinationLatitude && destinationLongitude
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
      });

  // Animate to new region when destination changes
  useEffect(() => {
    const updateRegion = async () => {
      setIsLoading(true); // Start loading when region is being updated
      if (destinationLatitude && destinationLongitude && mapRef.current) {
        const newRegion = {
          latitude: destinationLatitude,
          longitude: destinationLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        mapRef.current.animateToRegion(newRegion, 1000); // Animate region change

        // Once the region is changed, stop loading
        setIsLoading(false); // Manually stop loading after the region update
      } else {
        setIsLoading(false); // If no destination, stop loading
      }
    };

    updateRegion();
  }, [destinationLatitude, destinationLongitude]);

  const handleUserLocationPress = async () => {
    setIsLoading(true);

    const userRegion = {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    setDestinationLocation(userLatitude, userLongitude, '', userCity || '');

    if (mapRef.current) {
      mapRef.current.animateToRegion(userRegion as Region, 1000);
    }

    onPress();
    setIsLoading(false);
  };

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region); // Remember region as the user interacts
  };

  return (
    <View style={styles.map}>
      {isLoading ? ( 
        <View className="flex-1 justify-center items-center w-screen h-[350px]">
          <ActivityIndicator color="#003566" size="large" />
        </View>
      ) : (
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          mapType="standard"
          initialRegion={initialRegion}
          region={currentRegion || initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {eventList.map((event, index) => {
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
      )}

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

