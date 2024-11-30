import { User } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveCurrentUser = async (user: User) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('Object stored successfully!', user);
  } catch (error) {
    console.error('Error storing object', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser !== null) {
      const user = JSON.parse(storedUser);
      // console.log('Retrieved object:', user);
      return user;
    } else {
      console.log('No object found');
    }
  } catch (error) {
    console.error('Error retrieving object', error);
  }
};

export const removeCurrentUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
    console.log('Object removed successfully!');
  } catch (error) {
    console.error('Error removing object', error);
  }
};

export const setUserCity = async (city: string) => {
  try {
    await AsyncStorage.setItem('city', city);
    console.log('City stored successfully!', city);
  } catch (error) {
    console.log('Error storing city', error);
  }
}

export const getUserCity = async () => {
  try {
    const storedCity = await AsyncStorage.getItem('city');
    if (storedCity !== null) {
      return storedCity;
    } else {
      return "Philadelphia";
    }
  } catch (error) {
    return "Philadelphia";
  }
}