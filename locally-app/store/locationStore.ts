import { create } from 'zustand';
import { LocationStore } from "@/types/type"

const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  userCity: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: (latitude, longitude, address, city: string) =>
    set({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
      userCity: city
    }),
  setDestinationLocation: (latitude, longitude, address) =>
    set({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }),
}));

export default useLocationStore;