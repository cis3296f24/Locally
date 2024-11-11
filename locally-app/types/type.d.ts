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
}

interface CardPopProps {
  event: Event;
  styling?: string;
}

export type { 
  User,
  CategoryCardProps, 
  MapProps, 
  Event, 
  CardPopProps 
}