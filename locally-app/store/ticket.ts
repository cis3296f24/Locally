import { TicketStore } from "@/types/store";
import { Ticket } from "@/types/type";
import { create } from "zustand";

export const useTicketStore = create<TicketStore>((set) => ({
  ticketList: [],
  selectedTicket: null,
  showHeaderTitle: true,
  setTicketList: (tickets: Ticket[]) => set({ ticketList: tickets }),
  setSelectedTicket: (ticket: Ticket) => set({ selectedTicket: ticket }),
  setShowHeaderTitle: (showHeader: boolean) => set({ showHeaderTitle: showHeader }),
  clearTicketList: () => set({ ticketList: [] }),
  clearSelectedTicket: () => set({ selectedTicket: null })
}));