import { EventStore } from "@/types/store";
import { Event, User } from "@/types/type";
import { create } from "zustand";

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events: Event[]) => set({ events: events }),
  setSelectedEvent: (event: Event) => set({ selectedEvent: event }),
  clearSelectedEvent: () => set({ selectedEvent: null }),

  shouldClearSelectedEvent: false,
  setShouldClearSelectedEvent: (shouldClear: boolean) => set({ shouldClearSelectedEvent: shouldClear }),

  eventOwner: null,
  setEventOwner: (user: User) => set({ eventOwner: user }),

  filteredEvents: [],
  setFilteredEvents: (events: Event[]) => set({ filteredEvents: events }),

  listTitle: "",
  setListTitle: (title: string) => set({ listTitle: title }),
  category: "All",
  setCategory: (category: string) => set({ category }),
}));