import { Timestamp } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string = null;
  isSubscribed: boolean = false;
  profileImage: string = "";
}

interface CategoryCardProps { // use this to define the types for the arguments
  label: string;
  iconName: any;
}

interface CardPopProps {
  event: Event;
  additionalStyling?: string;
  style?: string;
}

interface Ticket {
  ticketId: string;
  eventName: string;
  eventAddress: string;
  userName: string;
  orderNumber: string;
  date: Timestamp;
  time: string;
  numTickets: number;
  total: string;
  eventImage?: string;
  qrcode: string;

  eventId: string;
  userId: string;
}

// CardPop.tsx
interface Event {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  emote?: string;
  category?: string;
  coverImage?: string;
  dateCreated: Timestamp;
  dateStart: Timestamp;
  dateEnd?: Timestamp;
  price?: number;
  timeStart: string;
  timeEnd?: string;

  // organizer
  ownerId: string;
  owner?: User;

  // attendees
  attendeeIds?: string[];
  attendees?: User[];
}

interface CardPopProps {
  event: Event;
  styling?: string;
}

type PrimaryButtonProps = {
  text: string;
  onPress: () => void;
  icon?: any;
  bgColor?: string;
  textcolor?: string;
  iconBgColor?: string;
  iconColor?: string;
  iconVisible?: boolean;
  buttonStyle?: string;
  loading?: boolean;
};

interface TicketStore {
  ticket: Ticket | null;
  showHeader: boolean;
  setTicket: (ticket: Ticket) => void;
  setShowHeader: (show: boolean) => void;
  clearTicket: () => void;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: (latitude: number, longitude: number, address: string) => void;
  setDestinationLocation: (latitude: number, longitude: number, address: string) => void;
}

export type {
  User,
  CategoryCardProps,
  Event,
  CardPopProps,
  PrimaryButtonProps,
  Ticket,
  TicketStore,
  Location,
  LocationStore
}