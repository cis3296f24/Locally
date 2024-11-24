import { EventStore } from "@/types/store";
import { Event } from "@/types/type";
import { create } from "zustand";

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events: Event[]) => set({ events }),
  setSelectedEvent: (event: Event) => set({ selectedEvent: event }),
  clearSelectedEvent: () => set({ selectedEvent: null }),

  listTitle: "",
  setListTitle: (title: string) => set({ listTitle: title }),
  category: "All",
  setCategory: (category: string) => set({ category }),
}));