import { TicketStore } from "@/types/store";
import { Ticket } from "@/types/type";
import { create } from "zustand";

export const useTicketStore = create<TicketStore>((set) => ({
  ticket: null,
  showHeader: true,
  setTicket: (ticket: Ticket) => set(() => ({ ticket: ticket })),
  setShowHeader: (show: boolean) => set(() => ({ showHeader: show })),
  clearTicket: () => set(() => ({ ticket: null, showHeader: true })),
}));