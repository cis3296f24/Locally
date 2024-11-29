import { Timestamp } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string = null;
  isSubscribed: boolean = false;
  profileImage: string = "";

  // optional
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
  bio?: string;
  // bookmarkedEvents?: Event[];
  // hostedEvents?: Event[];
}

interface CategoryCardProps { // use this to define the types for the arguments
  label: string;
  iconName: any;
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

  // favorites
  isBookmarked?: boolean;
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
  textStyle?: string;
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

interface Message {
  id: string;
  text: string;
  timestamp: Timestamp;
  senderId: string;
  recipientId: string;
  sender?: User;
}

interface Conversation {
  id: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
  isRead?: boolean;
  recipient?: User; 
  participants: string[];
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
  Message,
  Conversation,
}