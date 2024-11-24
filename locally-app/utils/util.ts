import { Timestamp } from "firebase/firestore";

export const formatEventDate = (timestamp?: Timestamp, standardTime = false) => {
  if (!timestamp) return ''; // Handle undefined or null timestamp gracefully

  const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object

  const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits
  const monthShort = date.toLocaleString('default', { month: 'short' }); // Abbreviated month name (e.g., Jan, Feb)
  const monthLong = date.toLocaleString('default', { month: 'long' }); // Full month name (e.g., January)
  const year = date.getFullYear(); // Get the full year

  // Format based on the standardTime flag
  return standardTime
    ? `${monthShort} ${day}, ${year}` // MMM DD, YYYY
    : `${day} ${monthLong}, ${year}`; // DD Month, YYYY
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

export function formatFirestoreTimestamp(timestamp: Timestamp): string {
  const now = new Date();
  const time = timestamp.toDate();
  const diffMs = now.getTime() - time.getTime();

  const oneSecondMs = 1000;
  const oneMinuteMs = 60 * oneSecondMs;
  const oneHourMs = 60 * oneMinuteMs;
  const oneDayMs = 24 * oneHourMs;

  if (diffMs < oneMinuteMs) {
    return `Just now`;
  } else if (diffMs < oneHourMs) {
    const minutesAgo = Math.floor(diffMs / oneMinuteMs);
    return `${minutesAgo}m ago`;
  } else if (diffMs < oneDayMs) {
    const hoursAgo = Math.floor(diffMs / oneHourMs);
    return `${hoursAgo}h ago`;
  } else if (diffMs < 2 * oneDayMs) {
    return "yesterday";
  } else {
    return time.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}