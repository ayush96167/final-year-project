import { create } from "zustand";

type StationSlots = {
  [stationId: number]: string[];
};

type BookingStore = {
  bookedSlots: StationSlots;
  bookSlot: (stationId: number, slot: string) => void;
  isSlotBooked: (stationId: number, slot: string) => boolean;
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookedSlots: {},

  bookSlot: (stationId, slot) =>
    set((state) => ({
      bookedSlots: {
        ...state.bookedSlots,
        [stationId]: [
          ...(state.bookedSlots[stationId] || []),
          slot,
        ],
      },
    })),

  isSlotBooked: (stationId, slot) =>
    get().bookedSlots[stationId]?.includes(slot) ?? false,
}));
