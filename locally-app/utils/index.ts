import { Timestamp } from "firebase/firestore";

export const formatEventDate = (timestamp?: Timestamp) => {
  const date = timestamp?.toDate();

  const day = String(date?.getDate()).padStart(2, '0'); 
  const month = date?.toLocaleString('default', { month: 'long' });
  const year = date?.getFullYear();

  return `${day} ${month}, ${year}`;
};

export const formatEventDateAndTime = (dateStart?: Timestamp, timeStart?: string, timeEnd?: string) => {
  // Convert Timestamp to Date object
  const startDate = dateStart?.toDate();
  
  // Get the day of the week (e.g., "Friday")
  const dayOfWeek = startDate?.toLocaleString('default', { weekday: 'long' });

  // Format the time range (start time and end time)
  const formattedTime = `${timeStart} - ${timeEnd || 'TBD'}`; // Use 'TBD' if timeEnd is not available

  // Combine day and time
  return `${dayOfWeek}, ${formattedTime}`;
};

