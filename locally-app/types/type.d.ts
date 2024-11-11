import { Image } from "react-native";

interface CategoryCardProps { // use this to define the types for the arguments
    label: string; 
    iconName: any;
  }
  
  interface MapProps {
    onMarkerSelect: (event: Event) => void;
  }
  
  // CardPop.tsx
  interface Event {
    id: number;
    title: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    emote: string;
    category: string;
    image?: ImageSourcePropType | undefined;
  }
  
  interface CardPopProps {
    event: Event;
    additionalStyling?: string;
    style?: string;
}

  interface Ticket{
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

export type { CategoryCardProps, MapProps, Event, CardPopProps, Ticket }