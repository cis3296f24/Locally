import { Event, Ticket, User } from "./type";

interface TicketStore {
  ticket: Ticket | null;
  showHeader: boolean;
  setTicket: (ticket: Ticket) => void;
  setShowHeader: (show: boolean) => void;
  clearTicket: () => void;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

interface EventStore {
  events: Event[];                   
  selectedEvent: Event | null;       
  setEvents: (events: Event[]) => void;       
  setSelectedEvent: (event: Event) => void;   
  clearSelectedEvent: () => void; 
  
  filter: string;
  setFilter: (filter: string) => void;
}

interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  userCity: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  destinationCity: string | null;
  setUserLocation: (
    latitude: number | null, 
    longitude: number | null, 
    address: string | null, 
    city: string | null
  ) => void;
  setDestinationLocation: (
    latitude: number | null, 
    longitude: number | null, 
    address: string | null,
    city: string | null
  ) => void;
}

export type {
  TicketStore,
  UserStore,
  EventStore,
  LocationStore
}