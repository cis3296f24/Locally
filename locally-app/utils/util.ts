import { Timestamp } from "firebase/firestore";

export const formatEventDate = (timestamp?: Timestamp) => {
  const date = timestamp?.toDate();

  const day = String(date?.getDate()).padStart(2, '0'); 
  const month = date?.toLocaleString('default', { month: 'long' });
  const year = date?.getFullYear();

  return `${day} ${month}, ${year}`;
};

export const formatDate = (dateStart?: Timestamp) => {
  const date = dateStart?.toDate();
  const weekday = date?.toLocaleString('default', { weekday: 'short' });
  const day = String(date?.getDate()).padStart(2, '0'); 
  const month = date?.toLocaleString('default', { month: 'short' });

  return `${weekday}, ${month} ${day}`;
};

export const formatEventDateAndTime = (dateStart?: Timestamp, timeStart?: string, timeEnd?: string) => {
  // Convert Timestamp to Date object
  const startDate = dateStart?.toDate();
  
  const dayOfWeek = startDate?.toLocaleString('default', { weekday: 'long' });

  // Format the time range (start time and end time)
  const formattedTime = `${timeStart}${timeEnd ? ` - ${timeEnd}` : ''}`; 

  // Combine day and time
  return `${dayOfWeek}, ${formattedTime}`;
};

export const formatAddress = (
  street?: string, 
  city?: string, 
  state?: string, 
  zipCode?: string
): string => {
  return `${street}, ${city}, ${state} ${zipCode}`;
};