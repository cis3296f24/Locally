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
  
interface MapProps {
  onMarkerSelect: (event: Event) => void;
}

interface CardPopProps {
  event: Event;
  additionalStyling?: string;
  style?: string;
}

interface Ticket {
  eventName: string;
  eventAddress: string;
  userName: string;
  orderNumber: string;
  date: string;
  time: string;
  numTickets: number;
  total: number;
  eventImage: ImageSourcePropType | undefined;
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
  city: string;
  // emote?: string;
  category?: string;
  coverImage?: string;
  dateCreated: Timestamp;
  dateStart: Timestamp;
  dateEnd?: Timestamp;
  price?: number;
  timeStart?: string;
  timeEnd?: string;
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

export type { 
  User,
  CategoryCardProps, 
  MapProps, 
  Event,
  CardPopProps, 
  PrimaryButtonProps,
  Ticket, 
}
