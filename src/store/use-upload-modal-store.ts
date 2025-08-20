import { create } from "zustand";

type UploadStoreModal = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useUploadStoreModal = create<UploadStoreModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));