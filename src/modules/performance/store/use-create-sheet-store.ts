import { create } from "zustand";

type CreateType = "kpi-bonus" | "kpi-merit";

type CreateSheetStore = {
  isOpen: boolean;
  type: CreateType | null;
  onOpen: (type: CreateType) => void;
  onClose: () => void;
}

export const useCreateSheetStore = create<CreateSheetStore>((set) => ({
  isOpen: false,
  type: null,
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));