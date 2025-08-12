import { create } from "zustand";

type CreateSheetStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateSheetStore = create<CreateSheetStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));