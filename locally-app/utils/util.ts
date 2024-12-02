import { Timestamp } from "firebase/firestore";

const resetTime = (date: Date) => {
  // Create a new Date object and reset the time to the start of the day (midnight)
  const resetDate = new Date(date);
  resetDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  return resetDate;
};

export const formatEventDate = (
  startTimestamp?: Timestamp,
  endTimestamp?: Timestamp,
  standardTime = false
) => {
  if (!startTimestamp) return ''; // Handle undefined or null startTimestamp gracefully

  // Convert Firestore Timestamps to JavaScript Date objects
  const startDate = startTimestamp.toDate();
  const endDate = endTimestamp?.toDate();

  // Reset time to the start of the day for both start and end dates
  const resetStartDate = resetTime(startDate);
  const resetEndDate = endDate ? resetTime(endDate) : null;

  const dayStart = String(startDate.getDate()).padStart(2, '0'); // Ensure start day is two digits
  const monthStartShort = startDate.toLocaleString('default', { month: 'short' }); // Abbreviated month name (e.g., Dec)
  const monthStartLong = startDate.toLocaleString('default', { month: 'long' }); // Full month name (e.g., December)
  const yearStart = startDate.getFullYear(); // Get the start year

  let formattedDate = `${dayStart} ${monthStartShort}, ${yearStart}`; // Default format (DD Month, YYYY)

  // If an end date is provided, handle the date range logic
  if (endDate && resetEndDate) {
    const dayEnd = String(endDate.getDate()).padStart(2, '0');
    const monthEndShort = endDate.toLocaleString('default', { month: 'short' }); // Abbreviated month name
    const yearEnd = endDate.getFullYear();

    // Case 1: Start and end dates are the same day
    if (resetStartDate.getTime() === resetEndDate.getTime()) {
      formattedDate = `${dayStart} ${monthStartLong}, ${yearStart}`;
    }
    // Case 2: Start and end dates are in the same month and year
    else if (monthStartShort === monthEndShort && yearStart === yearEnd) {
      formattedDate = `${dayStart} - ${dayEnd} ${monthStartShort}, ${yearStart}`;
    }
    // Case 3: Start and end dates are in different months but the same year
    else if (monthStartShort !== monthEndShort && yearStart === yearEnd) {
      formattedDate = `${dayStart} ${monthStartShort} - ${dayEnd} ${monthEndShort}, ${yearStart}`;
    }
    // Case 4: Start and end dates are in different years
    else {
      formattedDate = `${dayStart} ${monthStartShort}, ${yearStart} - ${dayEnd} ${monthEndShort}, ${yearEnd}`;
    }
  }

  // Return the formatted date based on standardTime flag
  return standardTime
    ? `${monthStartShort} ${dayStart}, ${yearStart}` // Short Month DD, YYYY
    : formattedDate; // DD Month, YYYY or Date Range
};

export const formatDate = (dateStart?: Timestamp) => {
  const date = dateStart?.toDate();
  const weekday = date?.toLocaleString('default', { weekday: 'short' });
  const day = String(date?.getDate()).padStart(2, '0'); 
  const month = date?.toLocaleString('default', { month: 'short' });

  return `${weekday}, ${month} ${day}`;
};

export const formatEventDateAndTime = (
  dateStart?: Timestamp,
  dateEnd?: Timestamp,
  timeStart?: string,
  timeEnd?: string
) => {
  // Convert Timestamps to Date objects
  const startDate = dateStart?.toDate();
  const endDate = dateEnd?.toDate();

  const resetStartDate = resetTime(startDate as Date);
  const resetEndDate = resetTime(endDate as Date);

  // Get the weekday for the start date (e.g., "Saturday")
  const dayOfWeek = startDate?.toLocaleString('default', { weekday: 'long' });

  // Format the start time and end time (if provided)
  const formattedTime = `${timeStart}${timeEnd ? ` - ${timeEnd}` : ''}`;

  // If start and end date are the same, include the weekday and time
  if (startDate && endDate && resetStartDate.getTime() === resetEndDate.getTime()) {
    return `${dayOfWeek}, ${formattedTime}`;
  } else {
    // If start and end date are different, just show the time range
    return `${formattedTime}`;
  }
};

export const formatDetailsEventDateAndTime = (
  dateStart?: Timestamp, 
  timeStart?: string
): string => {
  if (!dateStart || !timeStart) return '';

  const startDate = dateStart.toDate();

  // Format the date to "Sun, Nov 24"
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short', // Abbreviated day (e.g., Sun)
    month: 'short',   // Abbreviated month (e.g., Nov)
    day: 'numeric',   // Numeric day (e.g., 24)
  });

  return `${formattedDate} • ${timeStart}`;
};

export const formatTimeLeft = (timeStart: Timestamp): string => {
  const now = new Date(); 
  const startDate = timeStart.toDate(); 

  const timeDiff = startDate.getTime() - now.getTime();

  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return 'Today';
  }

  return `~ ${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
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