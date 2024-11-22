import { LocationStore } from '@/types/store';
import { create } from 'zustand';

const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  userCity: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  destinationCity: null,
  setUserLocation: (latitude, longitude, address, city) =>
    set({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
      userCity: city
    }),
  setDestinationLocation: (latitude, longitude, address, city) =>
    set({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
      destinationCity: city
    }),
}));

export default useLocationStore;