import { Event, Ticket, User } from "./type";

interface TicketStore {
  ticketList: Ticket[];
  selectedTicket: Ticket | null;
  showHeaderTitle: boolean;
  setTicketList: (tickets: Ticket[]) => void;
  setSelectedTicket: (ticket: Ticket) => void;
  setShowHeaderTitle: (showHeader: boolean) => void;
  clearTicketList: () => void;
  clearSelectedTicket: () => void;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;

  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  clearSelectedUser: () => void;

  userList: User[];
  setUserList: (users: User[]) => void;
  clearUserList: () => void;
}

interface EventStore {
  events: Event[];                   
  selectedEvent: Event | null;       
  setEvents: (events: Event[]) => void;       
  setSelectedEvent: (event: Event) => void;   
  clearSelectedEvent: () => void; 
  
  listTitle: string;
  setListTitle: (title: string) => void;
  category: string;
  setCategory: (category: string) => void;
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