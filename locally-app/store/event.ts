import { EventStore } from "@/types/store";
import { Event, User } from "@/types/type";
import { create } from "zustand";

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  recentlySelectedEvents: [], // Tracks user-selected events

  // Action to add an event to recently selected
  addToRecentlySelected: (event: Event) => {
    set((state) => {
      // Spread state to ensure TypeScript understands it's part of the store

      const filteredEvents = state.recentlySelectedEvents.filter(
        (e) => e.id !== event.id
      );

       // Return the updated state
       return {
        ...state,
        recentlySelectedEvents: [...filteredEvents, event].slice(-10).reverse(),
      };

    });
  },

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