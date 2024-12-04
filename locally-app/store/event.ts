import { EventStore } from "@/types/store";
import { Event, User } from "@/types/type";
import { create } from "zustand";

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events: Event[]) => set({ events: events }),
  setSelectedEvent: (event: Event) => set({ selectedEvent: event }),
  clearSelectedEvent: () => set({ selectedEvent: null }),

  filteredEvents: [],
  setFilteredEvents: (events: Event[]) => set({ filteredEvents: events }),

  eventStack: [],
  setEventStack: (events: Event[]) => set({ eventStack: events }),

  listTitle: "",
  setListTitle: (title: string) => set({ listTitle: title }),
  category: "All",
  setCategory: (category: string) => set({ category }),
}));