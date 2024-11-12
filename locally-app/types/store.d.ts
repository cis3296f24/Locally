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
}

export type {
  TicketStore,
  UserStore,
  EventStore
}