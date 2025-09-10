import { Kpi } from "@/generated/prisma";
import { create } from "zustand";

type ModalType = "create" | "edit";

type BonusModalStore = {
  type: ModalType | null;
  isOpen: boolean;
  kpi: Kpi | null;
  onOpen: (type: ModalType, kpi?: Kpi) => void;
  onClose: () => void;
}

export const useBonusModalStore = create<BonusModalStore>((set) => ({
  isOpen: false,
  context: "",
  type: null,
  kpi: null,
  onOpen: (type, kpi) => set({ isOpen: true, type, kpi }),
  onClose: () => set({ isOpen: false }),
}));